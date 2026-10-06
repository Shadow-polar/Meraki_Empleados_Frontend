import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Cliente } from '../services/cliente';

@Component({
  selector: 'app-clientes',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './clientes.html',
  styleUrl: './clientes.css'
})
export class Clientes implements OnInit {

  clientes: any[] = [];

  nuevoCliente: any = {
    nombre: '',
    correo: '',
    contrasena: '',
    direccion: '',
    celular: ''
  };

  clienteEditando: any = null;

  // Término utilizado para buscar clientes
  terminoBusqueda: string = '';

  // Mensaje que solamente utilizaremos para actualizar
  mensaje: string = '';

  constructor(
    private clienteService: Cliente,
    private cdr: ChangeDetectorRef
  ) {
  }

  // Obtener los clientes desde el backend
  cargarClientes() {
    this.clienteService.obtenerClientes().subscribe({
      next: (datos) => {
        console.log('Clientes recibidos:', datos);

        this.clientes = [...(datos as any[])];

        console.log('Clientes guardados:', this.clientes);

        this.cdr.detectChanges();
      },

      error: (error) => {
        console.error('Error al obtener los clientes:', error);
      }
    });
  }

  ngOnInit() {
    this.cargarClientes();
  }

  // Clientes filtrados según la búsqueda
  get clientesFiltrados() {

    const termino = this.terminoBusqueda
      .trim()
      .toLowerCase();

    if (!termino) {
      return this.clientes;
    }

    return this.clientes.filter(cliente =>
      cliente.nombre?.toLowerCase().includes(termino) ||
      cliente.correo?.toLowerCase().includes(termino) ||
      cliente.direccion?.toLowerCase().includes(termino) ||
      cliente.celular?.toLowerCase().includes(termino)
    );
  }

  // Registrar o actualizar un cliente
  registrarCliente() {

    const clienteParaEnviar = {
      nombre: this.nuevoCliente.nombre,
      correo: this.nuevoCliente.correo,
      contraseña: this.nuevoCliente.contrasena,
      direccion: this.nuevoCliente.direccion,
      celular: this.nuevoCliente.celular
    };

    // Si estamos editando un cliente
    if (this.clienteEditando) {

      this.clienteService.actualizarCliente(
        this.clienteEditando._id,
        clienteParaEnviar
      ).subscribe({

        next: (clienteActualizado) => {

          console.log(
            'Cliente actualizado:',
            clienteActualizado
          );

          this.clientes = this.clientes.map(cliente =>
            cliente._id === this.clienteEditando._id
              ? clienteActualizado
              : cliente
          );

          // Mostrar solamente este mensaje cuando la actualización sea correcta
          this.mensaje =
            'Cliente actualizado correctamente';

          this.clienteEditando = null;

          this.nuevoCliente = {
            nombre: '',
            correo: '',
            contrasena: '',
            direccion: '',
            celular: ''
          };

          this.cdr.detectChanges();
        },

        error: (error) => {

          console.error(
            'Error al actualizar el cliente:',
            error
          );

        }

      });

      return;
    }

    // Si NO estamos editando, registramos un cliente nuevo
    this.mensaje = '';

    this.clienteService.crearCliente(clienteParaEnviar).subscribe({

      next: (cliente) => {

        console.log(
          'Cliente registrado:',
          cliente
        );

        this.clientes = [
          ...this.clientes,
          cliente
        ];

        this.nuevoCliente = {
          nombre: '',
          correo: '',
          contrasena: '',
          direccion: '',
          celular: ''
        };

        this.cdr.detectChanges();
      },

      error: (error) => {

        console.error(
          'Error al registrar el cliente:',
          error
        );

      }

    });
  }

  // Eliminar un cliente
  eliminarCliente(id: string) {

    this.clienteService.eliminarCliente(id).subscribe({

      next: () => {

        console.log(
          'Cliente eliminado correctamente'
        );

        this.clientes = this.clientes.filter(
          cliente => cliente._id !== id
        );

        this.cdr.detectChanges();
      },

      error: (error) => {

        console.error(
          'Error al eliminar el cliente:',
          error
        );

      }

    });
  }

  // Seleccionar un cliente para editar
  editarCliente(cliente: any) {

    console.log(
      'Cliente seleccionado para editar:',
      cliente
    );

    this.clienteEditando = cliente;

    this.mensaje = '';

    this.nuevoCliente = {
      nombre: cliente.nombre,
      correo: cliente.correo,
      contrasena: cliente.contraseña,
      direccion: cliente.direccion,
      celular: cliente.celular
    };
  }

}
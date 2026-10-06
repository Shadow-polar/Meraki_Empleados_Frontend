import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class Cliente {

  private apiUrl = 'https://despliegue-empleados-backend.vercel.app/clientes';

  constructor(private http: HttpClient) {

  }

  // Obtener todos los clientes
  obtenerClientes() {
    return this.http.get(this.apiUrl);
  }

  // Crear un nuevo cliente
  crearCliente(cliente: any) {
    return this.http.post(this.apiUrl, cliente);
  }

  // Obtener un cliente por su ID
  obtenerCliente(id: string) {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  // Actualizar un cliente
  actualizarCliente(id: string, cliente: any) {
    return this.http.patch(`${this.apiUrl}/${id}`, cliente);
  }

  // Eliminar un cliente
  eliminarCliente(id: string) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

}
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class PEmpresasService {
    private http = inject(HttpClient);
    private userService = inject(UserService);
    
    obtenerEmpresaPorId(): Observable<any> {
      const empresaData = this.userService.getUserData(); // Método para obtener los datos del usuario
      const url = 'https://malo-backend-empresas.onrender.com/api/Empresa/GetEmpresaPorId';
      const requestBody = JSON.stringify(empresaData.sub); // Convierte el ID directamente en una cadena JSON
      
      return this.http.post<any>(url, requestBody, {
          headers: new HttpHeaders({
              'Content-Type': 'application/json',
              'accept': 'application/json'
          })
      });
  }
  

    actualizarEmpresa(empresaData: any): Observable<any> {
    const url = 'https://malo-backend-empresas.onrender.com/api/Empresa/actualizar-empresa';
    
    // Enviar los datos de la empresa en el cuerpo de la solicitud
    return this.http.post<any>(url, empresaData);
    }      
}
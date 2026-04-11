// src/app/services/users.service.ts
import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUsuarios}/users`; // http://localhost:4000/anteiku/users

  private getHeaders() {
        const token = localStorage.getItem('token'); // La llave que usaste en AuthService
        return new HttpHeaders({
            // Si tu middleware usa req.headers.authorization
            'Authorization': `Bearer ${token}`
        });
    }

  getUsers(): Observable<any> {
    return this.http.get<any>(this.apiUrl, { headers: this.getHeaders() });
  }

  createUser(userData: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, userData, { headers: this.getHeaders() });
  }

  updateUser(id: number, userData: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, userData, { headers: this.getHeaders() });
  }

  deleteUser(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  // Opcional: Para cargar el MultiSelect dinámicamente
  getPermisos(): Observable<any> {
    return this.http.get<any>(`${environment.apiUsuarios}/permisos`, { headers: this.getHeaders() });
  }
}
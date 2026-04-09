// src/app/services/users.service.ts
import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUsuarios}/users`; // http://localhost:4000/anteiku/users

  getUsers(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }

  createUser(userData: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, userData);
  }

  updateUser(id: number, userData: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, userData);
  }

  deleteUser(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }

  // Opcional: Para cargar el MultiSelect dinámicamente
  getPermisos(): Observable<any> {
    return this.http.get<any>(`${environment.apiUsuarios}/permisos`);
  }
}
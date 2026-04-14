import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../environments/environment';
import { PermissionsService } from './permissions.service';
import { Router } from '@angular/router';
import { UserRegister, AuthResponse } from '../models/register.interface';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private permsSvc = inject(PermissionsService);
  private router = inject(Router);
  
  private apiUrlAuth = environment.apiUsuariosAuth; // http://localhost:4000/anteiku
  private apiUrl = environment.apiUsuarios; // http://localhost:4000/anteiku

  register(userData: UserRegister): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrlAuth}/signup`, userData);
  }

  async login(credentials: any): Promise<boolean> {
    try {
      const response: any = await firstValueFrom(
        this.http.post(`${this.apiUrlAuth}/login`, credentials, {
          withCredentials: true
        })
      );

      // Validamos según el formato de tu backend (statusCode 200)
      if (response && response.statusCode === 200 && response.data.length > 0) {
        const loginData = response.data[0];
        
        // 1. Guardamos el Token
        localStorage.setItem('token', loginData.token);
        
        // 2. Guardamos datos básicos del usuario (opcional, para mostrar su nombre)
        localStorage.setItem('user_info', JSON.stringify(loginData.user));

        // 3. Gestionamos los permisos que YA vienen en la respuesta
        const perms = loginData.permissions; // ["user:view", etc.]
        this.permsSvc.setPermissions(perms);
        localStorage.setItem('user_perms', JSON.stringify(perms));
        
        return true;
      }
      return false;
    } catch (error: any) {
      console.error('Error en el login:', error);
      return false;
    }
  }

  private permissions = new BehaviorSubject<number[]>([]); // O string[] según uses IDs o nombres

  setGroupPermissions(newPerms: number[]) {
      this.permsSvc.setGroupPermissions(newPerms);
      // Opcional: Guardarlos en SessionStorage para que si refresca la página no se pierdan
      sessionStorage.setItem('current_group_perms', JSON.stringify(newPerms));
  }

  //validar permiso hasPermissions tickets:move
  hasPermission(perm: string): boolean {
    return this.permsSvc.hasPermission(perm);
  }

  checkSession() {
    const savedPerms = localStorage.getItem('user_perms');
    if (savedPerms) {
      this.permsSvc.setPermissions(JSON.parse(savedPerms));
    }
  }

  isLoggedIn(): boolean {
  return !!localStorage.getItem('token'); // Devuelve true si existe el token
  }
  
async logout() {
    try {
      await firstValueFrom(
        this.http.post(`${this.apiUrlAuth}/logout`, {}, {
          withCredentials: true
        })
      );
    } catch (error) {
      console.error('Error en el logout:', error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user_perms');
      localStorage.removeItem('user_info');
      this.permsSvc.setPermissions([]);
      this.router.navigate(['/']);
    }
  }
}
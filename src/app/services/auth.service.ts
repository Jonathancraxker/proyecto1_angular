import { inject, Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { firstValueFrom, tap } from 'rxjs';
import { PermissionsService } from './permissions.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private permsSvc = inject(PermissionsService);
  
  // La URL base que te pasó tu profesor
  private apiUrl = 'https://spatial-delcine-devemma-edfc3f92.koyeb.app';

  async login(credentials: any) {
  try {
    const response: any = await firstValueFrom(
      this.http.post(`${this.apiUrl}/login`, credentials)
    );

    // Si el login es exitoso (statusCode 200)
    if (response && response.statusCode === 200) {
      
      // 1. Ahora pedimos los permisos a la ruta /permissions
      const permsResponse: any = await firstValueFrom(
        this.http.get(`${this.apiUrl}/permissions`)
      );

      // 2. Buscamos los permisos en la respuesta (según tu primera imagen de la API)
      if (permsResponse && permsResponse.data && permsResponse.data[0].permissions) {
        
        // OJO: Aquí el profe nos dio una lista general. 
        // Por ahora, para que te funcione la práctica, cargaremos todos los del Admin 
        // si el login fue exitoso, o filtraremos luego.
        const allPerms = permsResponse.data[0].permissions;
        
        this.permsSvc.setPermissions(allPerms);
        localStorage.setItem('user_perms', JSON.stringify(allPerms));
        
        return true;
      }
    }
    return false;
  } catch (error) {
    console.error('Error en el login:', error);
    return false;
  }
}

  // Método para recuperar los permisos si refresca la página (F5)
  checkSession() {
    const savedPerms = localStorage.getItem('user_perms');
    if (savedPerms) {
      this.permsSvc.setPermissions(JSON.parse(savedPerms));
    }
  }

  logout() {
    localStorage.removeItem('user_perms');
    this.permsSvc.setPermissions([]);
  }
}
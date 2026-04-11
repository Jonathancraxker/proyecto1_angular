import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PermissionsService {

  // Mantenemos el signal como array de strings para que el resto de la app no truene
  private userPermissions = signal<string[]>([]);

  // Modificamos setPermissions para que entienda el objeto de Node.js
  setPermissions(perms: any) {
    if (perms && typeof perms === 'object' && !Array.isArray(perms)) {
      // 1. Sacamos los globales: ["user:view", "user:edit:profile"]
      const globales = perms.permisos_globales || [];
      
      // 2. Sacamos los de los grupos y los "aplanamos" en una sola lista
      const deGrupos = Object.values(perms.groups || {}).flat() as string[];
      
      // 3. Unimos todo en una sola lista de strings sin duplicados
      const listaUnica = [...new Set([...globales, ...deGrupos])];
      
      this.userPermissions.set(listaUnica);
    } else {
      // Por si acaso llega un array (retrocompatibilidad)
      this.userPermissions.set(perms || []);
    }
  }

  // Esto NO cambia, así que tu sidebar/navegación volverá a aparecer
  hasPermission(permiso: string): boolean {
    return this.userPermissions().includes(permiso);
  }

  hasAnyPermission(perms: string[]): boolean {
    return perms.some(p => this.hasPermission(p));
  }
}
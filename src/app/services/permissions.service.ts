import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PermissionsService {

  // Mantenemos el signal como array de strings para que el resto de la app no truene
  private userPermissions = signal<string[]>([]);
  public readonly permissions$ = this.userPermissions.asReadonly();

  // Exponemos el signal como lectura para la directiva
  private readonly permissionMap: { [key: string]: string } = {
    "1": "user:view",
    "2": "user:add",
    "3": "user:edit",
    "4": "user:edit:profile",
    "5": "user:delete",
    "6": "user:manage",
    "7": "group:view",
    "8": "group:add",
    "9": "group:edit",
    "10": "group:delete",
    "11": "group:manage",
    "12": "tickets:view",
    "13": "tickets:add",
    "14": "tickets:edit",
    "15": "tickets:delete",
    "16": "tickets:edit:state",
    "17": "tickets:edit:comment",
    "18": "tickets:manage",
    "19": "tickets:move",
  };

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

  // Este método será exclusivo para cuando entres a un Dashboard de Grupo
  setGroupPermissions(perms: any[]) {
    // 1. Convertimos los IDs de Python a sus nombres equivalentes usando el mapa
    const translatedPerms = perms.map(p => {
        const idStr = String(p);
        return this.permissionMap[idStr] || idStr; // Si no está en el mapa, deja el ID
    });

    // 2. Guardamos en el signal
    this.userPermissions.set(translatedPerms);
    console.log("Permisos cargados en el Dashboard:", translatedPerms);
  }
}
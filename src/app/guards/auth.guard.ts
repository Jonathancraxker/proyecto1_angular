import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { PermissionsService } from '../services/permissions.service';

export const hasPermissionGuard = (requiredPermission: string): CanActivateFn => {
  return () => {
    const permsSvc = inject(PermissionsService);
    const router = inject(Router);

    if (permsSvc.hasPermission(requiredPermission)) {
      return true; // Permitir el paso
    }

    // Si no tiene permiso, lo mandamos al home o a una página de 403
    console.warn(`Acceso denegado. Se requiere: ${requiredPermission}`);
    router.navigate(['/home']);
    return false;
  };
};
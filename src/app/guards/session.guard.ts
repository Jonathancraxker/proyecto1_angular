import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service'; // Ajusta la ruta a tu servicio

export const sessionGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Usamos el método del servicio en lugar de leer el localStorage aquí
  if (authService.isLoggedIn()) {
    return true; 
  }

  // Si no está logueado, lo mandamos al Login
  console.warn('Acceso denegado: Se requiere iniciar sesión.');
  router.navigate(['/']); 
  return false;
};
// src/app/core/guards/public.guard.ts
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const publicGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedIn()) {
    // Si ya está logueado, no tiene qué hacer en el Login -> Al Home
    router.navigate(['/home']);
    return false; 
  }

  return true; // No hay sesión, puede ver el Login
};
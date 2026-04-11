import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const publicGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedIn()) {
    router.navigate(['/home']); //se redirije a la misma ruta en la que se encuentra, excepto login/register
    return false; 
  }

  return true; // No hay sesión, puede ver el Login
};
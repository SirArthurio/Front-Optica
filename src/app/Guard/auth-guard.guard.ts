import { inject } from '@angular/core';
import { CanActivateFn, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../Context/auth.service';

export const AuthGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isAuthenticated()) {
    alert('No tienes permisos para acceder. Inicia sesión.');
    router.navigate(['/login']);
    return false;
  }

  
  const userRole = authService.getUserRole(); 
  const requiredRoles = route.data['roles'] as string[]; 

  
  if (requiredRoles.includes(userRole ?? '')) {
    return true;
  }

  alert('Acceso denegado. No tienes permisos.');
  router.navigate(['/unauthorized']); 
  return false;
};

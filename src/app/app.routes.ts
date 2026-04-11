import { Routes } from '@angular/router';
import { hasPermissionGuard } from './guards/auth.guard';
import { sessionGuard } from './guards/session.guard';
import { publicGuard } from './guards/public.guard';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full',
    },
    {
        path: '',
        loadComponent: () => import('./pages/auth/login/login').then(m => m.Login),
        canActivate: [publicGuard]
    },
    {
                path: 'landing',
                loadComponent: () => import('./pages/auth/landing/landing').then(m => m.Landing)
    },
    {
        path: 'register',
        loadComponent: () => import('./pages/auth/register/register').then(m => m.Register),
        canActivate: [publicGuard]
    },
    {
        path: '',
        loadComponent: () => import('./layout/main-layout/main-layout').then(m => m.MainLayout),
        canActivate: [sessionGuard],
        children: [
            {
                path: 'home',
                loadComponent: () => import('./pages/home/home').then(m => m.Home),
                canActivate: [sessionGuard]
            },
            {
                path: 'profile',
                loadComponent: () => import('./pages/profile/profile').then(m => m.Profile),
                canActivate: [hasPermissionGuard('user:edit:profile')]
            },
            {
                path: 'groups',
                loadComponent: () => import('./pages/groups/groups').then(m => m.Groups),
                canActivate: [hasPermissionGuard('admin:manage')]
            },
            {
            path: 'admin-user',
            loadComponent: () => import('./pages/admin-user/admin-user').then(m => m.AdminUser),
            canActivate: [hasPermissionGuard('admin:manage')]
            },
            {
            path: 'dashboard/:id',
            loadComponent: () => import('./pages/dashboard/dashboard').then(m => m.Dashboard),
            children: [
                {
                  path: 'resumen', // Vista de resumen
                loadComponent: () => import('./pages/dashboard/resumen/resumen').then(m => m.Resumen)
                },
                {
                  path: 'kanban', // Vista de tablero
                loadComponent: () => import('./pages/dashboard/kanban/kanban').then(m => m.Kanban)
                },
                {
                  path: 'lista', // Vista de tabla
                loadComponent: () => import('./pages/dashboard/lista/lista').then(m => m.Lista)
                },
                {
                  path: 'users', // Vista de tabla para gestión de usuarios en el proyecto
                loadComponent: () => import('./pages/dashboard/users/users').then(m => m.Users),
                canActivate: [hasPermissionGuard('group:manage')]
                },
                { path: '', redirectTo: 'resumen', pathMatch: 'full' },
            ]
            }
        ]
    },
    { path: '**', redirectTo: 'home' }
];

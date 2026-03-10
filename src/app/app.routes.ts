import { Routes } from '@angular/router';


export const routes: Routes = [
    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
    },
    {
        path: '',
        loadComponent: () => import('./pages/auth/login/login').then(m => m.Login)
    },
    {
                path: 'landing',
                loadComponent: () => import('./pages/auth/landing/landing').then(m => m.Landing)
    },
    {
        path: 'register',
        loadComponent: () => import('./pages/auth/register/register').then(m => m.Register)
    },
    {
        path: '',
        loadComponent: () => import('./layout/main-layout/main-layout').then(m => m.MainLayout),
        children: [
            {
                path: 'home',
                loadComponent: () => import('./pages/home/home').then(m => m.Home)
            },
            {
                path: 'user',
                loadComponent: () => import('./pages/user/user').then(m => m.User)
            },
            {
                path: 'groups',
                loadComponent: () => import('./pages/groups/groups').then(m => m.Groups)
            },
            {
            path: 'admin-user',
            loadComponent: () => import('./pages/admin-user/admin-user').then(m => m.AdminUser)
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
                  path: 'users', // Vista de tabla
                loadComponent: () => import('./pages/dashboard/users/users').then(m => m.Users)
                },
                { path: '', redirectTo: 'resumen', pathMatch: 'full' }
            ]
            }
        ]
    },
];

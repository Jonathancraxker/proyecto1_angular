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
    }
];

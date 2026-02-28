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
                path: 'landing',
                loadComponent: () => import('./pages/auth/landing/landing').then(m => m.Landing)
            },
            {
                path: 'user',
                loadComponent: () => import('./pages/user/user').then(m => m.User)
            },
            {
                path: 'groups',
                loadComponent: () => import('./pages/groups/groups').then(m => m.Groups)
            },
        ]
    }
];

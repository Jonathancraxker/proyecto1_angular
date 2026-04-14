import { Component } from '@angular/core';
import { AvatarModule } from 'primeng/avatar';
import { BadgeModule } from 'primeng/badge';
import { Menu, MenuModule } from 'primeng/menu';
import { RippleModule } from 'primeng/ripple';
import { MenuItem } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from "@angular/router"; 
import { HostListener, OnInit } from '@angular/core';

import { PermissionsService } from '../../services/permissions.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [AvatarModule, BadgeModule, MenuModule, RippleModule, CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar implements OnInit{

  constructor(private router: Router, private permsSvc: PermissionsService, private authSvc: AuthService) {}

  items: MenuItem[] | undefined;

    ngOnInit() {
        this.items = [
            // {
            //     separator: true
            // },
            {
                label: 'General',
                items: [
                    {
                        label: 'Home',
                        icon: 'pi pi-home',
                        // shortcut: 'ctrl+S',
                        routerLink: '/home',
                        visible: this.permsSvc.hasPermission('user:view')
                    }
                ]
            },
            {
                separator: true
            },
            {
                label: 'Perfil',
                items: [
                    {
                        label: 'Perfil',
                        icon: 'pi pi-id-card',
                        // shortcut: 'ctrl+P',
                        routerLink: '/profile',
                        visible: this.permsSvc.hasPermission('user:edit:profile')
                    },
                ]
            },
            {
                separator: true,
                visible: this.permsSvc.hasPermission('user:manage') || this.permsSvc.hasPermission('group:manage')
            },
            {
              label: 'Gestión', visible: this.permsSvc.hasPermission('user:manage'),
                items: [
                  { label: 'Grupos', icon: 'pi pi-users', /*shortcut: 'ctrl+G',*/ routerLink: '/groups', visible: this.permsSvc.hasPermission('group:manage')},
                  { label: 'Usuarios', icon: 'pi pi-user', /* shortcut: 'ctrl+U',*/ routerLink: '/admin-user', visible: this.permsSvc.hasPermission('user:manage')},
                ]
                },
                {
                separator: true,
                styleClass: 'flex-grow-spacer'
                },
                {
                    label: 'Versión',
                    items: [
                        { 
                            label: 'v1.0.7', 
                            icon: 'pi pi-info-circle',
                            disabled: true
                        }
                    ]
                },
                {
                items: [
                    {
                    label: 'Logout',
                    icon: 'pi pi-sign-out',
                    // shortcut: 'ctrl+Q',
                    linkClass: 'btn-logout',
                    command: () => this.logout()
                    
                    }
                ]
            }
        ];
    }
  

//     // Definir ctrl +
// @HostListener('window:keydown.control.q', ['$event'])
//   onLogoutShortcut(event: any) {
//     event.preventDefault();
//     this.logout();
//   }

// @HostListener('window:keydown.control.s', ['$event'])
//   onKeyDown(event: any) {
//     event.preventDefault();
//     this.crearNuevoDocumento();
//   }

// @HostListener('window:keydown.control.p', ['$event'])
//   onLanding(event: any) {
//     event.preventDefault();
//     this.perfil();
//   }
  
//   @HostListener('window:keydown.control.g', ['$event'])
//   onGroups(event: any) {
//     event.preventDefault();
//     this.groups();
//   }

//   @HostListener('window:keydown.control.u', ['$event'])
//   onUsers(event: any) {
//     event.preventDefault();
//     this.Users();
//   }

//     //funciones:
//     crearNuevoDocumento() {
//     console.log('Acción de crear nuevo documento ejecutada');
//     this.router.navigate(['/home'])
//   }
  
//   perfil() {
//     this.router.navigate(['/profile'])
//   }

//   groups() {
//     this.router.navigate(['/groups'])
//   }

//   Users() {
//     this.router.navigate(['/admin-user'])
//   }

  logout() {
    this.authSvc.logout();
  }

}

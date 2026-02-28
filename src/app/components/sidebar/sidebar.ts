import { Component } from '@angular/core';
import { AvatarModule } from 'primeng/avatar';
import { BadgeModule } from 'primeng/badge';
import { Menu, MenuModule } from 'primeng/menu';
import { RippleModule } from 'primeng/ripple';
import { MenuItem } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from "@angular/router"; 
import { HostListener, OnInit } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [AvatarModule, BadgeModule, MenuModule, RippleModule, CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar implements OnInit{

constructor(private router: Router) {}

@HostListener('window:keydown.control.q', ['$event'])
  onLogoutShortcut(event: any) {
    event.preventDefault();
    this.logout();
  }

@HostListener('window:keydown.control.s', ['$event'])
  onKeyDown(event: any) {
    event.preventDefault();
    this.crearNuevoDocumento();
  }

@HostListener('window:keydown.control.l', ['$event'])
  onLanding(event: any) {
    event.preventDefault();
    this.landing();
  }

  @HostListener('window:keydown.control.d', ['$event'])
  onGraficas(event: any) {
    event.preventDefault();
    this.graficas();
  }

  items: MenuItem[] | undefined;

    ngOnInit() {
        this.items = [
            {
                separator: true
            },
            {
                label: 'General',
                items: [
                    {
                        label: 'Home',
                        icon: 'pi pi-home',
                        shortcut: 'ctrl+S',
                        routerLink: '/home'
                    },
                    {
                        label: 'Perfil',
                        icon: 'pi pi-user',
                        shortcut: 'ctrl+L',
                        routerLink: '/user'
                    }
                ]
            },
            {
                label: 'Perfil',
                items: [
                    {
                        label: 'Groups',
                        icon: 'pi pi-cog',
                        shortcut: 'ctrl+O',
                        routerLink: '/groups'
                    },
                    {
                        label: 'Messages',
                        icon: 'pi pi-inbox',
                        badge: '2'
                    }
                ]
            },
            {
                label: 'Administrador',
                items: [
                    { label: 'Usuarios', icon: 'pi pi-user', shortcut: 'ctrl+O' },
                    { label: 'Gráficas', icon: 'pi pi-chart-line', badge: '2', shortcut: 'ctrl+D', routerLink:'/graficas'},
                    { label: 'Reportes', icon: 'pi pi-file', badge: '2', shortcut: 'ctrl+F', routerLink:'/graficas'}

                ]
                },
                {
                separator: true,
                styleClass: 'flex-grow-spacer'
                },
                {
                items: [
                    {
                    label: 'Logout',
                    icon: 'pi pi-sign-out',
                    shortcut: 'ctrl+Q',
                    linkClass: 'btn-logout',
                    command: () => this.logout()
                    }
                ]
            }
        ];
    }

    crearNuevoDocumento() {
    console.log('Acción de crear nuevo documento ejecutada');
    this.router.navigate(['/home'])
  }
  
  landing() {
    this.router.navigate(['/landing'])
  }

  graficas() {
    this.router.navigate(['/graficas'])
  }

  logout() {
    this.router.navigate(['/']); 
  }

}

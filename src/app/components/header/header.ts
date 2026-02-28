import { Component, OnInit, Inject } from '@angular/core';
import { AvatarModule } from 'primeng/avatar';
import { BadgeModule } from 'primeng/badge';
import { MenubarModule } from 'primeng/menubar';
import { InputTextModule } from 'primeng/inputtext';
import { RippleModule } from 'primeng/ripple';
import { MenuItem, MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from "@angular/router"; 
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';


@Component({
    selector: 'app-menubar-demo',
    standalone: true,
    imports: [AvatarModule, BadgeModule, MenubarModule, InputTextModule, RippleModule, CommonModule, RouterLink, RouterLinkActive, ButtonModule, MenuModule],
    templateUrl: './header.html',
    styleUrl: './header.css',
})
export class Header implements OnInit {
    constructor(private router: Router) {}
    private messageService = Inject(MessageService);
    items: MenuItem[] | undefined;

    ngOnInit() {
        this.items = [
            {
                label: 'Home',
                icon: 'pi pi-home',
                routerLink: '/home'
            },
            {
                label: 'Perfil',
                icon: 'pi pi-user',
                routerLink: '/user'
            },
            {
                label: 'Groups',
                icon: 'pi pi-users',
                routerLink: '/groups'
            },
            {
                label: 'Gráficas',
                icon: 'pi pi-chart-line'
            },
            {
                label: 'Projects',
                icon: 'pi pi-search',
                items: [
                    {
                        label: 'Core',
                        icon: 'pi pi-bolt'
                    },
                    {
                        label: 'Blocks',
                        icon: 'pi pi-server'
                    },
                    {
                        separator: true
                    },
                    {
                        label: 'UI Kit',
                        icon: 'pi pi-pencil'
                    }
                ]
            },
            {
                label: 'Options',
                items: [
                    {
                        label: 'Refresh',
                        icon: 'pi pi-refresh'
                    },
                    {
                        label: 'Export',
                        icon: 'pi pi-upload'
                    },
                    {
                        label: 'Logout',
                        icon: 'pi pi-sign-out',
                        linkClass: 'btn-logout',
                        command: () => this.logout()
                    }
                ]
            }
        ];
    }
    logout() {
    this.router.navigate(['/']); 
  }
}
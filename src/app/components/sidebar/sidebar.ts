import { Component } from '@angular/core';
import { AvatarModule } from 'primeng/avatar';
import { BadgeModule } from 'primeng/badge';
import { Menu, MenuModule } from 'primeng/menu';
import { RippleModule } from 'primeng/ripple';
import { MenuItem } from 'primeng/api';


@Component({
  selector: 'app-sidebar',
  imports: [AvatarModule, BadgeModule, MenuModule, RippleModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar {
  items: MenuItem[] | undefined;

    ngOnInit() {
        this.items = [
            {
                separator: true
            },
            {
                label: 'Documents',
                items: [
                    {
                        label: 'New',
                        icon: 'pi pi-plus',
                        shortcut: '⌘+N'
                    },
                    {
                        label: 'Search',
                        icon: 'pi pi-search',
                        shortcut: '⌘+S'
                    }
                ]
            },
            {
                label: 'Profile',
                items: [
                    {
                        label: 'Settings',
                        icon: 'pi pi-cog',
                        shortcut: '⌘+O'
                    },
                    {
                        label: 'Messages',
                        icon: 'pi pi-inbox',
                        badge: '2'
                    },
                    {
                        label: 'Logout',
                        icon: 'pi pi-sign-out',
                        shortcut: '⌘+Q',
                        linkClass: '!text-red-500 dark:!text-red-400'
                    }
                ]
            },
            {
                separator: true
            }
        ];
    }
}

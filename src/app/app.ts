import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ButtonModule } from 'primeng/button';

import { PermissionsService } from './services/permissions.service';
import { HasPermissionDirective } from './directives/has-permission.directive';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ButtonModule /* , HasPermissionDirective*/],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {

  constructor(private permsSvc: PermissionsService) {
    // Simular de permisos que vienen del JWT cuando hacemos login
    const jwtPerms = [
      // Groups
      'group:view', 'groups:view', 'group:add', 'groups:add', 'group:edit', 'groups:edit', 'group:delete', 'groups:delete',
      // Users
      'user:view', 'users:view', 'user:add', 'users:add', 'user:edit', 'users:edit', 'user:delete', 'users:delete',
      // Tickets
      'ticket:view', 'tickets:view', 'ticket:add', 'tickets:add', 'ticket:edit', 'tickets:edit', 'ticket:delete', 'tickets:delete'
    ];
    this.permsSvc.setPermissions(jwtPerms);
  }

  protected readonly title = signal('proyecto_01');

}

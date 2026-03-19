import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ButtonModule } from 'primeng/button';

import { PermissionsService } from './services/permissions.service';
import { HasPermissionDirective } from './directives/has-permission.directive';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ButtonModule /* , HasPermissionDirective*/],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {

  constructor(private authSvc: AuthService) {
    // // Simular de permisos que vienen del JWT cuando hacemos login
    // const jwtPerms = [
    //   // Groups
    //   'group:view', 'group:add', 'group:edit', 'group:delete', 'group:add:member', 'group:remove:member', 'group:manage',
    //   // Users
    //   'user:view', 'user:add', 'user:edit', 'user:edit:profile', 'user:delete', 'user:assign', 'user:view:all', 'user:edite:permissions', 'user:deactivate', 'user:activate','user:manage',
    //   // Tickets
    //   'ticket:view', 'ticket:add', 'ticket:edit', 'ticket:delete', 'ticket:edit:state', 'ticket:edit:comment', 'ticket:edit:comment', 'ticket:edit:priority', 'ticket:edit:deadline', 'ticket:edit:asiggn', 'ticket:manage',
    // ];
    this.authSvc.checkSession(); // Recuperar permisos si ya se hizo login antes

  }

  protected readonly title = signal('proyecto_01');

}

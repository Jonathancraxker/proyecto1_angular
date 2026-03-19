import { Component, OnInit, inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { MultiSelectModule } from 'primeng/multiselect'; // Para gestionar múltiples permisos
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MessageService, ConfirmationService } from 'primeng/api';
import { HasPermissionDirective } from '../../directives/has-permission.directive';

@Component({
  selector: 'app-admin-user',
  standalone: true,
  imports: [
    CommonModule, FormsModule, TableModule, TagModule, ButtonModule, 
    InputTextModule, DialogModule, MultiSelectModule, ToastModule, ConfirmDialogModule, HasPermissionDirective
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './admin-user.html',
  styleUrl: './admin-user.css'
})
export class AdminUser implements OnInit {
    @ViewChild('dt') dt: any;

    private messageService = inject(MessageService);
    private confirmationService = inject(ConfirmationService);

    users: any[] = [];
    user: any = {};
    userDialog: boolean = false;
    submitted: boolean = false;

    // Lista maestra de permisos para el SuperAdmin (Punto 10)
    permisosDisponibles = [
        // USERS
        { name: 'user:view', code: 'user:view' },
        { name: 'user:add', code: 'user:add' },
        { name: 'user:edit', code: 'user:edit' },
        { name: 'user:edit:profile', code: 'user:edit:profile' },
        { name: 'user:delete', code: 'user:delete' },
        { name: 'user:assign', code: 'user:assign' },
        { name: 'user:view:all', code: 'user:view:all' },
        { name: 'user:edite:permissions', code: 'user:edite:permissions' },
        { name: 'user:deactivate', code: 'user:deactivate' },
        { name: 'user:activate', code: 'user:activate' },
        { name: 'user:manage', code: 'user:manage' },
        // GROUPS
        { name: 'group:view', code: 'group:view' },
        { name: 'group:add', code: 'group:add' },
        { name: 'group:edit', code: 'group:edit' },
        { name: 'group:delete', code: 'group:delete' },
        { name: 'group:add:member', code: 'group:add:member' },
        { name: 'group:remove:member', code: 'group:remove:member' },
        { name: 'group:manage', code: 'group:manage' },
        // TICKETS
        { name: 'ticket:view', code: 'ticket:view' },
        { name: 'ticket:add', code: 'ticket:add' },
        { name: 'ticket:edit', code: 'ticket:edit' },
        { name: 'ticket:delete', code: 'ticket:delete' },
        { name: 'ticket:edit:state', code: 'ticket:edit:state' },
        { name: 'ticket:edit:comment', code: 'ticket:edit:comment' },
        { name: 'ticket:edit:priority', code: 'ticket:edit:priority' },
        { name: 'ticket:edit:deadline', code: 'ticket:edit:deadline' },
        { name: 'ticket:edit:asiggn', code: 'ticket:edit:asiggn' },
        { name: 'ticket:manage', code: 'ticket:manage' }
    ];

    ngOnInit() {
        this.users = [
            { id: 1, nombre: 'Jonathan Cruz', email: 'jonathan@uteq.edu.mx', permisos: ['user:manage', 'group:view'], rol: 'SuperAdmin' },
            { id: 2, nombre: 'Usuario Prueba', email: 'test@anteiku.com', permisos: ['ticket:view'], rol: 'Editor' },
            { id: 3, nombre: 'Usuario Demo', email: 'demo@anteiku.com', permisos: ['user:view'], rol: 'Visualizador' }
        ];
    }

    openNew() {
        this.user = { permisos: [] };
        this.submitted = false;
        this.userDialog = true;
    }

    editUser(user: any) {
        this.user = { ...user };
        this.userDialog = true;
    }

    deleteUser(user: any) {
        this.confirmationService.confirm({
            message: `¿Estás seguro de eliminar a ${user.nombre}?`,
            header: 'Confirmar Acción',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.users = this.users.filter((val) => val.id !== user.id);
                this.messageService.add({ severity: 'success', summary: 'Exitoso', detail: 'Usuario eliminado' });
            }
        });
    }

    saveUser() {
        this.submitted = true;
        if (this.user.nombre?.trim()) {
            if (this.user.id) {
                const index = this.users.findIndex(u => u.id === this.user.id);
                this.users[index] = this.user;
            } else {
                this.user.id = Math.random();
                this.users.push(this.user);
            }
            this.users = [...this.users];
            this.userDialog = false;
            this.user = {};
            this.messageService.add({ severity: 'success', summary: 'Exitoso', detail: 'Usuario actualizado' });
        }
    }
}
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
        { name: 'groups:view', code: 'groups:view' },
        { name: 'group:add', code: 'group:add' },
        { name: 'group:edit', code: 'group:edit' },
        { name: 'group:delete', code: 'group:delete' },
        { name: 'tickets:view', code: 'tickets:view' },
        { name: 'tickets:edit', code: 'tickets:edit' },
        { name: 'admin:all', code: 'admin:all' }
    ];

    ngOnInit() {
        // Datos iniciales de ejemplo
        this.users = [
            { id: 1, nombre: 'Jonathan Cruz', email: 'jonathan@uteq.edu.mx', permisos: ['admin:all', 'groups:view'], rol: 'SuperAdmin' },
            { id: 2, nombre: 'Usuario Prueba', email: 'test@anteiku.com', permisos: ['groups:view'], rol: 'Editor' }
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
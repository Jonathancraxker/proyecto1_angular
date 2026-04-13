import { Component, OnInit, inject, ViewChild, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { MultiSelectModule } from 'primeng/multiselect';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { HasPermissionDirective } from '../../directives/has-permission.directive';

import { MessageModule } from 'primeng/message';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

import { UsersService } from '../../services/admin-user/users.service';

@Component({
selector: 'app-admin-user',
standalone: true,
imports: [
    CommonModule, FormsModule, TableModule, TagModule, ButtonModule, 
    InputTextModule, DialogModule, MultiSelectModule, ToastModule, ConfirmDialogModule, HasPermissionDirective, MessageModule, ProgressSpinnerModule, IconFieldModule, InputIconModule
],
providers: [ConfirmationService],
templateUrl: './admin-user.html',
styleUrl: './admin-user.css'
})
export class AdminUser implements OnInit {
    @ViewChild('dt') dt: any;

    private usersSvc = inject(UsersService);
    private confirmationService = inject(ConfirmationService);
    private cdr = inject(ChangeDetectorRef);

    users: any[] = [];
    user: any = {};
    userDialog: boolean = false;
    submitted: boolean = false;
    loading: boolean = false;

    permisosDisponibles = [
        // USERS
        { name: 'user:view', code: 1 },
        // { name: 'user:add', code: 2 },
        // { name: 'user:edit', code: 3 },
        { name: 'user:edit:profile', code: 4 },
        // { name: 'user:delete', code: 5 },
        // { name: 'user:manage', code: 6 },
        // GROUPS
        { name: 'group:view', code: 7 },
        // { name: 'group:add', code: 8 },
        // { name: 'group:edit', code: 9 },
        // { name: 'group:delete', code: 10 },
        { name: 'group:manage', code: 11 },
        // TICKETS
        { name: 'tickets:view', code: 12 },
        // { name: 'tickets:add', code: 13 },
        // { name: 'tickets:edit', code: 14 },
        // { name: 'tickets:delete', code: 15 },
        // { name: 'tickets:edit:state', code: 16 },
        // { name: 'tickets:edit:comment', code: 17 },
        // { name: 'tickets:manage', code: 18 },
        { name: 'tickets:move', code: 19 },
        //ADMINISTRADOR
        { name: 'admin:manage', code: 20 }
    ];

    ngOnInit() {
        this.loadUsers();
    }

    loadUsers() {
        this.loading = true;
        this.usersSvc.getUsers().subscribe({
            next: (res) => {
                this.users = res.data.map((u: any) => ({
                    id: u.id,
                    nombre_completo: u.nombre_completo,
                    email: u.email,
                    username: u.username,
                    direccion: u.direccion,
                    telefono: u.telefono,
                    permisos: u.permisos_globales || []
                }));
                this.loading = false;
                this.cdr.markForCheck();
            }
        });
    }

    getPermisoNombre(code: number): string {
        const permiso = this.permisosDisponibles.find(p => p.code === code);
        return permiso ? permiso.name : code.toString();
    }

    saveUser() {
    this.submitted = true;
        this.loading = true;
        const payload = {
            nombre_completo: this.user.nombre_completo,
            email: this.user.email,
            username: this.user.username,
            permisos_globales: this.user.permisos,
            password: this.user.password
        };

        if (this.user.id) {
            this.usersSvc.updateUser(this.user.id, payload).subscribe({
                next: () => {
                    this.finishSave();
                },
                error: () => this.loading = false
            });
        } else {
            this.usersSvc.createUser(payload).subscribe({
                next: () => {
                    this.finishSave();
                },
                error: () => this.loading = false
            });
        }
}

// Función auxiliar para no repetir código de limpieza
finishSave() {
    this.loadUsers();
    this.userDialog = false;
    this.user = {};
    this.loading = false;
}

    editUser(user: any) {
        this.user = { ...user };
        this.userDialog = true;
    }

    openNew() {
        this.user = { permisos: [] };
        this.submitted = false;
        this.userDialog = true;
    }

    deleteUser(user: any) {
        this.confirmationService.confirm({
            header: 'Confirmar eliminación',
            message: `¿Estás seguro de eliminar a ${user.nombre_completo}?`,
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Eliminar',
            rejectLabel: 'Cancelar',
            acceptButtonStyleClass: 'p-button-danger',
            accept: () => {
                this.usersSvc.deleteUser(user.id).subscribe({
                    next: () => {
                        this.loadUsers();
                    }
                });
            }
        });
    }

    isValidEmail(email: string): boolean {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailRegex.test(email);
    }
}
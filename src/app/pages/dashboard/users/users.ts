import { Component, OnInit, inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { ToolbarModule } from 'primeng/toolbar';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MessageService, ConfirmationService } from 'primeng/api';
import { HasPermissionDirective } from '../../../directives/has-permission.directive';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    CommonModule, FormsModule, TableModule, TagModule, ButtonModule, 
    InputTextModule, IconFieldModule, InputIconModule, ToolbarModule,
    DialogModule, ToastModule, ConfirmDialogModule, HasPermissionDirective
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './users.html',
  styleUrl: './users.css'
})
export class Users implements OnInit {
    @ViewChild('dt') dt: any;

    private messageService = inject(MessageService);
    private confirmationService = inject(ConfirmationService);

    users: any[] = [];
    user: any = {};
    userDialog: boolean = false;
    submitted: boolean = false;
    groupName: string = 'Equipo DEV'; // Configuración básica del grupo

    ngOnInit() {
        // Lista de usuarios del grupo
        this.users = [
            { id: 1, nombre: 'Jonathan Cruz', email: 'jonathan@uteq.edu.mx', rol: 'Admin', fechaIngreso: '2026-01-20' },
            { id: 2, nombre: 'Emmanuel R.', email: 'emmanuel@dev.com', rol: 'Miembro', fechaIngreso: '2026-02-15' }
        ];
    }

    openNew() {
        this.user = {};
        this.submitted = false;
        this.userDialog = true;
    }

    editGroupName() {
        // Lógica para editar el nombre del grupo (Paso 7: Configuración básica)
        this.messageService.add({ severity: 'info', summary: 'Configuración', detail: 'Editando nombre del grupo' });
    }

    deleteUser(user: any) {
        this.confirmationService.confirm({
            message: `¿Estás seguro de eliminar a ${user.nombre} del grupo?`,
            header: 'Confirmar eliminación',
            icon: 'pi pi-user-minus',
            acceptLabel: 'Eliminar',
            rejectLabel: 'Cancelar',
            accept: () => {
                this.users = this.users.filter((val) => val.id !== user.id);
                this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Usuario eliminado del grupo' });
            }
        });
    }

    saveUser() {
        this.submitted = true;
        if (this.user.email?.trim()) {
            this.users.push({ ...this.user, id: Math.random(), rol: 'Miembro', fechaIngreso: new Date().toISOString().split('T')[0] });
            this.userDialog = false;
            this.user = {};
            this.messageService.add({ severity: 'success', summary: 'Invitación enviada', detail: 'Usuario añadido por email' });
        }
    }
}
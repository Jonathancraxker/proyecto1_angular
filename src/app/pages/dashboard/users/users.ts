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
    
    // Variables para la edición del grupo (Paso 7)
    groupDialog: boolean = false;
    groupName: string = 'Equipo DEV';
    tempGroupName: string = ''; 

    submitted: boolean = false;

    ngOnInit() {
        this.users = [
            { id: 1, nombre: 'Jonathan Cruz', email: 'jonathan@uteq.edu.mx', rol: 'Admin', fechaIngreso: '2026-01-20' },
            { id: 2, nombre: 'Emmanuel R.', email: 'emmanuel@dev.com', rol: 'Miembro', fechaIngreso: '2026-02-15' }
        ];
    }

    // Modal para añadir usuarios
    openNew() {
        this.user = {};
        this.submitted = false;
        this.userDialog = true;
    }

    // Modal para editar el nombre del grupo
    editGroupName() {
        this.tempGroupName = this.groupName; // Cargamos el nombre actual
        this.groupDialog = true;
    }

    saveGroupName() {
        if (this.tempGroupName.trim()) {
            this.groupName = this.tempGroupName;
            this.groupDialog = false;
            this.messageService.add({ 
                severity: 'success', 
                summary: 'Éxito', 
                detail: 'Nombre del grupo actualizado' 
            });
        }
    }

    // ... (restos de métodos deleteUser y saveUser se mantienen igual)
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
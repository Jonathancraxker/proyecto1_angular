import { Component, OnInit, inject, ChangeDetectorRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// PrimeNG Modules
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TagModule } from 'primeng/tag';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { ToolbarModule } from 'primeng/toolbar';
import { TooltipModule } from 'primeng/tooltip';
import { BadgeModule } from 'primeng/badge';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { SelectModule } from 'primeng/select'; // Agrega este al componente e imports
import { MultiSelectModule } from 'primeng/multiselect'; // Para los permisos

// Services & Directives
import { GroupsService } from '../../services/admin-groups/groups.service';
import { UsersService } from '../../services/admin-user/users.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { HasPermissionDirective } from '../../directives/has-permission.directive';

@Component({
selector: 'app-groups',
standalone: true,
imports: [
    HasPermissionDirective, CommonModule, FormsModule,
    CardModule, ButtonModule, TableModule, InputTextModule,
    DialogModule, ConfirmDialogModule, TagModule, IconFieldModule, 
    InputIconModule, TextareaModule, TooltipModule, BadgeModule, ToolbarModule, ProgressSpinnerModule,
    SelectModule, MultiSelectModule
],
providers: [ConfirmationService, MessageService],
templateUrl: './groups.html',
styleUrl: './groups.css',
})
export class Groups implements OnInit {
    @ViewChild('dt') dt: any;
    
    private groupsSvc = inject(GroupsService);
    private usersSvc = inject(UsersService);
    private confirmationService = inject(ConfirmationService);
    private messageService = inject(MessageService);
    private cdr = inject(ChangeDetectorRef);

    groups: any[] = [];
    group: any = {};
    groupDialog: boolean = false;
    submitted: boolean = false;
    loading: boolean = false;
    membersDialog: boolean = false;
    allUsers: any[] = []; // Usuarios que traes de Node
    selectedUser: any = null; // Usuario seleccionado para agregar
    permisosDisponibles: any[] = []; // Lista de permisos disponibles [1, 4, 15...]
    selectedPerms: any[] = []; // Permisos marcados en los checkboxes

    ngOnInit() {
        this.loadGroups();
        this.loadAllUsers();
    }

    loadGroups() {
        this.loading = true;
        this.groupsSvc.getGroups().subscribe({
            next: (res: any) => {
                this.groups = res.data;
                this.loading = false;
                this.cdr.markForCheck();
            },
            error: (err) => console.error('Error cargando grupos', err)
        });
    }

    loadAllUsers() {
        this.usersSvc.getUsers().subscribe({
            next: (res: any) => {
                this.allUsers = res.data;
            },
            error: (err) => console.error('Error cargando usuarios', err)
        });
    }

    openNew() {
        this.group = {};
        this.submitted = false;
        this.groupDialog = true;
    }

    editGroup(group: any) {
        this.group = { ...group };
        this.groupDialog = true;
    }

    onUserChange(event: any) {
        const userId = event.value.id;
        this.loading = true; // El spinner que agregaste viene de perlas aquí
        
        this.groupsSvc.getMemberPermissions(this.group.id, userId).subscribe({
            next: (res: any) => {
                // Como res.data es [1, 2, 3...], se vincula directo al ngModel
                this.selectedPerms = res.data;
                this.loading = false;
                this.cdr.detectChanges();
            },
            error: () => {
                this.selectedPerms = [];
                this.loading = false;
            }
        });
    }

    manageMembers(group: any) {
        this.group = { ...group };
        this.selectedUser = null;
        this.selectedPerms = [];
        this.membersDialog = true;
        
        // 1. Cargar usuarios si no los tienes
        // 2. Cargar la lista de permisos disponibles
        this.permisosDisponibles = [
        // USERS
        { name: 'user:view', id: 1 },
        { name: 'user:add', id: 2 },
        { name: 'user:edit', id: 3 },
        { name: 'user:edit:profile', id: 4 },
        { name: 'user:delete', id: 5 },
        { name: 'user:manage', id: 6 },
        // GROUPS
        { name: 'group:view', id: 7 },
        { name: 'group:add', id: 8 },
        { name: 'group:edit', id: 9 },
        { name: 'group:delete', id: 10 },
        { name: 'group:manage', id: 11 },
        // TICKETS
        { name: 'tickets:view', id: 12 },
        { name: 'tickets:add', id: 13 },
        { name: 'tickets:edit', id: 14 },
        { name: 'tickets:delete', id: 15 },
        { name: 'tickets:edit:state', id: 16 },
        { name: 'tickets:edit:comment', id: 17 },
        { name: 'tickets:manage', id: 18 },
        { name: 'tickets:move', id: 19 },
        ];
    }

    saveMemberAssignment() {
    if (!this.selectedUser) return;

    this.groupsSvc.addMember(this.group.id, this.selectedUser.id).subscribe({
        next: () => {
            // selectedPerms ya es un array de IDs gracias al optionValue="id"
            this.groupsSvc.updateMemberPermissions(this.group.id, this.selectedUser.id, this.selectedPerms).subscribe({
                next: () => {
                    this.membersDialog = false;
                    this.loadGroups();
                }
            });
        }
    });
}
    
    deleteGroup(group: any) {
        this.confirmationService.confirm({
            message: `¿Estás seguro de eliminar el grupo "${group.nombre}"?`,
            header: 'Confirmar Eliminación',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Sí, eliminar',
            rejectLabel: 'No',
            acceptButtonStyleClass: 'p-button-danger',
            accept: () => {
                this.groupsSvc.deleteGroup(group.id).subscribe({
                    next: () => {
                        this.loadGroups();
                    }
                });
            }
        });
    }

    hideDialog() {
        this.groupDialog = false;
        this.submitted = false;
    }

    saveGroup() {
        this.submitted = true;

        if (this.group.nombre?.trim()) {
            this.loading = true;
            if (this.group.id) {
                // UPDATE
                this.groupsSvc.updateGroup(this.group.id, this.group).subscribe({
                    next: () => {
                        this.loadGroups();
                        this.groupDialog = false;
                        this.loading = false;
                        this.cdr.markForCheck();
                    }
                });
            } else { //quiero que si hay error se detenga el loading
                // CREATE
                this.groupsSvc.createGroup(this.group).subscribe({
                    next: () => {
                        this.loadGroups();
                        this.groupDialog = false;
                    }
                });
            }
        }
    }
}
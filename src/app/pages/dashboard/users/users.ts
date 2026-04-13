import { Component, OnInit, inject, ChangeDetectorRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

// PrimeNG
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
import { ConfirmationService } from 'primeng/api';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

// Servicios y Directivas
import { GroupsService } from '../../../services/admin-groups/groups.service';
import { HasPermissionDirective } from '../../../directives/has-permission.directive';

@Component({
selector: 'app-users',
standalone: true,
imports: [
    CommonModule, FormsModule, TableModule, TagModule, ButtonModule, 
    InputTextModule, IconFieldModule, InputIconModule, ToolbarModule,
    DialogModule, ToastModule, ConfirmDialogModule, HasPermissionDirective, ProgressSpinnerModule
],
providers: [ConfirmationService],
templateUrl: './users.html',
styleUrl: './users.css'
})
export class Users implements OnInit {
@ViewChild('dt') dt: any;

private confirmationService = inject(ConfirmationService);
private cdr = inject(ChangeDetectorRef);
private route = inject(ActivatedRoute);
private groupsSvc = inject(GroupsService);

users: any[] = [];
user: any = {};
currentGroupId!: number;

userDialog: boolean = false;
groupDialog: boolean = false;
submitted: boolean = false;
loading: boolean = false;

  // Info del Grupo
groupName: string = '';
GroupName: string = ''; 
Descripcion: string = '';
// Automaticamente implementa el cdr en donde se necesite para actualizar la vista cuando se modifiquen los datos.

ngOnInit() {
    // Obtenemos el ID del grupo de la ruta padre (/dashboard/:id/users)
    const id = this.route.parent?.snapshot.paramMap.get('id');
    if (id) {
    this.currentGroupId = Number(id);
    this.loading = true;
    this.loadGroupData();
    this.loadMembers();
    }
}

loadGroupData() {
    this.groupsSvc.getGroup(this.currentGroupId).subscribe({
    next: (res: any) => {
        this.groupName = res.data.nombre;
        this.Descripcion = res.data.descripcion;
        if (this.users.length > 0) {
        this.loading = false;
        }
        this.cdr.markForCheck();
    }
    });
}

loadMembers() {
    this.groupsSvc.getGroupMembers(this.currentGroupId).subscribe({
    next: (res: any) => {
        this.users = res.data;
        if (this.groupName!== '') {
        this.loading = false;
        }
        this.cdr.markForCheck();
    },
    error: (err) => console.error('Error al cargar miembros:', err)
    });
}

  openNew() {
    this.user = { email: '' };
    this.submitted = false;
    this.userDialog = true;
  }

  editGroupName() {
    this.GroupName = this.groupName;
    this.groupDialog = true;
  }

  saveGroupName() {
    if (this.GroupName.trim()) {
      const payload = { nombre: this.GroupName, descripcion: this.Descripcion };
      this.groupsSvc.updateGroupInfo(this.currentGroupId, payload).subscribe({
        next: () => {
          this.groupName = this.GroupName;
          this.groupDialog = false;
          this.cdr.markForCheck();
        },
        error: (err) => {
          console.error('Error al actualizar nombre del grupo:', err);
          this.cdr.markForCheck();
        }
      });
    }
  }

  deleteUser(user: any) {
    this.confirmationService.confirm({
      message: `¿Estás seguro de eliminar a ${user.nombre} del grupo?`,
      header: 'Confirmar eliminación',
      icon: 'pi pi-user-minus',
      acceptLabel: 'Eliminar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.groupsSvc.removeMember(this.currentGroupId, user.id).subscribe({
          next: () => {
            this.users = this.users.filter((val) => val.id !== user.id);
            this.cdr.markForCheck();
          }
        });
      }
    }); 
  }

  saveUser() {
    this.submitted = true;
    if (this.user.email?.trim()) {
      this.groupsSvc.inviteUserByEmail(this.currentGroupId, this.user.email).subscribe({
        next: () => {
          this.loadMembers();
          this.userDialog = false;
          this.user = {};
          this.cdr.markForCheck();
        },
        error: (err) => {
          this.cdr.markForCheck();
        }
      });
    }
  }
}
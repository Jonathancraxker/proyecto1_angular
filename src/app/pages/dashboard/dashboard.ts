import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, RouterOutlet, RouterLink } from '@angular/router';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { TabsModule } from 'primeng/tabs';

import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { SelectModule } from 'primeng/select';
import { FormsModule } from '@angular/forms';
import { HasPermissionDirective } from '../../directives/has-permission.directive';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

import { GroupsService } from '../../services/admin-groups/groups.service';
import { AuthService } from '../../services/auth.service';
import { TicketsService } from '../../services/tickets/tickets.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    HasPermissionDirective, CardModule, ButtonModule, TableModule, CommonModule, 
    TabsModule, RouterOutlet, RouterLink,
    DialogModule, InputTextModule, TextareaModule, SelectModule, FormsModule, ProgressSpinnerModule
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  activeTab: number = 0;
  private route = inject(ActivatedRoute);
  private cdr = inject(ChangeDetectorRef);
  private groupsSvc = inject(GroupsService);
  private authSvc = inject(AuthService);
  private ticketsSvc = inject(TicketsService);
  groupId: string | null = '';
  currentUser: any;
  prioridades: any[] = [];
  estados: any[] = [];
  miembrosGrupo: any[] = []; // Opcional si quieres asignar a alguien más

  displayCreateModal: boolean = false;
  loading: boolean = false;
  
  nuevoTicket: any = {
    titulo: '',
    descripcion: '',
    estado_id: null,
    prioridad_id: null,
    asignado_id: null,
    fecha_final: null
  };

  ngOnInit() {
    this.groupId = this.route.snapshot.paramMap.get('id');
    this.loadInitialData(); // Cargar catálogos al iniciar
    // 1. Obtenemos el ID del grupo de la URL
    this.groupId = this.route.snapshot.paramMap.get('id');
    
    // 2. Obtenemos la info del usuario logueado desde el localStorage
    const savedUser = localStorage.getItem('user_info');
    if (savedUser) {
      this.currentUser = JSON.parse(savedUser);
    }

    // 3. Si tenemos ambos, cargamos los permisos específicos de este workspace
    if (this.groupId && this.currentUser) {
      this.loadPermissionsForGroup(Number(this.groupId));
    }
  }

  loadInitialData() {
    this.ticketsSvc.getCatalogos().subscribe({
      next: (res) => {
        // Mapeamos para que PrimeNG Select los entienda (label/value)
        this.estados = res.data.estados.map((e: any) => ({ label: e.nombre, value: e.id }));
        this.prioridades = res.data.prioridades.map((p: any) => ({ label: p.nombre, value: p.id }));
        this.cdr.markForCheck();
      }
    });
  }

  loadPermissionsForGroup(id: number) {
    this.loading = true;
    this.groupsSvc.getMemberPermissions(id, this.currentUser.id).subscribe({
      next: (res: any) => {
        // Actualizamos los permisos globales del sistema por los del GRUPO
        // Esto hará que la directiva *ifHasPermission se dispare
        this.authSvc.setGroupPermissions(res.data);
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al cargar permisos del grupo:', err);
      }
    });
  }

  crearTicket() {
    this.nuevoTicket = {
      grupo_id: Number(this.groupId),
      titulo: '',
      descripcion: '',
      estado_id: this.estados.find(e => e.label === 'Pendiente')?.value,
      prioridad_id: this.prioridades.find(p => p.label === 'Media')?.value,
      asignado_id: this.currentUser.id, // Jonathan por defecto
      fecha_final: new Date().toISOString().split('T')[0] // Fecha de hoy formato YYYY-MM-DD
    };
    this.displayCreateModal = true;
  }

  guardarTicket() {
    if (this.nuevoTicket.titulo.trim()) {
      this.loading = true;
      
      this.ticketsSvc.createTicket(this.nuevoTicket).subscribe({
        next: (res) => {
          this.displayCreateModal = false;
          this.loading = false;
          
          window.location.reload();
        },
        error: (err) => {
          console.error(err);
          this.loading = false;
        }
      });
    }
  }
}
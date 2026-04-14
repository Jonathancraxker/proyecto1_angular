import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { DragDropModule, CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';

// PrimeNG
import { TagModule } from 'primeng/tag';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';
import { DatePickerModule } from 'primeng/datepicker';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { SelectButtonModule } from 'primeng/selectbutton';
import { InputTextModule } from 'primeng/inputtext';
import { TooltipModule } from 'primeng/tooltip';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

// Servicios
import { TicketsService } from '../../../services/tickets/tickets.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-kanban',
  standalone: true,
  imports: [
    CommonModule, FormsModule, DragDropModule, TagModule, AvatarModule, DialogModule, 
    SelectModule, TextareaModule, ButtonModule, DatePickerModule, ProgressSpinnerModule,
    InputGroupModule, InputGroupAddonModule, SelectButtonModule, InputTextModule, TooltipModule
  ],
  templateUrl: './kanban.html',
  styleUrl: './kanban.css',
})
export class Kanban implements OnInit {
  private ticketsSvc = inject(TicketsService);
  private authSvc = inject(AuthService);
  private route = inject(ActivatedRoute);
  private cdr = inject(ChangeDetectorRef);

  // Estados de carga y datos
  loading: boolean = false;
  groupId: string | null = '';
  allTickets: any[] = [];
  columnas: any[] = [];
  currentUser: any;

  // Modal Detalle
  displayDetail: boolean = false;
  selectedTicket: any = null;
  prioridades: any[] = [];
  estados: any[] = [];

  // Filtros
  filtroActivo: string = 'todos';
  opcionesFiltro = [
    { label: 'Todos', value: 'todos' },
    { label: 'Mis tickets', value: 'mis-tickets' },
    { label: 'Sin asignar', value: 'sin-asignar' },
    { label: 'Prioridad Alta', value: 'alta' },
    { label: 'Prioridad Media', value: 'media' },
    { label: 'Prioridad Baja', value: 'baja' }
  ];

  ngOnInit() {
    const savedUser = localStorage.getItem('user_info');
    if (savedUser) {
      this.currentUser = JSON.parse(savedUser);
    }
    this.groupId = this.route.parent?.snapshot.paramMap.get('id') || '';
    if (this.groupId) {
      this.loadKanbanData();
    }
  }

  // MÉTODO PARA EL HTML
  puedoMover(ticket: any): boolean {
    // 1. Validamos el permiso global usando la lógica de tu AuthService
    const tienePermisoGlobal = this.authSvc.hasPermission('tickets:move');
    
    // 2. Validamos si el ticket es del usuario actual
    const esMio = String(ticket.asignado_id) === String(this.currentUser?.id);

    // Solo puede mover si tiene el permiso Y el ticket es suyo
    return tienePermisoGlobal && esMio;
  }

  loadKanbanData() {
    this.loading = true;
    // 1. Cargamos Catálogos primero para armar las columnas
    this.ticketsSvc.getCatalogos().subscribe({
      next: (res) => {
        const estados = res.data.estados;
        this.estados = res.data.estados.map((e: any) => ({ label: e.nombre, value: e.id }));
        this.prioridades = res.data.prioridades.map((p: any) => ({ label: p.nombre, value: p.id }));
        this.cdr.markForCheck();
        // 2. Cargamos Tickets del grupo
        this.ticketsSvc.getTicketsByGroup(this.groupId!).subscribe({
          next: (resT) => {
            this.allTickets = resT.data;
            
            this.columnas = estados.map((est: any) => ({
              id: est.id,
              nombre: est.nombre,
              color: est.color,
              tickets: this.allTickets.filter(t => t.estado === est.nombre)
            }));

            this.loading = false;
            this.cdr.markForCheck();
          }
        });
      },
      error: () => this.loading = false
    });
  }

  // Filtro que se aplica dentro de cada columna en el HTML
  getTicketsFiltrados(tickets: any[]) {
    if (this.filtroActivo === 'todos') return tickets;
    
    const userInfo = JSON.parse(localStorage.getItem('user_info') || '{}');
    const userId = String(userInfo.id);

    switch (this.filtroActivo) {
      case 'mis-tickets': return tickets.filter(t => String(t.asignado_id) === userId);
      case 'sin-asignar': return tickets.filter(t => !t.asignado_id);
      case 'alta': return tickets.filter(t => t.prioridad === 'Alta');
      case 'media': return tickets.filter(t => t.prioridad === 'Media');
      case 'baja': return tickets.filter(t => t.prioridad === 'Baja');
      default: return tickets;
    }
  }

  drop(event: CdkDragDrop<any[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      const ticket = event.previousContainer.data[event.previousIndex];
      const nuevoEstadoId = event.container.id; // Aquí recibimos el ID de la columna destino

      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );

      // Actualizar en el Backend
      this.ticketsSvc.updateTicket(ticket.id, { estado_id: Number(nuevoEstadoId) }).subscribe({
        next: () => {
          // Actualizamos el nombre del estado localmente para que el filtro no lo regrese
          const colDestino = this.columnas.find(c => String(c.id) === nuevoEstadoId);
          ticket.estado = colDestino.nombre;
          this.cdr.markForCheck();
        },
        error: () => this.loadKanbanData() // Revertir si falla
      });
    }
  }

  getPrioritySeverity(prioridad_id: string) {
    switch (prioridad_id) {
      case 'Alta': return 'danger';
      case 'Media': return 'warn';
      case 'Baja': return 'success';
      default: return 'contrast';
    }
  }

  verDetalle(ticket: any) {
      // 1. Clonamos el ticket
      this.selectedTicket = { ...ticket };

      // 2. Sincronizamos los IDs para que el p-select los reconozca
      // Buscamos en los catálogos el ID que corresponde al texto que trae el ticket
      if (this.selectedTicket.prioridad) {
          const pFound = this.prioridades.find(p => p.label === this.selectedTicket.prioridad);
          this.selectedTicket.prioridad_id = pFound ? pFound.value : null;
      }

      if (this.selectedTicket.estado) {
          const eFound = this.estados.find(e => e.label === this.selectedTicket.estado);
          this.selectedTicket.estado_id = eFound ? eFound.value : null;
      }

      // 3. FORMATEAR LA FECHA PARA EL INPUT DATE
      // Si la fecha existe, tomamos solo los primeros 10 caracteres (YYYY-MM-DD)
      if (this.selectedTicket.fecha_final) {
          this.selectedTicket.fecha_final = this.selectedTicket.fecha_final.substring(0, 10);
      }

      this.displayDetail = true;
  }

  guardarCambios() {
    this.loading = true;

    const payload = {
        grupo_id: Number(this.groupId),
        titulo: this.selectedTicket.titulo,
        descripcion: this.selectedTicket.descripcion,
        asignado_id: this.selectedTicket.asignado_id ? Number(this.selectedTicket.asignado_id) : null,
        estado_id: Number(this.selectedTicket.estado_id),
        prioridad_id: Number(this.selectedTicket.prioridad_id),
        fecha_final: this.selectedTicket.fecha_final ? new Date(this.selectedTicket.fecha_final).toISOString().split('T')[0] : null
    };

    this.ticketsSvc.updateTicket(this.selectedTicket.id, payload).subscribe({
        next: () => {
            this.displayDetail = false;
            this.loadKanbanData();
        },
        error: (err) => {
            this.loading = false;
            console.error("Error al actualizar:", err);
        }
    });
  }
}
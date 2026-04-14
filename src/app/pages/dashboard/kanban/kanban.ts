import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { DragDropModule, CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';

import { TagModule } from 'primeng/tag';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';
import { SelectButtonModule } from 'primeng/selectbutton';
import { InputTextModule } from 'primeng/inputtext';
import { TooltipModule } from 'primeng/tooltip';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

import { TicketsService } from '../../../services/tickets/tickets.service';
import { AuthService } from '../../../services/auth.service';
import { HasPermissionDirective } from "../../../directives/has-permission.directive";

@Component({
  selector: 'app-kanban',
  standalone: true,
  imports: [
    CommonModule, FormsModule, DragDropModule, TagModule, AvatarModule, DialogModule,
    SelectModule, TextareaModule, ButtonModule, ProgressSpinnerModule,
    SelectButtonModule, InputTextModule, TooltipModule,
    HasPermissionDirective
],
  templateUrl: './kanban.html',
  styleUrl: './kanban.css',
})
export class Kanban implements OnInit {
  private ticketsSvc = inject(TicketsService);
  private authSvc = inject(AuthService);
  private route = inject(ActivatedRoute);
  private cdr = inject(ChangeDetectorRef);

  loading: boolean = false;
  groupId: string | null = '';
  allTickets: any[] = [];
  columnas: any[] = [];
  currentUser: any;
  comentarios: any[] = [];
  nuevoComentario: string = '';
  displayDetail: boolean = false;
  selectedTicket: any = null;
  prioridades: any[] = [];
  estados: any[] = [];

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
    const tienePermisoGlobal = this.authSvc.hasPermission('tickets:move');
    
    const esMio = String(ticket.asignado_id) === String(this.currentUser?.id);

    return tienePermisoGlobal && esMio;
  }

  loadKanbanData() {
    this.loading = true;
    this.ticketsSvc.getCatalogos().subscribe({
      next: (res) => {
        const estados = res.data.estados;
        this.estados = res.data.estados.map((e: any) => ({ label: e.nombre, value: e.id }));
        this.prioridades = res.data.prioridades.map((p: any) => ({ label: p.nombre, value: p.id }));
        this.cdr.markForCheck();
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
      const nuevoEstadoId = event.container.id;

      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );

      this.ticketsSvc.updateTicket(ticket.id, { estado_id: Number(nuevoEstadoId) }).subscribe({
        next: () => {
          const colDestino = this.columnas.find(c => String(c.id) === nuevoEstadoId);
          ticket.estado = colDestino.nombre;
          this.cdr.markForCheck();
        },
        error: () => this.loadKanbanData()
      });
    }
  }

  getPrioritySeverity(prioridad_id: string) {
    switch (prioridad_id) {
      case 'Alta': return 'danger';
      case 'Media': return 'warn';
      case 'Baja': return 'secondary';
      default: return 'contrast';
    }
  }

  verDetalle(ticket: any) {
      this.selectedTicket = { ...ticket };
      this.nuevoComentario = ''; // Limpiar el input
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
      if (this.selectedTicket.fecha_final) {
          this.selectedTicket.fecha_final = this.selectedTicket.fecha_final.substring(0, 10);
      }

      this.ticketsSvc.getComments(ticket.id).subscribe({
          next: (res) => {
              // Como tu backend devuelve [ [comentarios], {message} ]
              this.comentarios = res.data[0] || [];
              this.cdr.markForCheck();
          }
      });
      this.displayDetail = true;
  }

  agregarComentario() {
      if (!this.nuevoComentario.trim()) return;

      this.ticketsSvc.addComment(this.selectedTicket.id, this.nuevoComentario).subscribe({
          next: () => {
              // Recargamos comentarios para ver el nuevo
              this.verDetalle(this.selectedTicket); 
              this.nuevoComentario = '';
          }
      });
  }

  guardarCambios() {
    if (!this.puedoMover(this.selectedTicket)) {
        console.warn("Intento de edición no autorizado");
        return;
    }
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
import { Component } from '@angular/core';
import { DragDropModule, CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { TagModule } from 'primeng/tag';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';
import { FormsModule } from '@angular/forms';
import { DatePickerModule } from 'primeng/datepicker';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { SelectButtonModule } from 'primeng/selectbutton';

@Component({
  selector: 'app-kanban',
  standalone: true,
  imports: [
    CommonModule, DragDropModule, TagModule, AvatarModule, DialogModule, 
    SelectModule, TextareaModule, FormsModule, ButtonModule, DatePickerModule, 
    InputGroupModule, InputGroupAddonModule, SelectButtonModule
  ],
  templateUrl: './kanban.html',
  styleUrl: './kanban.css',
})
export class Kanban {
  displayDetail: boolean = false;
  selectedTicket: any = null;
  
  usuarioLogueado = 'Jonathan'; // Simulamos que Jonathan es el usuario loggeado

  // Paso 9: Filtros Rápidos
  filtroActivo: string = 'todos';
  opcionesFiltro = [
    { label: 'Todos', value: 'todos' },
    { label: 'Mis tickets', value: 'mis-tickets' },
    { label: 'Sin asignar', value: 'sin-asignar' },
    { label: 'Prioridad Alta', value: 'alta' }
  ];

  columnas = [
    { 
      nombre: 'Pendiente', 
      id: 'todo', 
      tickets: [
        { id: 'TK-1', titulo: 'Tarea 1', responsable: 'Jonathan', prioridad: 'Alta', estado: 'Pendiente', fechaLimite: '2026-03-15' },
        { id: 'TK-2', titulo: 'Tarea 3', responsable: 'Maria', prioridad: 'Alta', estado: 'Pendiente', fechaLimite: '2026-03-18' },
      ]
    },
    { nombre: 'En Progreso', id: 'inprogress', tickets: [
      { id: 'TK-5', titulo: 'Tarea 5', responsable: 'Ana', prioridad: 'Media', estado: 'En Progreso', fechaLimite: '2026-03-25' },
      { id: 'TK-6', titulo: 'Tarea 6', responsable: 'Jonathan', prioridad: 'Alta', estado: 'En Progreso', fechaLimite: '2026-03-28' }
    ] },
    { nombre: 'Revisión', id: 'review', tickets: [
      { id: 'TK-7', titulo: 'Tarea 7', responsable: 'Luis', prioridad: 'Baja', estado: 'Revisión', fechaLimite: '2026-03-30' },
    ] },
    { nombre: 'Hecho', id: 'done', tickets: [ 
      { id: 'TK-8', titulo: 'Tarea 8', responsable: 'Sofia', prioridad: 'Media', estado: 'Hecho', fechaLimite: '2026-03-10' },
      { id: 'TK-9', titulo: 'Tarea 9', responsable: 'Miguel', prioridad: 'Alta', estado: 'Hecho', fechaLimite: '2026-03-12' },
      { id: 'TK-10', titulo: 'Tarea 10', responsable: '', prioridad: 'Baja', estado: 'Hecho', fechaLimite: '2026-03-14' }
    ] },
    { nombre: 'Bloqueado', id: 'block', tickets: [] }
  ];

  // Lógica de Filtrado (Paso 9)
  getTicketsFiltrados(tickets: any[]) {
    if (this.filtroActivo === 'todos') return tickets;
    if (this.filtroActivo === 'mis-tickets') return tickets.filter(t => t.responsable === this.usuarioLogueado);
    if (this.filtroActivo === 'sin-asignar') return tickets.filter(t => !t.responsable);
    if (this.filtroActivo === 'alta') return tickets.filter(t => t.prioridad === 'Alta');
    return tickets;
  }

  drop(event: CdkDragDrop<any[]>) {
    const ticket = event.previousContainer.data[event.previousIndex];

    // REGLA: Si el ticket tiene responsable y no soy yo, NO permito el movimiento
    if (ticket.responsable && ticket.responsable !== this.usuarioLogueado) {
      console.warn('No puedes mover un ticket que no te pertenece');
      return; 
    }

    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
  }

  getPrioritySeverity(prioridad: string): "success" | "secondary" | "info" | "warn" | "danger" | "contrast" | undefined {
    switch (prioridad.toLowerCase()) {
      case 'alta': return 'danger';
      case 'media': return 'warn';
      case 'baja': return 'info';
      default: return 'secondary';
    }
  }

  prioridadesChinas = [
    { label: '(Extrema)', value: 'Extrema' },
    { label: '(Alta)', value: 'Alta' },
    { label: '(Media)', value: 'Media' },
    { label: '(Baja)', value: 'Baja' },
    { label: '(Mínima)', value: 'Minima' },
    { label: '(Urgente)', value: 'Urgente' },
    { label: '(Pendiente)', value: 'Indefinida' }
  ];

  verDetalle(ticket: any) {
    this.selectedTicket = { ...ticket };
    this.displayDetail = true;
  }

  guardarCambios() {
    this.displayDetail = false;
  }
}
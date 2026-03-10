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
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { SelectButtonModule } from 'primeng/selectbutton'; // Importante para filtros rápidos
import { MessageService, ConfirmationService } from 'primeng/api';
import { HasPermissionDirective } from '../../../directives/has-permission.directive';

@Component({
  selector: 'app-lista',
  standalone: true,
  imports: [
    CommonModule, FormsModule, TableModule, TagModule, ButtonModule, 
    InputTextModule, IconFieldModule, InputIconModule, ToolbarModule,
    DialogModule, SelectModule, TextareaModule, ConfirmDialogModule, 
    ToastModule, HasPermissionDirective, SelectButtonModule
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './lista.html',
  styleUrl: './lista.css'
})
export class Lista implements OnInit {
    @ViewChild('dt') dt: any;

    private messageService = inject(MessageService);
    private confirmationService = inject(ConfirmationService);

    tickets: any[] = [];
    ticket: any = {};
    selectedTickets: any[] | null = null;
    ticketDialog: boolean = false;
    submitted: boolean = false;

    // Paso 9: Filtros Rápidos
    filtroActivo: string = 'todos';
    opcionesFiltro = [
        { label: 'Todos', value: 'todos' },
        { label: 'Mis tickets', value: 'mis-tickets' },
        { label: 'Sin asignar', value: 'sin-asignar' },
        { label: 'Prioridad Alta', value: 'alta' }
    ];

    statuses = [
        { label: 'Hecho', value: 'Hecho' },
        { label: 'En proceso', value: 'En proceso' },
        { label: 'Pendiente', value: 'Pendiente' },
        { label: 'Bloqueado', value: 'Bloqueado' }
    ];

    ngOnInit() {
        this.tickets = [
            { id: 'TK-1', titulo: 'Tarea 1', responsable: 'Jonathan', estado: 'Pendiente', prioridad: 'Alta', fechaLimite: '2026-03-15', descripcion: 'Revisar logs' },
            { id: 'TK-2', titulo: 'Tarea 2', responsable: 'Admin', estado: 'Hecho', prioridad: 'Baja', fechaLimite: '2026-03-10', descripcion: 'Cerrar sesión' },
            { id: 'TK-3', titulo: 'Tarea 3', responsable: 'User', estado: 'En proceso', prioridad: 'Media', fechaLimite: '2026-03-20', descripcion: 'Actualizar documentación' },
            { id: 'TK-4', titulo: 'Tarea 4', responsable: 'Jonathan', estado: 'Bloqueado', prioridad: 'Alta', fechaLimite: '2026-03-25', descripcion: 'Integrar API externa' }
        ];
    }

    // Lógica para devolver tickets filtrados (Paso 9)
    get ticketsFiltrados() {
        if (this.filtroActivo === 'todos') return this.tickets;
        if (this.filtroActivo === 'mis-tickets') return this.tickets.filter(t => t.responsable === 'Jonathan');
        if (this.filtroActivo === 'sin-asignar') return this.tickets.filter(t => !t.responsable);
        if (this.filtroActivo === 'alta') return this.tickets.filter(t => t.prioridad === 'Alta');
        return this.tickets;
    }

    openNew() {
        this.ticket = { estado: 'Pendiente' };
        this.submitted = false;
        this.ticketDialog = true;
    }

    editTicket(ticket: any) {
        this.ticket = { ...ticket };
        this.ticketDialog = true;
    }

    hideDialog() {
        this.ticketDialog = false;
        this.submitted = false;
    }

    getSeverity(estado: string) {
        switch (estado) {
            case 'Hecho': return 'success';
            case 'En proceso': return 'info';
            case 'Pendiente': return 'warn';
            case 'Bloqueado': return 'danger';
            default: return 'secondary';
        }
    }

    deleteTicket(ticket: any) {
        this.confirmationService.confirm({
            message: '¿Estás seguro de que quieres eliminar ' + ticket.id + '?',
            header: 'Confirmar',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Sí',
            rejectLabel: 'No',
            accept: () => {
                this.tickets = this.tickets.filter((val) => val.id !== ticket.id);
                this.messageService.add({ severity: 'success', summary: 'Exitoso', detail: 'Ticket eliminado', life: 3000 });
            }
        });
    }
}
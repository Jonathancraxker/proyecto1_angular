import { Component, OnInit, inject, ChangeDetectorRef, ViewChild } from '@angular/core';
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
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ActivatedRoute } from '@angular/router';

import { HasPermissionDirective } from '../../../directives/has-permission.directive';
import { TicketsService } from '../../../services/tickets/tickets.service';


@Component({
  selector: 'app-lista',
  standalone: true,
  imports: [
    CommonModule, FormsModule, TableModule, TagModule, ButtonModule, 
    InputTextModule, IconFieldModule, InputIconModule, ToolbarModule,
    DialogModule, SelectModule, TextareaModule, ConfirmDialogModule, 
    ToastModule, HasPermissionDirective, SelectButtonModule, ProgressSpinnerModule
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './lista.html',
  styleUrl: './lista.css'
})
export class Lista implements OnInit {
    @ViewChild('dt') dt: any;

    private messageService = inject(MessageService);
    private confirmationService = inject(ConfirmationService);
    private ticketsSvc = inject(TicketsService);
    private route = inject(ActivatedRoute);
    private cdr = inject(ChangeDetectorRef);

    tickets: any[] = [];
    ticket: any = {};
    groupId: string | null = '';
    loading: boolean = false;
    selectedTickets: any[] | null = null;
    ticketDialog: boolean = false;
    submitted: boolean = false;
    prioridadesCat: any[] = [];
    estadosCat: any[] = [];

    // Paso 9: Filtros Rápidos
    filtroActivo: string = 'todos';
    opcionesFiltro = [
        { label: 'Todos', value: 'todos' },
        { label: 'Mis tickets', value: 'mis-tickets' },
        { label: 'Sin asignar', value: 'sin-asignar' },
        { label: 'Prioridad Alta', value: 'alta' },
        { label: 'Prioridad Media', value: 'media' },
        { label: 'Prioridad Baja', value: 'baja' }
    ];

    statuses = [
        { label: 'Hecho', value: 'Hecho' },
        { label: 'En proceso', value: 'En proceso' },
        { label: 'Pendiente', value: 'Pendiente' },
        { label: 'Cerrado', value: 'Cerrado' }
    ];

    ngOnInit() {
        this.groupId = this.route.parent?.snapshot.paramMap.get('id') || '';
        if (this.groupId) {
            this.loadTickets();
        }
    }

    loadInitialData() {
        this.loading = true;
        // Cargamos catálogos y luego tickets
        this.ticketsSvc.getCatalogos().subscribe({
            next: (res) => {
                this.estadosCat = res.data.estados.map((e: any) => ({ label: e.nombre, value: e.id }));
                this.prioridadesCat = res.data.prioridades.map((p: any) => ({ label: p.nombre, value: p.id }));
                this.loadTickets();
            },
            error: () => this.loading = false
        });
    }

    loadTickets() {
        this.ticketsSvc.getTicketsByGroup(this.groupId!).subscribe({
            next: (res) => {
                this.tickets = res.data;
                this.loading = false;
                this.cdr.markForCheck();
            },
            error: () => this.loading = false
        });
    }

    saveTicket() {
        this.submitted = true;

        if (!this.ticket.titulo) return;

        this.loading = true;

        // Buscamos los IDs basados en los labels seleccionados en el modal
        const estadoId = this.estadosCat.find(e => e.label === this.ticket.estado)?.value || this.ticket.estado_id;
        
        // La prioridad en tu modal parece estar bindeada a ticket.prioridad (el texto)
        const prioridadId = this.prioridadesCat.find(p => p.label === this.ticket.prioridad)?.value || this.ticket.prioridad_id;

        const payload = {
            grupo_id: Number(this.groupId),
            titulo: this.ticket.titulo,
            descripcion: this.ticket.descripcion || '',
            asignado_id: this.ticket.asignado_id ? Number(this.ticket.asignado_id) : null,
            estado_id: Number(estadoId),
            prioridad_id: Number(prioridadId),
            fecha_final: this.ticket.fecha_final ? new Date(this.ticket.fecha_final).toISOString().split('T')[0] : null
        };

        if (this.ticket.id) {
            // ACTUALIZAR
            this.ticketsSvc.updateTicket(this.ticket.id, payload).subscribe({
                next: () => {
                    this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Ticket actualizado' });
                    this.loadTickets();
                    this.hideDialog();
                },
                error: () => this.loading = false
            });
        } else {
            // CREAR (Si lo necesitas en el futuro)
            this.ticketsSvc.createTicket(payload).subscribe({
                next: () => {
                    this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Ticket creado' });
                    this.loadTickets();
                    this.hideDialog();
                },
                error: () => this.loading = false
            });
        }
    }

    get ticketsFiltrados() {
        if (!this.tickets) return [];
        if (this.filtroActivo === 'todos') return this.tickets;
        
        // Ajustamos los nombres de campos a como vienen de Supabase (id_asignado, etc)
        if (this.filtroActivo === 'mis-tickets') {
            const userInfo = JSON.parse(localStorage.getItem('user_info') || '{}');
            const userId = String(userInfo.id);
            return this.tickets.filter(t => t.asignado_id === userId);
        }
        if (this.filtroActivo === 'sin-asignar') return this.tickets.filter(t => !t.asignado_id);
        if (this.filtroActivo === 'alta') return this.tickets.filter(t => t.prioridad === 'Alta');
        if (this.filtroActivo === 'media') return this.tickets.filter(t => t.prioridad === 'Media');
        if (this.filtroActivo === 'baja') return this.tickets.filter(t => t.prioridad === 'Baja');
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
            case 'Cerrado': return 'danger';
            default: return 'secondary';
        }
    }

    deleteTicket(ticket: any) {
        this.confirmationService.confirm({
            message: `¿Estás seguro de eliminar el ticket ${ticket.id}?`,
            header: 'Confirmar Eliminación',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.ticketsSvc.deleteTicket(ticket.id).subscribe({
                    next: () => {
                        this.loadTickets();
                        this.loading = false;
                        this.cdr.markForCheck();
                    }
                });
            }
        });
    }

}
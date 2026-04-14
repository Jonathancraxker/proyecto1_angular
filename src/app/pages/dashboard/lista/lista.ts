import { Component, OnInit, inject, ChangeDetectorRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { DialogModule } from 'primeng/dialog';
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { SelectButtonModule } from 'primeng/selectbutton';
import { ConfirmationService } from 'primeng/api';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ActivatedRoute } from '@angular/router';
import { TooltipModule } from 'primeng/tooltip';

import { HasPermissionDirective } from '../../../directives/has-permission.directive';
import { TicketsService } from '../../../services/tickets/tickets.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-lista',
  standalone: true,
  imports: [
    CommonModule, FormsModule, TableModule, TagModule, ButtonModule, 
    InputTextModule, IconFieldModule, InputIconModule,
    DialogModule, SelectModule, TextareaModule, ConfirmDialogModule, 
    HasPermissionDirective, SelectButtonModule, ProgressSpinnerModule, TooltipModule
  ],
  providers: [ConfirmationService],
  templateUrl: './lista.html',
  styleUrl: './lista.css'
})
export class Lista implements OnInit {
    @ViewChild('dt') dt: any;

    private confirmationService = inject(ConfirmationService);
    private ticketsSvc = inject(TicketsService);
    private authSvc = inject(AuthService);
    private route = inject(ActivatedRoute);
    private cdr = inject(ChangeDetectorRef);

    tickets: any[] = [];
    ticket: any = {};
    groupId: string | null = '';
    loading: boolean = false;
    ticketDialog: boolean = false;
    submitted: boolean = false;
    selectedTickets: any[] = [];
    prioridadesCat: any[] = [];
    estadosCat: any[] = [];
    currentUser: any;

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
        if (savedUser) this.currentUser = JSON.parse(savedUser);

        this.groupId = this.route.parent?.snapshot.paramMap.get('id') || '';
        if (this.groupId) {
            this.loadInitialData(); // Cargamos catálogos y luego tickets
        }
    }

    loadInitialData() {
        this.loading = true;
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
        this.loading = true;
        this.ticketsSvc.getTicketsByGroup(this.groupId!).subscribe({
            next: (res) => {
                this.tickets = res.data;
                this.loading = false;
                this.cdr.markForCheck();
            },
            error: () => this.loading = false
        });
    }

    // Lógica unificada para editar
    editTicket(ticket: any) {
        this.ticket = { ...ticket };

        // 1. Sincronizar IDs para los Dropdowns
        if (this.ticket.prioridad) {
            this.ticket.prioridad_id = this.prioridadesCat.find(p => p.label === this.ticket.prioridad)?.value;
        }
        if (this.ticket.estado) {
            this.ticket.estado_id = this.estadosCat.find(e => e.label === this.ticket.estado)?.value;
        }

        // 2. Formatear fecha para el input type="date"
        if (this.ticket.fecha_final) {
            this.ticket.fecha_final = this.ticket.fecha_final.substring(0, 10);
        }

        this.ticketDialog = true;
    }

    saveTicket() {
        this.submitted = true;
        if (!this.ticket.titulo) return;

        this.loading = true;

        const payload = {
            grupo_id: Number(this.groupId),
            titulo: this.ticket.titulo,
            descripcion: this.ticket.descripcion || '',
            asignado_id: this.ticket.asignado_id ? Number(this.ticket.asignado_id) : null,
            estado_id: Number(this.ticket.estado_id),
            prioridad_id: Number(this.ticket.prioridad_id),
            fecha_final: this.ticket.fecha_final ? new Date(this.ticket.fecha_final).toISOString().split('T')[0] : null
        };

        this.ticketsSvc.updateTicket(this.ticket.id, payload).subscribe({
            next: () => {
                this.loadTickets();
                this.hideDialog();
            },
            error: () => this.loading = false
        });
    }

    // Permisos (Igual que en Kanban)
    puedoEditar(ticket: any): boolean {
        const tienePermiso = this.authSvc.hasPermission('tickets:move'); // O tickets:edit
        const esMio = String(ticket.asignado_id) === String(this.currentUser?.id);
        return tienePermiso && esMio;
    }

    get ticketsFiltrados() {
        if (!this.tickets) return [];
        if (this.filtroActivo === 'todos') return this.tickets;
        
        const userId = String(this.currentUser?.id);

        switch (this.filtroActivo) {
            case 'mis-tickets': return this.tickets.filter(t => String(t.asignado_id) === userId);
            case 'sin-asignar': return this.tickets.filter(t => !t.asignado_id);
            case 'alta': return this.tickets.filter(t => t.prioridad === 'Alta');
            case 'media': return this.tickets.filter(t => t.prioridad === 'Media');
            case 'baja': return this.tickets.filter(t => t.prioridad === 'Baja');
            default: return this.tickets;
        }
    }

    hideDialog() {
        this.ticketDialog = false;
        this.submitted = false;
    }

    getSeverity(prioridad: string) {
        const p = prioridad?.toLowerCase();
        if (p === 'alta') return 'danger';
        if (p === 'media') return 'warn';
        if (p === 'baja') return 'success';
        return 'secondary';
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
                    }
                });
            }
        });
    }
}
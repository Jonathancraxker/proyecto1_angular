import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router'; // Para capturar el :id de la ruta
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { CommonModule } from '@angular/common';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

import { HasPermissionDirective } from '../../../directives/has-permission.directive';
import { TicketsService } from '../../../services/tickets/tickets.service';

@Component({
  selector: 'app-resumen',
  standalone: true,
  imports: [CardModule, ButtonModule, TableModule, TagModule, CommonModule, ProgressSpinnerModule],
  templateUrl: './resumen.html',
  styleUrl: './resumen.css',
})
export class Resumen implements OnInit {
  activeTab: number = 0;
  private route = inject(ActivatedRoute);
  private cdr = inject(ChangeDetectorRef);
  private ticketsSvc = inject(TicketsService);
  
  groupId: string | null = '';
  loading: boolean = false;

  resumen = {
    total: 0,
    pendiente: 0,
    enProgreso: 0,
    hecho: 0,
    cerrado: 0
  };

  ticketsRecientes: any[] = [];

  ngOnInit() {
    // Captura el ID del grupo que seleccionaste en el Home
    this.groupId = this.route.parent?.snapshot.paramMap.get('id') || '';
    if (this.groupId) {
      // this.loadResumen();
      this.loadData();
    }
  }

  loadData() {
    this.loading = true;

    // 1. Obtener Stats del Grupo (SxTKS201)
    this.ticketsSvc.getGroupStats(this.groupId!).subscribe({
      next: (res) => {
        const s = res.data;
        this.resumen = {
          total: Number(s.total) || 0,
          pendiente: Number(s.pendientes) || 0,
          enProgreso: Number(s.en_progreso) || 0,
          hecho: Number(s.hechos) || 0,
          cerrado: Number(s.cerrados) || 0
        };
        this.cdr.markForCheck();
      }
    });
  // 2. Obtener los tickets recientes del grupo para mostrar en el resumen
    this.ticketsSvc.getTicketsByGroup(this.groupId!).subscribe({
      next: (res) => {
        // Mostramos todos
        this.ticketsRecientes = res.data;
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: () => this.loading = false
    });
  }
  
  getPrioritySeverity(prioridad: string) {
    switch (prioridad) {
      case 'Alta': return 'danger';
      case 'Media': return 'warn';
      case 'Baja': return 'secondary';
      default: return 'contrast';
    }
  }

}
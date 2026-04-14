import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { TicketsService } from '../../../services/tickets/tickets.service';

// PrimeNG
import { TimelineModule } from 'primeng/timeline';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { AvatarModule } from 'primeng/avatar';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'app-historial',
  standalone: true,
  imports: [
    CommonModule, TimelineModule, CardModule, TagModule, 
    ProgressSpinnerModule, AvatarModule, TooltipModule
  ],
  templateUrl: './historial.html',
  styleUrl: './historial.css',
})
export class Historial implements OnInit {
  private ticketsSvc = inject(TicketsService);
  private route = inject(ActivatedRoute);
  private cdr = inject(ChangeDetectorRef);

  loading: boolean = false;
  groupId: string | null = '';
  historial: any[] = [];

  ngOnInit() {
    // Obtenemos el ID del grupo desde el padre (Dashboard)
    this.groupId = this.route.parent?.snapshot.paramMap.get('id') || '';
    if (this.groupId) {
      this.loadHistory();
    }
  }

  loadHistory() {
    this.loading = true;
    this.ticketsSvc.getGroupHistory(this.groupId!).subscribe({
      next: (res) => {
        this.historial = res.data;
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
      }
    });
  }

  getIcon(accion: string): string {
    switch (accion) {
      case 'COMENTARIO': return 'pi pi-comment';
      case 'ACTUALIZACIÓN': return 'pi pi-refresh';
      case 'CREACIÓN': return 'pi pi-plus-circle';
      case 'ELIMINACIÓN': return 'pi pi-trash';
      default: return 'pi pi-info-circle';
    }
  }

  getColor(accion: string): string {
    switch (accion) {
      case 'COMENTARIO': return '#3b82f6'; // Azul
      case 'ACTUALIZACIÓN': return '#f59e0b'; // Ámbar
      case 'CREACIÓN': return '#10b981'; // Verde
      case 'ELIMINACIÓN': return '#ef4444'; // Rojo
      default: return '#6b7280';
    }
  }
}
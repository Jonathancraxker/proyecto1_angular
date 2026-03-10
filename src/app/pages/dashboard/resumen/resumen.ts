import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router'; // Para capturar el :id de la ruta
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-resumen',
  standalone: true,
  imports: [CardModule, ButtonModule, TableModule, CommonModule],
  templateUrl: './resumen.html',
  styleUrl: './resumen.css',
})
export class Resumen implements OnInit {
  activeTab: number = 0;
  // Inyección de dependencias para capturar el parámetro de la URL
  private route = inject(ActivatedRoute);
  
  groupId: string | null = '';

  // 1. Resumen de tickets solicitado 
  resumen = {
    total: 25,
    pendiente: 10,
    enProgreso: 5,
    hecho: 8,
    bloqueado: 2
  };

  // 2. Mini-lista de tickets recientes 
  ticketsRecientes = [
    { id: 'TK-001', titulo: 'Error en Login', estado: 'Pendiente', prioridad: 'Alta' },
    { id: 'TK-002', titulo: 'Ajustar estilos Sidebar', estado: 'En Progreso', prioridad: 'Media' },
    { id: 'TK-003', titulo: 'Revisar DB', estado: 'Hecho', prioridad: 'Baja' }
  ];

  ngOnInit() {
    // Captura el ID del grupo que seleccionaste en el Home
    this.groupId = this.route.snapshot.paramMap.get('id');
    console.log('Cargando datos para el grupo:', this.groupId);
  }

  // 3. Acción para el botón solicitado [cite: 20]
  crearTicket() {
    console.log('Abriendo modal para nuevo ticket...');
  }
}
import { Component, OnInit, inject } from '@angular/core';
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

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    HasPermissionDirective, CardModule, ButtonModule, TableModule, CommonModule, 
    TabsModule, RouterOutlet, RouterLink,
    DialogModule, InputTextModule, TextareaModule, SelectModule, FormsModule
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  activeTab: number = 0;
  private route = inject(ActivatedRoute);
  groupId: string | null = '';

  // Control del Modal (Paso 8)
  displayCreateModal: boolean = false;
  
  // Objeto para el nuevo ticket
  nuevoTicket: any = {
    titulo: '',
    descripcion: '',
    estado: 'Pendiente',
    prioridad: 'Media',
    responsable: ''
  };

  // Opciones de prioridad (como las definimos antes)
  prioridades = [
    { label: 'Extrema', value: 'Extrema' },
    { label: 'Alta', value: 'Alta' },
    { label: 'Media', value: 'Media' },
    { label: 'Baja', value: 'Baja' }
  ];

  estados = [
    { label: 'Pendiente', value: 'Pendiente' },
    { label: 'En proceso', value: 'En proceso' },
    { label: 'Revisión', value: 'Revisión' },
    { label: 'Hecho', value: 'Hecho' },
    { label: 'Bloqueado', value: 'Bloqueado' }
];

  ngOnInit() {
    this.groupId = this.route.snapshot.paramMap.get('id');
  }

  // Abrir modal (Paso 8)
  crearTicket() {
    this.nuevoTicket = {
      titulo: '',
      descripcion: '',
      estado: 'Pendiente',
      prioridad: 'Media',
      responsable: 'Jonathan' // Se asigna el creador por defecto como dice el PDF
    };
    this.displayCreateModal = true;
  }

  // Acción de guardar
  guardarTicket() {
    if (this.nuevoTicket.titulo.trim()) {
      console.log('Insertando en base de datos:', this.nuevoTicket);
      // Aquí iría la lógica para enviar al servicio
      this.displayCreateModal = false;
    }
  }
}
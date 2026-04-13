import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputTextModule } from 'primeng/inputtext';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { Router } from "@angular/router"; 
import { MessageModule } from 'primeng/message';
import { InputMaskModule } from 'primeng/inputmask';
import { MessageService, ConfirmationService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { PasswordModule } from 'primeng/password';
import { DividerModule } from 'primeng/divider';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { CommonModule } from '@angular/common';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TooltipModule } from 'primeng/tooltip';

import { AuthService } from '../../services/auth.service';
import { ProfileService } from '../../services/profile/profile.service';
import { TicketsService } from '../../services/tickets/tickets.service';

@Component({
  selector: 'app-profile',
  imports: [
    CommonModule, CardModule, ButtonModule, FormsModule,
    InputGroupModule, InputTextModule, InputGroupAddonModule, MessageModule, 
    InputMaskModule, ToastModule, PasswordModule, 
    DividerModule, ReactiveFormsModule, ConfirmDialogModule,
    TableModule, TagModule, ProgressSpinnerModule, TooltipModule
  ],
  standalone: true,
  providers: [MessageService, ConfirmationService],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile implements OnInit {
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private messageService = inject(MessageService);
  private confirmationService = inject(ConfirmationService);
  private authSvc = inject(AuthService);
  private profileSvc = inject(ProfileService);
  private ticketsSvc = inject(TicketsService);
  private cdr = inject(ChangeDetectorRef);
  profileForm: FormGroup;
  formSubmitted: boolean = false;
  isEditing: boolean = false;
  loading: boolean = false;
  successMessage: boolean = false; // Para mostrar mensaje de éxito después de actualizar
  // Reiniciamos los datos de prueba a vacíos
  ticketsAsignados: any[] = [];
  resumenCarga = { pendientes: 0, progreso: 0, hechos: 0, cerrados: 0 };
  
  // Variables auxiliares para controlar la carga conjunta
  private profileLoaded = false;
  private ticketsLoaded = false;

  constructor() {
    this.profileForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.minLength(10),
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$!%*?&])[A-Za-z\d@#$!%*?&]{10,}$/)
      ]],
      passwordConfirm: [''],
      username: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
      nombre: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
      direccion: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
      telefono: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10), Validators.pattern(/^\d{10}$/)]],
    }, { validators: this.passwordsMatchValidator });
  }

  ngOnInit() {
    this.loading = true;
    this.loadUserData();
    this.loadTicketsData();
  }

  loadUserData() {
    this.loading = true;
    this.cdr.markForCheck();
    
    this.profileSvc.getProfile().subscribe({
      next: (res) => {
        const user = res.data[0]; // Asumiendo que el backend devuelve un array con el usuario en la posición 0
        if (user) {
        this.profileForm.patchValue({
          username: user.username,
          email: user.email,
          nombre: user.nombre_completo,
          direccion: user.direccion,
          telefono: user.telefono
        });
      }
      this.loading = false;
      this.cdr.markForCheck();
      },
      error: () => this.loading = false
    });
  }

  loadTicketsData() {
    // 1. Cargar la lista de tickets asignados
    this.ticketsSvc.getMyAssignedTickets().subscribe({
      next: (res) => {
        this.ticketsAsignados = res.data;
        this.cdr.markForCheck();
      }
    });

    // 2. Cargar las estadísticas (Cards)
    this.ticketsSvc.getMyStats().subscribe({
      next: (res) => {
        const stats = res.data;
        this.resumenCarga = {
          pendientes: Number(stats.pendientes) || 0,
          progreso: Number(stats.en_progreso) || 0,
          hechos: Number(stats.hechos) || 0,
          cerrados: Number(stats.cerrados) || 0
        };
        this.ticketsLoaded = true;
        this.cdr.markForCheck();
      },
      error: () => {
        this.ticketsLoaded = true;
        this.loading = false;
        this.cdr.markForCheck();
      }
    });
  }

  // Método para activar la edición
toggleEdit() {
  this.isEditing = !this.isEditing;
  
  // Opcional: Si cancelas la edición, podrías resetear el formulario a los datos originales
  if (!this.isEditing) {
    this.loadUserData(); 
  }
}

  getSeverity(prioridad: string) {
    switch (prioridad) {
        case 'Alta': return 'danger';
        case 'Media': return 'warn';
        case 'Baja': return 'secondary';
        default: return 'contrast';
    }
  }

  passwordsMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const passwordConfirm = form.get('passwordConfirm')?.value;

    // Si ambos campos están vacíos, no mostramos error (porque la contraseña es opcional)
    if (!password && !passwordConfirm) {
      form.get('passwordConfirm')?.setErrors(null);
      return;
    }

    if (password !== passwordConfirm) {
      form.get('passwordConfirm')?.setErrors({ passwordsMismatch: true });
    } else {
      form.get('passwordConfirm')?.setErrors(null);
    }
  }

  isInvalid(controlName: string) {
    const control = this.profileForm.get(controlName);
    return control?.invalid && (control.touched || this.formSubmitted);
  }

  onSubmit() {
    this.formSubmitted = true;
    this.successMessage = false;
    if (this.profileForm.valid) {
      this.loading = true;
      const formValue = { ...this.profileForm.value };
      
      // Si la contraseña está vacía, la quitamos para que el back no intente hashear nada
      if (!formValue.password || formValue.password.trim() === '') {
        delete formValue.password;
      }
      delete formValue.passwordConfirm; // No lo necesita el backend
      
      // Mapeamos 'nombre' a 'nombre_completo' como espera tu back
      const payload = {
        ...formValue,
        nombre_completo: formValue.nombre
      };

      this.profileSvc.updateProfile(payload).subscribe({
        next: () => {
          this.loading = false;
          this.successMessage = true;
          this.formSubmitted = false;
          this.profileForm.get('password')?.reset();
          this.profileForm.get('passwordConfirm')?.reset();
          
          setTimeout(() => {
            this.successMessage = false;
            this.cdr.markForCheck();
          }, 3000);
          
          this.cdr.markForCheck();
        },
        error: (err) => {
          this.loading = false;
          this.cdr.markForCheck();
        }
      });
    }
  }

  onDelete() {
    this.confirmationService.confirm({
      message: '¿Realmente deseas eliminar tu perfil?', header: 'Confirmar eliminación', icon: 'pi pi-exclamation-triangle', acceptLabel: 'Eliminar', rejectLabel: 'Cerrar', acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.profileSvc.deleteProfile().subscribe({
          next: () => {
            setTimeout(() => this.authSvc.logout(), 2000);
          }
        });
      }
    });
  }
}
import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputTextModule } from 'primeng/inputtext';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { Router, RouterLink } from "@angular/router"; 
import { MessageModule } from 'primeng/message';
import { InputMaskModule } from 'primeng/inputmask';
import { MessageService, ConfirmationService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { InputNumberModule } from 'primeng/inputnumber';
import { PasswordModule } from 'primeng/password';
import { DividerModule } from 'primeng/divider';
import { SelectButtonModule } from 'primeng/selectbutton';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { CommonModule } from '@angular/common';

import { AuthService } from '../../services/auth.service';
import { ProfileService } from '../../services/profile/profile.service';

@Component({
  selector: 'app-profile',
  imports: [
    CommonModule, CardModule, ButtonModule, FormsModule, FloatLabelModule, 
    InputGroupModule, InputTextModule, InputGroupAddonModule, MessageModule, 
    InputMaskModule, ToastModule, InputNumberModule, PasswordModule, 
    DividerModule, SelectButtonModule, ReactiveFormsModule, ConfirmDialogModule,
    TableModule, TagModule
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
  private cdr = inject(ChangeDetectorRef);
  exampleForm: FormGroup;
  formSubmitted: boolean = false;
  loading: boolean = false;
  successMessage: boolean = false; // Para mostrar mensaje de éxito después de actualizar

  // Lista de tickets asignados a Jonathan (Paso 6)
  ticketsAsignados = [
    { id: 'TK-101', titulo: 'Corregir API Login', estado: 'En progreso', prioridad: 'Alta' },
    { id: 'TK-105', titulo: 'Diseño de Perfil', estado: 'Hecho', prioridad: 'Media' },
    { id: 'TK-110', titulo: 'Testing de Seguridad', estado: 'Pendiente', prioridad: 'Alta' }
  ];

  resumenCarga = {
    abiertos: 1,
    progreso: 1,
    hechos: 1
  };

  stateOptions: any[] = [{ label: 'Sí', value: 'SI' }, { label: 'No', value: 'NO' }];

  constructor() {
    this.exampleForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      //quiero que el password sea opcional, pero si se ingresa debe cumplir con los requisitos de seguridad
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
    this.loadUserData();
  }

  loadUserData() {
    this.loading = true;
    this.cdr.markForCheck();
    
    this.profileSvc.getProfile().subscribe({
      next: (res) => {
        const user = res.data[0]; // Asumiendo que tu backend devuelve un array con el usuario en la posición 0
        if (user) {
        this.exampleForm.patchValue({
          username: user.username,
          email: user.email,
          nombre: user.nombre_completo, // Asegúrate que el formControl se llame 'nombre'
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

  getSeverity(estado: string) {
    switch (estado) {
        case 'Hecho': return 'success';
        case 'En progreso': return 'info';
        case 'Pendiente': return 'warn';
        default: return 'secondary';
    }
  }

  // ... (Tus otros métodos passwordsMatchValidator, isInvalid, onSubmit, onDelete se mantienen igual)
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
    const control = this.exampleForm.get(controlName);
    return control?.invalid && (control.touched || this.formSubmitted);
  }

  onSubmit() {
    this.formSubmitted = true;
    this.successMessage = false;
    if (this.exampleForm.valid) {
      this.loading = true;
      const formValue = { ...this.exampleForm.value };
      
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
          this.exampleForm.get('password')?.reset();
          this.exampleForm.get('passwordConfirm')?.reset();
          
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

  // Confirmación antes de eliminar cuenta
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
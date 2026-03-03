import { Component, inject, OnInit } from '@angular/core';
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

@Component({
  selector: 'app-user',
  imports: [CardModule, ButtonModule, FormsModule, FloatLabelModule, InputGroupModule, InputTextModule, InputGroupAddonModule, MessageModule, InputMaskModule, ToastModule, InputNumberModule, PasswordModule, DividerModule, SelectButtonModule, ReactiveFormsModule, ConfirmDialogModule],
  standalone: true,
  providers: [MessageService, ConfirmationService],
  templateUrl: './user.html',
  styleUrl: './user.css',
})
export class User implements OnInit {
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private messageService = inject(MessageService);
  private confirmationService = inject(ConfirmationService);

  exampleForm: FormGroup;
  formSubmitted: boolean = false;

  stateOptions: any[] = [
    { label: 'Sí', value: 'SI' },
    { label: 'No', value: 'NO' }
  ];

  constructor() {
    this.exampleForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(10),
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{10,}$/)
      ]],
      username: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
      nombre: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
      direccion: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
      telefono: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10), Validators.pattern(/^\d{10}$/)]],
      edad: ['', [Validators.required]],
      passwordConfirm: ['', [Validators.required]]
    }, { validators: this.passwordsMatchValidator });
  }

  ngOnInit() {
    this.loadUserData();
  }

  loadUserData() {
    this.exampleForm.patchValue({
      username: 'draken',
      email: 'jonathan@ejemplo.com',
      nombre: 'Jonathan',
      direccion: 'De la Lealtad 23',
      telefono: '4411625463',
      edad: 'SI'
    });
  }

  passwordsMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const passwordConfirm = form.get('passwordConfirm')?.value;
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
    if (this.exampleForm.valid) {
      this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Perfil actualizado correctamente', life: 3000 });
      this.formSubmitted = false;
    }
  }

  onDelete() {
    this.confirmationService.confirm({
      message: '¿Realmente deseas eliminar tu perfil?',
      header: 'Confirmar eliminación',
      icon: 'pi pi-trash',
      acceptLabel: 'Eliminar',
      rejectLabel: 'Cerrar',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.messageService.add({ severity: 'info', summary: 'Eliminado', detail: 'Cuenta borrada' });
        setTimeout(() => this.router.navigate(['/']), 2000);
      }
    });
  }
}
import { Component, inject } from '@angular/core';
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
import { InputNumberModule } from 'primeng/inputnumber';
import { PasswordModule } from 'primeng/password';
import { DividerModule } from 'primeng/divider';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { SelectButtonModule } from 'primeng/selectbutton';
import { AuthService } from '../../../services/auth.service';
import { UserRegister } from '../../../models/register.interface';

@Component({
  selector: 'app-register',
  imports: [CardModule, ButtonModule, FormsModule, FloatLabelModule, InputGroupModule, InputTextModule, InputGroupAddonModule, RouterLink, MessageModule, InputMaskModule, InputNumberModule, PasswordModule, DividerModule, BreadcrumbModule, SelectButtonModule, ReactiveFormsModule],
  standalone: true,
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
    registerForm: FormGroup;
    formSubmitted: boolean = false;

    stateOptions: any[] = [
        { label: 'Sí', value: 'SI' },
        { label: 'No', value: 'NO' }
    ];

    constructor() {
        this.registerForm = this.fb.group({
          email: ['', [Validators.required, Validators.email]],
          password: ['', [Validators.required, Validators.minLength(10),
            Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$!%*?&])[A-Za-z\d@#$!%*?&]{10,}$/)
          ]],
          username: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
          nombre_completo: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(40)]],
          direccion: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
          telefono: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10), Validators.pattern(/^\d{10}$/)]],
          edad: ['', [Validators.required, Validators.pattern(/^(SI|NO)$/)]],
          passwordConfirm: ['', [Validators.required]]
        }, { validators: this.passwordsMatchValidator });
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
        const control = this.registerForm.get(controlName);
        return control?.invalid && (control.touched || this.formSubmitted);
    }

    onSubmit() {
    this.formSubmitted = true;

    // Validación de edad (lógica de negocio)
    if (this.registerForm.get('edad')?.value === 'NO') {
      return;
    }

    if (this.registerForm.valid) {
      // 1. Extraemos los valores del formulario
      const formValues = this.registerForm.value;

      // 2. Mapeamos al modelo que espera el Backend
      const userData: UserRegister = {
        nombre_completo: formValues.nombre_completo,
        username: formValues.username,
        email: formValues.email,
        password: formValues.password,
        direccion: formValues.direccion,
        telefono: formValues.telefono
      };

      // 3. Llamada al servicio
      this.authService.register(userData).subscribe({
        next: (response) => {
          
          this.registerForm.reset();
          this.formSubmitted = false;
          
          // Redirigir al login después de un pequeño delay
          setTimeout(() => this.router.navigate(['/']), 2000);
        },
        error: (err) => {
          console.error('Error en el registro:', err);
        }
      });
    }
  }
}

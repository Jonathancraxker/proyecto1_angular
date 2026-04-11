import { Component, inject, ChangeDetectorRef } from '@angular/core';
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

import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-login',
  imports: [CardModule, 
    ButtonModule, 
    FormsModule, 
    FloatLabelModule, 
    InputGroupModule, InputTextModule, InputGroupAddonModule, MessageModule, InputMaskModule, InputNumberModule, PasswordModule, ReactiveFormsModule, BreadcrumbModule, RouterLink, DividerModule],
  standalone: true,
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private router = inject(Router);
  private authService = inject(AuthService);
  private cdr = inject(ChangeDetectorRef);

  fb = inject(FormBuilder);
    loginForm: FormGroup;
    formSubmitted: boolean = false;
    isLoading: boolean = false;
    errorMessage: string | null = null;

    constructor() {
        this.loginForm = this.fb.group({
          email: ['', [Validators.required, Validators.email]],
          password: ['', [Validators.required, Validators.minLength(10),
            Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$!%*?&])[A-Za-z\d@#$!%*?&]{10,}$/)
          ]],
        });
      }

    async onSubmit() {
    this.formSubmitted = true;
    this.errorMessage = null;

    if (this.loginForm.valid) {
      this.isLoading = true;
      
      try {
        // Obtenemos los datos del formulario
        const credentials = this.loginForm.value;
        const success = await this.authService.login(credentials)
        if (success) {
            this.router.navigate(['/home']);
        } else {
          this.errorMessage = 'Credenciales inválidas';
          this.isLoading = false;
          this.cdr.markForCheck(); // forzar actualizacion de la vista
        }
      } catch (error) {
        this.errorMessage = 'Error de conexión';
        this.isLoading = false;
        this.cdr.markForCheck();
      } finally {
        if (!this.errorMessage) {
          this.isLoading = false;
          this.cdr.markForCheck(); // Forzar la actualización de la vista
        }
      }
    }
  }

    isInvalid(controlName: string) {
        const control = this.loginForm.get(controlName);
        return control?.invalid && (control.touched || this.formSubmitted);
    }
}
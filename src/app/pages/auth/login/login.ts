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
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
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
    InputGroupModule, InputTextModule, InputGroupAddonModule, MessageModule, InputMaskModule, ToastModule, InputNumberModule, PasswordModule, ReactiveFormsModule, BreadcrumbModule, RouterLink, DividerModule],
  standalone: true,
  providers: [MessageService],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private router = inject(Router);
  private authService = inject(AuthService);

  fb = inject(FormBuilder);
  messageService = inject(MessageService);
    loginForm: FormGroup;
    formSubmitted: boolean = false;
    isLoading: boolean = false;

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
    
    if (this.loginForm.valid) {
      this.isLoading = true;
      
      try {
        // Obtenemos los datos del formulario
        const credentials = this.loginForm.value;
        
        // Llamamos al servicio
        const success = await this.authService.login(credentials);

        if (success) {
          this.messageService.add({ 
            severity: 'success', 
            summary: '¡Bienvenido!', 
            detail: 'Sesión iniciada correctamente', 
            life: 5000
          });
          
          // Navegamos al home
          setTimeout(() => {
            this.router.navigate(['/home']);
          }, 1000);
        } else {
          this.messageService.add({ 
            severity: 'error', 
            summary: 'Error', 
            detail: 'Credenciales inválidas', 
            life: 3000 
          });
        }
      } catch (error) {
        this.messageService.add({ 
          severity: 'error', 
          summary: 'Error de conexión', 
          detail: 'No se pudo conectar con el servidor', 
          life: 3000 
        });
      } finally {
        this.isLoading = false;
      }
    }
  }

    isInvalid(controlName: string) {
        const control = this.loginForm.get(controlName);
        return control?.invalid && (control.touched || this.formSubmitted);
    }
}
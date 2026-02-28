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
import { SelectButtonModule } from 'primeng/selectbutton';

@Component({
  selector: 'app-register',
  imports: [CardModule, ButtonModule, FormsModule, FloatLabelModule, InputGroupModule, InputTextModule, InputGroupAddonModule, RouterLink, MessageModule, InputMaskModule, ToastModule, InputNumberModule, PasswordModule, DividerModule, BreadcrumbModule, SelectButtonModule, ReactiveFormsModule],
  standalone: true,
  providers: [MessageService],
  templateUrl: './user.html',
  styleUrl: './user.css',
})
export class User {
  private router = inject(Router);
  fb = inject(FormBuilder);
  messageService = inject(MessageService);
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
        const control = this.exampleForm.get(controlName);
        return control?.invalid && (control.touched || this.formSubmitted);
    }

    onSubmit() {
      this.formSubmitted = true;
      if (this.exampleForm.get('edad')?.value === 'NO') {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Lo sentimos, el registro solo es para mayores de edad.', life: 3000 });
        return;
      }
      if (this.exampleForm.valid) {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Form Submitted', life: 3000 });
          this.exampleForm.reset();
          this.formSubmitted = false;
          this.router.navigate(['/']);
        }
    }

}

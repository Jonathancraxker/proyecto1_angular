import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputTextModule } from 'primeng/inputtext';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { RouterLink } from "@angular/router"; 

@Component({
  selector: 'app-register',
  imports: [CardModule, ButtonModule, FormsModule, FloatLabelModule, InputGroupModule, InputTextModule, InputGroupAddonModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  value1: string | undefined;
  value2: string | undefined;
  value3: string | undefined;
}

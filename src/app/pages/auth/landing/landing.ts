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
  selector: 'app-landing',
  imports: [
    FormsModule,
    FloatLabelModule,
    InputGroupModule,
    InputTextModule,
    CardModule,
    ButtonModule,
    InputGroupAddonModule,
    RouterLink
  ],
  templateUrl: './landing.html',
  styleUrl: './landing.css',
})
export class Landing {
  usuario: string = 'Jonathan';
  nombreProyecto: string = 'ANTEIKU';

}

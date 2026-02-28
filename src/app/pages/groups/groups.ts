import { Component } from '@angular/core';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';  

@Component({
  selector: 'app-groups',
  standalone: true,
  imports: [CardModule, ButtonModule],
  templateUrl: './groups.html',
  styleUrl: './groups.css',
})
export class Groups {

}

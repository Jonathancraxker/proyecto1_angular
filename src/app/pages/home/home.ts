import { Component } from '@angular/core';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { AvatarModule } from 'primeng/avatar';

@Component({
  selector: 'app-home',
  imports: [CardModule, ButtonModule, AvatarModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  userName: string = 'Jonathan';
}

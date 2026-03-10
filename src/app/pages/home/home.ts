import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { AvatarModule } from 'primeng/avatar';
import { ProductService } from '../../services/productservice';
import { Router } from '@angular/router';
import { inject } from '@angular/core';
import { TagModule } from 'primeng/tag';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CardModule, ButtonModule, AvatarModule, TagModule, CommonModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
  providers: [ProductService]
})
export class Home implements OnInit{
  private productService = inject(ProductService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);
groups: any[] = [];

ngOnInit() {
    this.productService.getProducts().then(data => {
        this.groups = data;
        this.cdr.detectChanges();
    });
}

entrarAlGrupo(id: string) {
    this.router.navigate(['/dashboard', id]);
}

getSeverity(nivel: string) {
        switch (nivel) {
            case 'Hecho': return 'success';
            case 'En progreso': return 'info';
            case 'Pendiente': return 'warn';
            case 'Bloqueado': return 'danger';
            default: return 'secondary';
        }
    }
}

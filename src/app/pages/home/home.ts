import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { AvatarModule } from 'primeng/avatar';
import { GroupsService } from '../../services/admin-groups/groups.service';
import { Router } from '@angular/router';
import { inject } from '@angular/core';
import { TagModule } from 'primeng/tag';
import { CommonModule } from '@angular/common';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TableModule } from "primeng/table";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CardModule, ButtonModule, AvatarModule, TagModule, CommonModule, ProgressSpinnerModule, TableModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit{
  private groupsSvc = inject(GroupsService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);
groups: any[] = [];
loading: boolean = false;

    ngOnInit() {
        this.loadMyGroups();
    }

    loadMyGroups() {
        this.loading = true;
        this.groupsSvc.getMyGroups().subscribe({
            next: (res: any) => {
                this.groups = res.data;
                this.loading = false;
                this.cdr.detectChanges();
            },
            error: (err) => {
                console.error('Error cargando mis grupos', err);
                this.loading = false;
            }
        });
    }

entrarAlGrupo(id: number) {
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

// services/profile.service.ts
import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ProfileService {
    private http = inject(HttpClient);
    private apiUrl = `${environment.apiUsuarios}/profile`;

    private getHeaders() {
        const token = localStorage.getItem('token'); // La llave que usaste en AuthService
        return new HttpHeaders({
            // Si tu middleware usa req.headers.authorization
            'Authorization': `Bearer ${token}`
        });
    }

    // Obtener datos del usuario logueado
    getProfile() {
        return this.http.get<any>(this.apiUrl, { headers: this.getHeaders() });
    }

    // Actualizar datos (incluyendo password opcional)
    updateProfile(userData: any) {
        return this.http.put<any>(this.apiUrl, userData, { headers: this.getHeaders() });
    }

    // Eliminar cuenta
    deleteProfile() {
        return this.http.delete<any>(this.apiUrl, { headers: this.getHeaders() });
    }
}
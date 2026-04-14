import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class GroupsService {
    private http = inject(HttpClient);
    private apiUrl = environment.apiGrupos;

    private getHeaders() {
        const token = localStorage.getItem('token'); // La llave que usaste en AuthService
        return new HttpHeaders({
            // Si tu middleware usa req.headers.authorization
            'Authorization': `Bearer ${token}`
        });
    }

    // Obtener los grupos del usuario logueado (mis grupos)
    getMyGroups(): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/my-groups`, { headers: this.getHeaders() });
    }

    // 1. Obtener todos los grupos (con los conteos de integrantes/tickets)
    getGroups(): Observable<any> {
        // return this.http.get<any>(this.apiUrl, { headers: this.getHeaders() });
        return this.http.get<any>(this.apiUrl + '/', { headers: this.getHeaders() });
    }

    getGroup(groupId: number): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/${groupId}`, { headers: this.getHeaders() });
    }

    // 2. Crear un nuevo grupo
    createGroup(groupData: any): Observable<any> {
        return this.http.post<any>(this.apiUrl, groupData, { headers: this.getHeaders() });
    }

    // 3. Actualizar un grupo existente
    updateGroup(id: number, groupData: any): Observable<any> {
        return this.http.put<any>(`${this.apiUrl}/${id}`, groupData, { headers: this.getHeaders() });
    }

    // 4. Eliminar un grupo
    deleteGroup(id: number): Observable<any> {
        return this.http.delete<any>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
    }

    // --- MÉTODOS DE GESTIÓN DE MIEMBROS ---

    // 5. Obtener los permisos de un miembro en un grupo
    getMemberPermissions(groupId: number, userId: number): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/${groupId}/members/${userId}/permissions`, { headers: this.getHeaders() });
    }

    // 6. Vincular un usuario a un grupo
    addMember(groupId: number, userId: number): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/${groupId}/members/${userId}`, {}, { headers: this.getHeaders() });
    }

    // 7. Configurar permisos de un miembro en el grupo
    updateMemberPermissions(groupId: number, userId: number, permissions: number[]): Observable<any> {
        return this.http.put<any>(`${this.apiUrl}/${groupId}/members/${userId}/permissions`, permissions, { headers: this.getHeaders() });
    }

    // ---Para las funciones de gestión de miembros dentro de un grupo ---
    
    //Obtener la lista de miembros de un grupo
    getGroupMembers(groupId: number): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/${groupId}/members`, { headers: this.getHeaders() });
    }

    // Invitar a un usuario por email a un grupo
    inviteUserByEmail(groupId: number, email: string): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/${groupId}/invite`, { email }, { headers: this.getHeaders() });
    }

    // Actualizar la información del grupo (nombre, descripción)
    updateGroupInfo(groupId: number, data: any): Observable<any> {
        return this.http.put<any>(`${this.apiUrl}/${groupId}`, data, { headers: this.getHeaders() });
    }

    // Eliminar a un miembro de un grupo
    removeMember(groupId: number, userId: number): Observable<any> {
        return this.http.delete<any>(`${this.apiUrl}/${groupId}/members/${userId}`, { headers: this.getHeaders() });
    }
}
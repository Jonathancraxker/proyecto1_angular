import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
providedIn: 'root'
})
export class TicketsService {
private http = inject(HttpClient);
private apiUrl = `${environment.apiTickets}/tickets`;

private getHeaders() {
        const token = localStorage.getItem('token');
        return new HttpHeaders({
            'Authorization': `Bearer ${token}`
        });
    }

// Obtener estadísticas rápidas de un grupo específico
getGroupStats(groupId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/group/${groupId}/stats`, { headers: this.getHeaders() });
}

// Obtener tickets de un grupo específico
getTicketsByGroup(groupId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/group/${groupId}`, { headers: this.getHeaders() });
}

// Obtener tickets asignados al usuario actual
getMyAssignedTickets(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/my-assigned`, { headers: this.getHeaders() });
}

// Obtener estadísticas rápidas del usuario
getMyStats(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/my-stats`, { headers: this.getHeaders() });
}

// Obtener catálogos (estados y prioridades)
getCatalogos(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/catalogos`, { headers: this.getHeaders() });
}

// Crear el ticket
createTicket(ticket: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/`, ticket, { headers: this.getHeaders() });
}

// Actualizar el ticket
updateTicket(ticketId: string, ticket: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${ticketId}`, ticket, { headers: this.getHeaders() });
}

// Eliminar el ticket
deleteTicket(ticketId: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${ticketId}`, { headers: this.getHeaders() });
}

// Comentarios
getComments(ticketId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${ticketId}/comments`, { headers: this.getHeaders() });
}

addComment(ticketId: string, contenido: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${ticketId}/comments`, { contenido }, { headers: this.getHeaders() });
}

}
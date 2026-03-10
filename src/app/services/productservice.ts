import { Injectable } from '@angular/core';

@Injectable()
export class ProductService {
    getProducts() {
        return Promise.resolve([
            { id: '1', nivel: 'Hecho', autor: 'Emmanuel', nombre: 'Equipo DEV', integrantes: '3', tickets: 10, descripcion: 'Equipo encargado de desarrollar' },
            { id: '2', nivel: 'En progreso', autor: 'Jonathan', nombre: 'Soporte', integrantes: '2', tickets: 5, descripcion: 'Equipo de atención al cliente' },
            { id: '3', nivel: 'Pendiente', autor: 'Erick', nombre: 'UX', integrantes: '4', tickets: 15, descripcion: 'Equipo de Experiencia de usuario' },
            { id: '4', nivel: 'Bloqueado', autor: 'Carlos', nombre: 'QA', integrantes: '3', tickets: 8, descripcion: 'Equipo de aseguramiento de calidad' }
        ]);
    }
}
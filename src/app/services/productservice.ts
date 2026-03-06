import { Injectable } from '@angular/core';

@Injectable()
export class ProductService {
    getProducts() {
        return Promise.resolve([
            { id: '1', nivel: 'Principiante', autor: 'Emmanuel', nombre: 'EcoParking', integrantes: '3', tickets: 10, descripcion: 'App de estacionamiento' },
            { id: '2', nivel: 'Intermedio', autor: 'Jonathan', nombre: 'Anteiku App', integrantes: '2', tickets: 5, descripcion: 'Gestión de cafetería' },
            { id: '3', nivel: 'Avanzado', autor: 'Santiago', nombre: 'Gourmet', integrantes: '4', tickets: 15, descripcion: 'App de recetas' }
        ]);
    }
}
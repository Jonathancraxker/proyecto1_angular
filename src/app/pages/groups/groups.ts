import { Component, OnInit, inject, ViewChild } from '@angular/core';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';  
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common'

import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { SelectModule } from 'primeng/select';
import { FileUploadModule } from 'primeng/fileupload';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputNumberModule } from 'primeng/inputnumber';
import { RadioButtonModule } from 'primeng/radiobutton';
import { RatingModule } from 'primeng/rating';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { ProductService } from '../../service/productservice';
import { Product } from '../../domain/product';
import { MessageService, ConfirmationService } from 'primeng/api';

interface Column {
    field: string;
    header: string;
    customExportHeader?: string;
}

interface ExportColumn {
    title: string;
    dataKey: string;
}

@Component({
  selector: 'app-groups',
  standalone: true,
  imports: [
    CardModule, ButtonModule, FormsModule, TableModule, InputTextModule, 
    CommonModule, DialogModule, SelectModule, FileUploadModule, 
    IconFieldModule, InputIconModule, InputNumberModule, RadioButtonModule, 
    RatingModule, TagModule, ToastModule, ToolbarModule, ConfirmDialogModule,
    TextareaModule
  ],
  providers: [ProductService, MessageService, ConfirmationService],
  templateUrl: './groups.html',
  styleUrl: './groups.css',
})
export class Groups implements OnInit {
    @ViewChild('dt') dt: any;
    
    private productService = inject(ProductService);
    private messageService = inject(MessageService);
    private confirmationService = inject(ConfirmationService);

    productDialog: boolean = false;
    products!: Product[];
    product!: Product;
    selectedProducts!: Product[] | null;
    submitted: boolean = false;
    statuses!: any[];
    cols!: Column[];
    exportColumns!: ExportColumn[];

    ngOnInit() {
        this.productService.getProducts().then((data: Product[]) => {
            this.products = data;
        });

        this.statuses = [
            { label: 'Principiante', value: 'Principiante' },
            { label: 'Intermedio', value: 'Intermedio' },
            { label: 'Avanzado', value: 'Avanzado' }
        ];

        this.cols = [
            { field: 'nivel', header: 'Nivel' },
            { field: 'autor', header: 'Autor' },
            { field: 'nombre', header: 'Nombre' },
            { field: 'integrantes', header: 'Integrantes' },
            { field: 'tickets', header: 'Tickets' },
            { field: 'descripcion', header: 'Descripción' }
        ];

        this.exportColumns = this.cols.map((col) => ({ title: col.header, dataKey: col.field }));
    }

    openNew() {
        this.product = {};
        this.submitted = false;
        this.productDialog = true;
    }

    editProduct(product: Product) {
        this.product = { ...product };
        this.productDialog = true;
    }

    deleteSelectedProducts() {
        this.confirmationService.confirm({
            message: '¿Estás seguro de que quieres eliminar los grupos seleccionados?',
            header: 'Confirmar',
            icon: 'pi pi-exclamation-triangle',
            rejectButtonProps: { label: 'No', severity: 'secondary', variant: 'text' },
            acceptButtonProps: { severity: 'danger', label: 'Sí' },
            accept: () => {
                this.products = this.products.filter((val) => !this.selectedProducts?.includes(val));
                this.selectedProducts = null;
                this.messageService.add({
                    severity: 'success',
                    summary: 'Exitoso',
                    detail: 'Grupos eliminados',
                    life: 3000
                });
            }
        });
    }

    hideDialog() {
        this.productDialog = false;
        this.submitted = false;
    }

    deleteProduct(product: Product) {
        this.confirmationService.confirm({
            message: '¿Estás seguro de que quieres eliminar a ' + product.nombre + '?',
            header: 'Confirmar',
            icon: 'pi pi-exclamation-triangle',
            rejectButtonProps: { label: 'No', severity: 'secondary', variant: 'text' },
            acceptButtonProps: { severity: 'danger', label: 'Sí' },
            accept: () => {
                this.products = this.products.filter((val) => val.id !== product.id);
                this.product = {};
                this.messageService.add({
                    severity: 'success',
                    summary: 'Exitoso',
                    detail: 'Grupo eliminado',
                    life: 3000
                });
            }
        });
    }

    findIndexById(id: string): number {
        let index = -1;
        for (let i = 0; i < this.products.length; i++) {
            if (this.products[i].id === id) {
                index = i;
                break;
            }
        }
        return index;
    }

    createId(): string {
        let id = '';
        var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (var i = 0; i < 5; i++) {
            id += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return id;
    }

    getSeverity(nivel: string) {
        switch (nivel) {
            case 'Avanzado': return 'success';
            case 'Intermedio': return 'warn';
            case 'Principiante': return 'info';
            default: return 'secondary';
        }
    }

    saveProduct() {
        this.submitted = true;

        if (this.product.nombre?.trim()) {
            if (this.product.id) {
                this.products[this.findIndexById(this.product.id)] = this.product;
                this.messageService.add({
                    severity: 'success',
                    summary: 'Exitoso',
                    detail: 'Grupo actualizado',
                    life: 3000
                });
            } else {
                this.product.id = this.createId();
                this.products.push(this.product);
                this.messageService.add({
                    severity: 'success',
                    summary: 'Exitoso',
                    detail: 'Grupo creado',
                    life: 3000
                });
            }

            this.products = [...this.products];
            this.productDialog = false;
            this.product = {};
        }
    }

    exportCSV(event: any) {
        this.dt.exportCSV();
    }
}
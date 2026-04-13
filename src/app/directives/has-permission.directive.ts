import { Directive, Input, TemplateRef, ViewContainerRef, effect, inject } from '@angular/core';
import { PermissionsService } from '../services/permissions.service';

@Directive({
  selector: '[ifHasPermission]',
  standalone: true
})
export class HasPermissionDirective {
  private permissionsSvc = inject(PermissionsService);
  private templateRef = inject(TemplateRef<any>);
  private viewContainer = inject(ViewContainerRef);

  @Input('ifHasPermission') permisos: string | string[] = '';

  constructor() {
    // El effect se encarga de re-evaluar todo automáticamente
    effect(() => {
      // Al llamar a permissions$(), Angular sabe que esta directiva 
      // depende de ese signal.
      const actualPerms = this.permissionsSvc.permissions$(); 
      this.updateView();
    });
  }

  private updateView() {
    this.viewContainer.clear();
    const permisosArray = Array.isArray(this.permisos) ? this.permisos : [this.permisos];

    if (this.permissionsSvc.hasAnyPermission(permisosArray)) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    }
  }
}
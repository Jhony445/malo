import { Routes } from '@angular/router';
import { TablonEmpresasComponent } from './features/tablon-empresas/tablon-empresas.component';

export const empresasRoutes: Routes = [
    { path: '', component: TablonEmpresasComponent }, // Muestra la lista de empleos por defecto
    //{ path: 'perfil', component: PerfilComponent }, // Ruta para el perfil
  ];
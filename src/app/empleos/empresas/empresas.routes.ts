import { Routes } from '@angular/router';
import { TablonEmpresasComponent } from './features/tablon-empresas/tablon-empresas.component';
import { CreacionEmpleoComponent } from './features/creacion-empleo/creacion-empleo.component';

export const empresasRoutes: Routes = [
  { path: '', component: TablonEmpresasComponent },
  { path: 'crear', component: CreacionEmpleoComponent }
];
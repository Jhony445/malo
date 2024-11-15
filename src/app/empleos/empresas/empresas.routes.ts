import { Routes } from '@angular/router';
import { TablonEmpresasComponent } from './features/tablon-empresas/tablon-empresas.component';
import { CreacionEmpleoComponent } from './features/creacion-empleo/creacion-empleo.component';
import { PerfilEmpresaComponent } from './features/perfil-empresa/perfil-empresa.component';
import { PostulacionEmpleosComponent } from './features/postulacion-empleos/postulacion-empleos.component';
import { EstadisticasEmpleosComponent } from './features/estadisticas-empleos/estadisticas-empleos.component';

export const empresasRoutes: Routes = [
  { path: '', component: TablonEmpresasComponent },
  { path: 'crear', component: CreacionEmpleoComponent },
  {path:'perfil', component:PerfilEmpresaComponent},
  {path: 'postulacion-empleos', component: PostulacionEmpleosComponent},
  {path: 'estadisticas-empleos', component: EstadisticasEmpleosComponent},
];
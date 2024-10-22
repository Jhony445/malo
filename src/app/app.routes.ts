import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component'; 
import { UsuariosComponent } from './empleos/usuarios/usuarios.component';

export const appRoutes: Routes = [
  { path: '', component: DashboardComponent },  
  {
    path: 'auth',
    loadChildren: () => import('./auth/features/auth.routes').then(m => m.AUTH_ROUTES)  // Lazy load para auth
  },
  {
    path: 'usuario', // Agrégale la ruta base para empleos
    component: UsuariosComponent// Usa las rutas importadas aquí
  },
  { path: '**', redirectTo: '' }  
];

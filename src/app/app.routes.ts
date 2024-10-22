import { Routes } from '@angular/router'; 
import { DashboardComponent } from './dashboard/dashboard.component'; 
import { UsuariosComponent } from './empleos/usuarios/usuarios.component';
import { empresasComponent } from './empleos/empresas/empresas.component'; 

export const appRoutes: Routes = [
  { path: '', component: DashboardComponent },  
  {
    path: 'auth',
    loadChildren: () => import('./auth/features/auth.routes').then(m => m.AUTH_ROUTES)  // Lazy load para auth
  },
  {
    path: 'usuario', // Ruta base para usuarios
    component: UsuariosComponent, // Componente principal para la ruta usuario
    loadChildren: () => import('./empleos/usuarios/usuarios.routes').then(m => m.usuariosRoutes) // Cargar las rutas de usuarios
  },
  {
    path: 'empresa', // Ruta base para usuarios
    component: empresasComponent, // Componente principal para la ruta usuario
    loadChildren: () => import('./empleos/empresas/empresas.routes').then(m => m.empresasRoutes) // Cargar las rutas de usuarios
  },
  { path: '**', redirectTo: '' }  
];

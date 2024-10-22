import { Routes } from '@angular/router'; 
import { ListaEmpleosComponent } from './features/lista-empleos/lista-empleos.component'; 
import { PerfilComponent } from './features/perfil/perfil.component'; 

export const usuariosRoutes: Routes = [
  { path: '', component: ListaEmpleosComponent }, // Muestra la lista de empleos por defecto
  { path: 'perfil', component: PerfilComponent }, // Ruta para el perfil
];


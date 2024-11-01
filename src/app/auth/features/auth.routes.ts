import { Routes } from '@angular/router';
import { LogInComponent } from './log-in/log-in.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { SelectRegisterComponent } from './select-register/select-register.component';
import { RegisterCompanyComponent } from './register-company/register-company.component';

export const AUTH_ROUTES: Routes = [
  { path: 'login', component: LogInComponent },
  { path: 'select-register', component: SelectRegisterComponent },
  { path: 'register-company', component: RegisterCompanyComponent },
  { path: 'sign-up', component: SignUpComponent }
];

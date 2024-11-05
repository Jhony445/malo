import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, CommonModule],
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent {
  forgotPasswordForm: FormGroup;
  passwordMatchError = false;

  fb = inject(FormBuilder);

  constructor() {
    this.forgotPasswordForm = this.fb.group({
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.forgotPasswordForm.valid && !this.passwordMatchError) {
      // Aquí enviarías la nueva contraseña al backend
      console.log("Contraseña restablecida con éxito:", this.forgotPasswordForm.get('newPassword')?.value);
    }
  }

  checkPasswordMatch() {
    const newPassword = this.forgotPasswordForm.get('newPassword')?.value;
    const confirmPassword = this.forgotPasswordForm.get('confirmPassword')?.value;
    this.passwordMatchError = newPassword !== confirmPassword;
  }
}

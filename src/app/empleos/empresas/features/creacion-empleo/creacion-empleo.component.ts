import { Component } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { UserService } from '../../../../core/services/user.service';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { LoaderComponent } from '../../../../shared/ui/loader/loader.component';
import { CommonModule } from '@angular/common';
import { NotificationComponent } from '../../../../shared/ui/notification/notification.component';
import { Location } from '@angular/common';

@Component({
  selector: 'app-creacion-empleo',
  standalone: true,
  imports: [ReactiveFormsModule, LoaderComponent, CommonModule, NotificationComponent],
  templateUrl: './creacion-empleo.component.html',
  styleUrls: ['./creacion-empleo.component.css', './icons-empleo.component.css']
})
export class CreacionEmpleoComponent {
  empleoForm: FormGroup;
  isLoading = false;
  errorMessage = '';
  successMessage = '';
  multimediaFile: File | null = null;
  currentSection = 1;

  constructor(
    private userService: UserService,
    private http: HttpClient,
    private fb: FormBuilder,
    private router: Router,
    private location: Location
  ) {
    this.empleoForm = this.fb.group({
      titulo: ['', Validators.required],
      descripcion: ['', Validators.required],
      ubicacion: ['', Validators.required],
      salarioMinimo: [0, [Validators.required, Validators.min(0)]],
      salarioMaximo: [0, [Validators.required, Validators.min(0)]],
      horario: ['', Validators.required],
      multimediaNombre: ['', Validators.required],
      multimediaTipo: ['', Validators.required]
    },{validators: this.salarioValidator });
  } 

  salarioValidator(group: AbstractControl): ValidationErrors | null {
    const salarioMinimo = group.get('salarioMinimo')?.value;
    const salarioMaximo = group.get('salarioMaximo')?.value;
    if (salarioMinimo && salarioMaximo && salarioMinimo > salarioMaximo) {
      return { salarioInvalido: true };
    }
    return null;
  }

  goToNextSection() {
    if (this.currentSection === 1) {
      this.currentSection = 2;
    }
  }
  goToBackSection() {
    if (this.currentSection === 2) {
      this.currentSection = 1;
    }
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      
      // Verificar si el archivo es de tipo imagen
      if (!file.type.startsWith('image/')) {
        this.errorMessage = 'Por favor, selecciona solo archivos de imagen.';
        this.clearMessagesAfterDelay();
        return;
      }
  
      this.multimediaFile = file;
      this.empleoForm.patchValue({
        multimediaNombre: file.name,
        multimediaTipo: file.type
      });
    }
  }
  
  crearEmpleo() {
    const userData = this.userService.getUserData();
    if (!userData) {
      console.error("Usuario no autenticado");
      this.errorMessage = "Usuario no autenticado";
      return;
    }

    if (!this.empleoForm.valid || !this.multimediaFile) {
      console.error("Formulario inválido o archivo de imagen no seleccionado.");
      this.errorMessage = "Formulario inválido o archivo de imagen no seleccionado.";
      this.clearMessagesAfterDelay();
      return;
    }

    //FormData para enviar los datos como form-data
    const formData = new FormData();
    formData.append('titulo', this.empleoForm.value.titulo);
    formData.append('descripcion', this.empleoForm.value.descripcion);
    formData.append('ubicacion', this.empleoForm.value.ubicacion);
    formData.append('salario_minimo', this.empleoForm.value.salarioMinimo.toString());
    formData.append('salario_maximo', this.empleoForm.value.salarioMaximo.toString());
    formData.append('horario', this.empleoForm.value.horario);
    formData.append('empresa_id', userData.sub);
    formData.append('multimediaNombre', this.multimediaFile?.name || '');
    formData.append('multimediaTipo', this.multimediaFile?.type || '');
    formData.append('archivo', this.multimediaFile);

    formData.append('ContentType', this.multimediaFile.type);
    formData.append('ContentDisposition', `attachment; filename="${this.multimediaFile.name}"`);
    formData.append('Length', this.multimediaFile.size.toString());
    formData.append('Name', this.empleoForm.value.multimediaNombre);
    formData.append('FileName', this.multimediaFile.name);

    this.isLoading = true;

    this.http.post('https://malo-backend-empleos.onrender.com/api/Empleo/PostEmpleo', formData, { responseType: 'text' })
  .subscribe(
    response => {
      console.log('Empleo creado exitosamente:', response);
      this.successMessage = response; // Muestra el mensaje de éxito devuelto por el servidor
      this.router.navigate(['/empresa']);
    },
    (error: HttpErrorResponse) => {
      if (error.status === 400) {
        console.error("Error de validación en el servidor:", error.error);
        this.errorMessage = "Error de validación en el servidor: " + error.error;
      } else if (error.status === 500) {
        console.error("Error del servidor al procesar la solicitud:", error.error);
        this.errorMessage = "Error del servidor al procesar la solicitud: " + error.error;
      } else {
        console.error("Error desconocido al crear empleo:", error);
        this.errorMessage = "Error desconocido al crear empleo: " + error.error;
      }
    }
  ).add(() => {
    this.isLoading = false;
  });
  }

  private clearMessagesAfterDelay() {
    setTimeout(() => {
      this.errorMessage = '';
      this.successMessage = '';
    }, 3000);
  }

  onCancel() {
    this.location.back();
  }
}
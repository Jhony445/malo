import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { LoaderComponent } from '../../../shared/ui/loader/loader.component';
import { NotificationComponent } from '../../../shared/ui/notification/notification.component';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [CommonModule, FormsModule, LoaderComponent, NotificationComponent],
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css'],
})
export class SignUpComponent implements OnInit {
  currentStep = 1;
  //datos usuario
  nombre = '';
  apellidos = '';
  telefono = '';
  fechaNacimiento = '';
  correo = '';
  contrasena = '';
  confirmPass = '';
  codigoInp = '';
  telefonoTouched = false;
  emailTouched = false;
  passwordTouched = false;
  confirmPassTouched = false;
  nombreTouched = false;
  apellidosTouched = false;
  fechaNacimientoTouched = false;
  estadoTouched = false;
  municipioTouched = false;
  localidadTouched = false;
  codigoInpTouched = false;
  emailButtonClicked = false;
  //ubicacion
  estados: any[] = [];
  municipios: any[] = [];
  localidades: any[] = [];
  estado = '';
  municipio= '';
  localidad= '';
  //otros
  router = inject(Router);
  http = inject(HttpClient);
  isLoading = false;
  emailSent = false;
  verificationCode = '';
  errorMessage = '';

  ngOnInit(): void {
    this.getEstados();
  }

  nextStep() {
    if (this.currentStep < 5) {
      this.currentStep++;
    }
  }

  previousStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  goToStep(step: number) {
    this.currentStep = step;
  }

  isForm1Valid(): boolean {
    return !!this.nombre && !!this.apellidos;
  }
  
  isForm2Valid(): boolean {
    return !!this.isPhoneValid(this.telefono) && !!this.fechaNacimiento;
  }
  
  isForm3Valid(): boolean {
    return !!this.localidad && !!this.estado && !!this.municipio;
  }

  isForm4Valid(): boolean {
    return this.isEmailValid(this.correo) && 
           this.isPasswordValid(this.contrasena) && 
           this.doPasswordsMatch(this.contrasena, this.confirmPass)
           
  }

  isEmailValid(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
  
  isPasswordValid(password: string): boolean {
    const passwordRegex = /^(?=.*[A-Z]).{8,}$/;
    return passwordRegex.test(password);
  }
  
  doPasswordsMatch(password: string, confirmPassword: string): boolean {
    return password === confirmPassword;
  }
  
  isPhoneValid(telefono: string): boolean {
    const phoneRegex = /^[0-9]{10}$/;
    return phoneRegex.test(telefono);
  }
  
  // Función para verificar si un campo no está vacío
  isNotEmpty(value: string): boolean {
    return value.trim().length > 0;
  }

  //Obtener estados al iniciar
  getEstados(): void{
    this.isLoading = true;
    this.http.get<any>('https://gaia.inegi.org.mx/wscatgeo/v2/mgee/').subscribe(response => {
      this.estados = response.datos;
      this.isLoading = false;
    }, error =>{
      console.error('Error al obtener los estados', error);
      this.isLoading = false;
    })
  }
  //obtener municipios al seleccionar estado
  onEstadoChange(cvegeo: string): void{
    this.isLoading = true;
    if(cvegeo){
      this.http.get<any>(`https://gaia.inegi.org.mx/wscatgeo/v2/mgem/${cvegeo}`).subscribe(response => {
        this.municipios = response.datos
        this.isLoading = false;
      }, error =>{
        console.error('Error al obtener los municipios', error);
        this.isLoading = false;
      })
    }else{
      this.municipios = [];
    }
  }
  //obtener localidades al seleccionar municipio
  onMunicipioChange(cvegeo: string): void{
    this.isLoading = true;
    if(cvegeo){
      this.http.get<any>(`https://gaia.inegi.org.mx/wscatgeo/v2/localidades/${cvegeo}`).subscribe(response => {
        this.localidades = response.datos
        this.isLoading = false;
      }, error =>{
        console.error('Error al obtener los municipios', error);
        this.isLoading = false;
      })
    }else{
      this.localidades = [];
      this.isLoading = false;
    }
  }
  
  //insertar usuario
  finishRegister() {
    if(this.isForm1Valid() && this.isForm2Valid() && this.isForm3Valid() && this.isForm4Valid()){
      // Encuentra los nombres correspondientes al cvegeo seleccionado
      const estadoNombre = this.estados.find(e => e.cvegeo === this.estado)?.nomgeo || '';
      const municipioNombre = this.municipios.find(m => m.cvegeo === this.municipio)?.nomgeo || '';
      const localidadNombre = this.localidades.find(l => l.cvegeo === this.localidad)?.nomgeo || '';

      const userData ={
        nombre: this.nombre,
        apellido: this.apellidos,
        email: this.correo,
        contrasena: this.confirmPass,
        fecha_nacimiento: this.fechaNacimiento,
        telefono: this.telefono,
        estado: estadoNombre,
        municipio: municipioNombre,
        localidad: localidadNombre,
        habilidades: '',
        descripcion: '',
        imagen_perfil: '',
      };

      this.isLoading = true;
      // Hacer el POST directamente en el componente
      this.http.post('https://malo-backend.onrender.com/api/Usuario/InsertarUsuario', userData)
        .subscribe({
          next: (response) => {
            this.isLoading = false;
            console.log('Usuario registrado con éxito', response);
            this.currentStep++; // Avanzar al siguiente paso si el registro es exitoso
          },
          error: (error) => {
            this.isLoading = false;
            this.errorMessage = "¡Ups, El correo ya existe!";

            console.error('Error al registrar la empresa', error);
            this.clearMessages();
          }
        });
    }else{
      this.currentStep = 1;
    }
  }

  clearMessages(){
    setTimeout(() => {
      this.errorMessage = '';
    }, 3000)
  }

  goToSignIn(){
    this.router.navigate(['/auth/login']);
  }
}
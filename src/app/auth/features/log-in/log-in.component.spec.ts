import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientModule, HttpErrorResponse } from '@angular/common/http';
import { LogInComponent } from './log-in.component';
import { Router } from '@angular/router';
import { UserService } from '../../../core/services/user.service';
import { of, throwError } from 'rxjs';

describe('LogInComponent', () => {
  let component: LogInComponent;
  let fixture: ComponentFixture<LogInComponent>;
  let userService: jasmine.SpyObj<UserService>;
  let routerSpy: jasmine.SpyObj<Router>;

  // Función para establecer un token simulado en localStorage
  const setMockToken = () => {
    const mockToken = JSON.stringify({
      exp: Math.floor(Date.now() / 1000) + 3600 // Expira en 1 hora
    });
    localStorage.setItem('authToken', btoa(mockToken)); // Almacena el token simulado en localStorage
  };

  // Configuración de la prueba antes de cada test
  beforeEach(async () => {
    // Creamos espías para UserService y Router, con métodos mockeados
    const userServiceSpy = jasmine.createSpyObj('UserService', ['setAuthenticationState', 'getUserData']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [
        LogInComponent,
        HttpClientModule
      ],
      providers: [
        { provide: UserService, useValue: userServiceSpy }, 
        { provide: Router, useValue: routerSpy }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LogInComponent);
    component = fixture.componentInstance;
    userService = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;

    setMockToken(); // Establece el token simulado antes de cada prueba
    fixture.detectChanges(); // Detecta cambios en el componente
  });

  // Limpia el token después de cada prueba
  afterEach(() => {
    localStorage.removeItem('authToken');
  });

  // Prueba para verificar que el componente se crea correctamente
  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  // Prueba para verificar que no se puede iniciar sesión si el formulario es inválido
  it('should not login if form is invalid', () => {
    // Establece valores inválidos en los campos del formulario
    component.loginForm.controls['email'].setValue('');
    component.loginForm.controls['contrasena'].setValue('');
    component.onLogin(); // Llama a la función de login
    // Verifica que se muestra el mensaje de error adecuado
    expect(component.errorMessage).toBe('Por favor, completa el formulario correctamente.');
  });

  // Prueba para verificar el manejo de credenciales inválidas
  it('should display an error for invalid credentials', () => {
    // Establece valores inválidos para email y contraseña
    component.loginForm.controls['email'].setValue('test@example.com');
    component.loginForm.controls['contrasena'].setValue('wrongpassword');
    // Simula una respuesta de error de la API con código 401 (no autorizado)
    spyOn(component.http, 'post').and.returnValue(throwError(new HttpErrorResponse({ status: 401 })));
    
    component.onLogin(); // Llama a la función de login

    //expect(component.errorMessage).toBe('Credenciales incorrectas. Por favor, verifique su correo y contraseña.');

    // Verifica que el loader se detenga y que el mensaje de error se muestre correctamente
    expect(component.isLoading).toBeFalse();
    expect(component.errorMessage).toBe('Hubo un error. Intente de nuevo más tarde.');
  });

  // Prueba para verificar la redirección en caso de un inicio de sesión exitoso
  it('should navigate to user page on successful login', () => {
    // Establece valores válidos para email y contraseña
    component.loginForm.controls['email'].setValue('user@example.com');
    component.loginForm.controls['contrasena'].setValue('password');
    userService.getUserData.and.returnValue({ rol: 'Usuario' }); // Simula que el rol del usuario es 'Usuario'
    // Simula una respuesta exitosa de la API con un token
    spyOn(component.http, 'post').and.returnValue(of({ result: true, token: 'testToken' }));

    component.onLogin(); // Llama a la función de login

    // Verifica que el token se almacene correctamente y que se navegue a la página correcta
    expect(localStorage.getItem('authToken')).toBe('testToken');
    expect(userService.setAuthenticationState).toHaveBeenCalledWith(true);
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/usuario']);
  });

  // Prueba para verificar la redirección a la página de empresa si el rol es 'Empresa'
  it('should navigate to company page if user role is Empresa', () => {
    // Establece valores válidos para email y contraseña
    component.loginForm.controls['email'].setValue('company@example.com');
    component.loginForm.controls['contrasena'].setValue('password');
    userService.getUserData.and.returnValue({ rol: 'Empresa' }); // Simula que el rol del usuario es 'Empresa'
    // Simula una respuesta exitosa de la API con un token
    spyOn(component.http, 'post').and.returnValue(of({ result: true, token: 'companyToken' }));

    component.onLogin(); // Llama a la función de login

    // Verifica que la navegación sea a la página de la empresa
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/empresa']);
  });

  // Prueba para verificar el comportamiento del modo de "Olvidé mi contraseña"
  it('should handle forgot password mode toggle correctly', () => {
    component.toggleForgotPassword(); // Activa el modo de 'Olvidé mi contraseña'
    expect(component.forgotPasswordMode).toBeTrue(); // Verifica que el modo esté activado
    expect(component.loginForm.get('contrasena')?.valid).toBeTrue(); // Verifica que la contraseña sea válida en este modo

    component.toggleForgotPassword(); // Desactiva el modo de 'Olvidé mi contraseña'
    expect(component.forgotPasswordMode).toBeFalse(); // Verifica que el modo esté desactivado
    expect(component.loginForm.get('contrasena')?.valid).toBeFalse(); // Verifica que la validación de la contraseña sea incorrecta
  });

  // Prueba para verificar que se pueda solicitar la recuperación de la contraseña si el correo es válido
  it('should request password recovery if email is valid', () => {
    component.loginForm.controls['email'].setValue('test@example.com');
    // Simula una respuesta exitosa de la API al solicitar recuperación de contraseña
    spyOn(component.http, 'post').and.returnValue(of({}));
    
    component.requestPasswordRecovery(); // Llama a la función de recuperación de contraseña

    // Verifica que el loader se detenga y que el mensaje de éxito se muestre
    expect(component.isLoading).toBeFalse();
    expect(component.successMessage).toBe('Correo de recuperación enviado exitosamente.');
  });

  // Prueba para verificar el manejo de errores en la solicitud de recuperación de contraseña
  it('should handle error on password recovery request', () => {
    component.loginForm.controls['email'].setValue('test@example.com');
    // Simula una respuesta de error de la API con código 500 (error interno del servidor)
    spyOn(component.http, 'post').and.returnValue(throwError(() => new HttpErrorResponse({ status: 500 })));

    component.requestPasswordRecovery(); // Llama a la función de recuperación de contraseña

    // Verifica que el loader se detenga y que el mensaje de error se muestre
    expect(component.isLoading).toBeFalse();
    expect(component.errorMessage).toBe('Error al enviar el correo de recuperación. Inténtelo más tarde.');
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { PerfilComponent } from './perfil.component';
import { UserService } from '../../../../core/services/user.service'; // Asegúrate de usar la ruta correcta

describe('PerfilComponent', () => {
  let component: PerfilComponent;
  let fixture: ComponentFixture<PerfilComponent>;
  let mockUserService: any;

  beforeEach(async () => {
    mockUserService = {
      getUserData: jasmine.createSpy('getUserData').and.returnValue({ sub: 'user123' }),
    };

    await TestBed.configureTestingModule({
      imports: [PerfilComponent, HttpClientTestingModule], // Importa el standalone component aquí
      providers: [
        { provide: UserService, useValue: mockUserService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PerfilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
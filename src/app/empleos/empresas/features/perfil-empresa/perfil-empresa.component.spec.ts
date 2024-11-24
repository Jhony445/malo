import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { PerfilEmpresaComponent } from './perfil-empresa.component';
import { PEmpresasService } from '../../../../core/services/pEmpresas.service';
import { of } from 'rxjs';

describe('PerfilEmpresaComponent', () => {
  let component: PerfilEmpresaComponent;
  let fixture: ComponentFixture<PerfilEmpresaComponent>;
  let mockPEmpresasService: any;

  beforeEach(async () => {
    // Mock para el servicio PEmpresasService
    mockPEmpresasService = {
      obtenerEmpresaPorId: jasmine.createSpy('obtenerEmpresaPorId').and.returnValue(of({})),
    };

    await TestBed.configureTestingModule({
      imports: [
        PerfilEmpresaComponent, // Aquí se incluye el componente standalone
        HttpClientTestingModule,
      ],
      providers: [
        { provide: PEmpresasService, useValue: mockPEmpresasService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PerfilEmpresaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
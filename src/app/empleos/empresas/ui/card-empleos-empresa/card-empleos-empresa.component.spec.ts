import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CardEmpleosEmpresaComponent } from './card-empleos-empresa.component';

describe('CardEmpleosEmpresaComponent', () => {
  let component: CardEmpleosEmpresaComponent;
  let fixture: ComponentFixture<CardEmpleosEmpresaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardEmpleosEmpresaComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(CardEmpleosEmpresaComponent);
    component = fixture.componentInstance;

    // Inicializar el valor de empleo con un objeto simulado
    component.empleo = { titulo: 'Ejemplo de Título', descripcion: 'Descripción de ejemplo' };

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

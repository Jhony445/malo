import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DetalleEmpleoEmpresaComponent } from './detalle-empleo-empresa.component';

describe('DetalleEmpleoEmpresaComponent', () => {
  let component: DetalleEmpleoEmpresaComponent;
  let fixture: ComponentFixture<DetalleEmpleoEmpresaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetalleEmpleoEmpresaComponent, HttpClientTestingModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetalleEmpleoEmpresaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

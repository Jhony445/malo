import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { EstadisticasEmpleosComponent } from './estadisticas-empleos.component';

describe('EstadisticasEmpleosComponent', () => {
  let component: EstadisticasEmpleosComponent;
  let fixture: ComponentFixture<EstadisticasEmpleosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EstadisticasEmpleosComponent,HttpClientTestingModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EstadisticasEmpleosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

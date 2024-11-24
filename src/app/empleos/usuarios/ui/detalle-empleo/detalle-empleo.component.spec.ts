import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DetalleEmpleoComponent } from './detalle-empleo.component';

describe('DetalleEmpleoComponent', () => {
  let component: DetalleEmpleoComponent;
  let fixture: ComponentFixture<DetalleEmpleoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetalleEmpleoComponent,HttpClientTestingModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetalleEmpleoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

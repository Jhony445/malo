import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MiPostulacionesComponent } from './mi-postulaciones.component';

describe('MiPostulacionesComponent', () => {
  let component: MiPostulacionesComponent;
  let fixture: ComponentFixture<MiPostulacionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MiPostulacionesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MiPostulacionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

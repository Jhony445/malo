import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CreacionEmpleoComponent } from './creacion-empleo.component';

describe('CreacionEmpleoComponent', () => {
  let component: CreacionEmpleoComponent;
  let fixture: ComponentFixture<CreacionEmpleoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreacionEmpleoComponent, HttpClientTestingModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreacionEmpleoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

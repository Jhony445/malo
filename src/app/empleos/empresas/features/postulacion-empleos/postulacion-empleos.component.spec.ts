import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostulacionEmpleosComponent } from './postulacion-empleos.component';

describe('PostulacionEmpleosComponent', () => {
  let component: PostulacionEmpleosComponent;
  let fixture: ComponentFixture<PostulacionEmpleosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PostulacionEmpleosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PostulacionEmpleosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

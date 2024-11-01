import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectRegisterComponent } from './select-register.component';

describe('SelectRegisterComponent', () => {
  let component: SelectRegisterComponent;
  let fixture: ComponentFixture<SelectRegisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectRegisterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

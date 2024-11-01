import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegisterCompanyComponent } from './register-company.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';


describe('RegisterCompanyComponent', () => {
  let component: RegisterCompanyComponent;
  let fixture: ComponentFixture<RegisterCompanyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterCompanyComponent, HttpClientTestingModule],
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisterCompanyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

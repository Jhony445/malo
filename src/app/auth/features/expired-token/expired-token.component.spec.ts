import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ExpiredTokenComponent } from './expired-token.component';

describe('ExpiredTokenComponent', () => {
  let component: ExpiredTokenComponent;
  let fixture: ComponentFixture<ExpiredTokenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExpiredTokenComponent, HttpClientTestingModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExpiredTokenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

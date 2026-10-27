import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TableDetails } from './table-details';

describe('TableDetails', () => {
  let component: TableDetails;
  let fixture: ComponentFixture<TableDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TableDetails],
    }).compileComponents();

    fixture = TestBed.createComponent(TableDetails);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

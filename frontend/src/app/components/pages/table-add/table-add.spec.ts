import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TableAdd } from './table-add';

describe('TableAdd', () => {
  let component: TableAdd;
  let fixture: ComponentFixture<TableAdd>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TableAdd],
    }).compileComponents();

    fixture = TestBed.createComponent(TableAdd);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

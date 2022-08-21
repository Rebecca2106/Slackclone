import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChannelEditDialogComponent } from './channel-edit-dialog.component';

describe('ChannelEditDialogComponent', () => {
  let component: ChannelEditDialogComponent;
  let fixture: ComponentFixture<ChannelEditDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChannelEditDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChannelEditDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

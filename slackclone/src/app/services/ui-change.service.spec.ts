import { TestBed } from '@angular/core/testing';

import { UiChangeService } from './ui-change.service';

describe('UiChangeService', () => {
  let service: UiChangeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UiChangeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

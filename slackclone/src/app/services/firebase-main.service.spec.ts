import { TestBed } from '@angular/core/testing';
import { FirebaseMainService } from 'src/app/services/firebase-main.service';

describe('FireauthService', () => {
  let service: FirebaseMainService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FirebaseMainService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
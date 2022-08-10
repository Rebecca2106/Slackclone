import { TestBed } from '@angular/core/testing';
import { FireauthService } from 'src/app/services/fireauth.service';

describe('FireauthService', () => {
  let service: FireauthService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FireauthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';
import { FirebaseChannelService } from 'src/app/services/firebase-channel.service';

describe('FireauthService', () => {
  let service: FirebaseChannelService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FirebaseChannelService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
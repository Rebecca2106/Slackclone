import { TestBed } from '@angular/core/testing';
import { FirebaseChannelChatThreadService } from 'src/app/services/firebase-channel-chat-thread.service';

describe('FireauthService', () => {
  let service: FirebaseChannelChatThreadService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FirebaseChannelChatThreadService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
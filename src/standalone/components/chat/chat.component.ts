import {
  AsyncPipe,
  DOCUMENT,
  NgClass,
  NgOptimizedImage,
} from '@angular/common';
import {
  Component,
  effect,
  ElementRef,
  HostListener,
  inject,
  Injector,
  OnInit,
  signal,
  viewChild,
} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatRipple } from '@angular/material/core';
import { MatTooltip } from '@angular/material/tooltip';
import { ChatService } from '@services/chat.service';
import { ignoreErrors } from '@utils/utils';
import PerfectScrollbar from 'perfect-scrollbar';
import {
  catchError,
  exhaustMap,
  filter,
  map,
  Subject,
  takeUntil,
  tap,
} from 'rxjs';
// import { AvatarVideoComponent } from '@/components/avatar-video/avatar-video.component'
import { CdkDrag, CdkDragHandle } from '@angular/cdk/drag-drop';
// import { slideFromBottom } from '@/animations/fade-in-slide'
import { FeedbackChat } from '@enums/feedback-chat';
import { ChatHistoryService } from '@services/chat-history.service';
// import { AvatarInterrupterBtnComponent } from '@/components/avatar-interrupter-btn/avatar-interrupter-btn.component'
import { OnDestroyMixin } from '@mixins/on-destroy-mixin';
import { RecorderComponent } from '@modules/administration/components/recorder/recorder.component';
import { LangService } from '@services/lang.service';
import { TextWriterAnimatorDirective } from '@standalone/directives/text-writer-animator.directive';
import { ChatMessageAnchorRedirectDirective } from '@standalone/directives/chat-message-anchor-redirect.directive';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [
    MatRipple,
    ReactiveFormsModule,
    TextWriterAnimatorDirective,
    NgClass,
    RecorderComponent,
    MatTooltip,
    // AvatarVideoComponent,
    CdkDrag,
    CdkDragHandle,
    // AvatarInterrupterBtnComponent,
    AsyncPipe,
    ChatMessageAnchorRedirectDirective,
    NgOptimizedImage,
  ],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss',
  // animations: [slideFromBottom],
})
export class ChatComponent extends OnDestroyMixin(class {}) implements OnInit {
  recorder = viewChild<RecorderComponent>('recorder');
  injector = inject(Injector);
  document = inject(DOCUMENT);
  lang = inject(LangService);
  chatService = inject(ChatService);
  chatHistoryService = inject(ChatHistoryService);
  status = this.chatService.status;
  chatContainer =
    viewChild.required<ElementRef<HTMLDivElement>>('chatContainer');
  chatBodyContainer = viewChild<ElementRef<HTMLDivElement>>('chatBody');
  messageInput =
    viewChild.required<ElementRef<HTMLTextAreaElement>>('textArea');
  fullscreenStatus = signal(false);
  answerInProgress = signal(false);
  animating = signal(false);
  stopAnimate = signal(false);
  ratingDone = signal(false);
  // botNames$ = this.chatHistoryService.getAllBotNames()
  declare scrollbarRef: PerfectScrollbar;
  feedbackOptions = FeedbackChat;
  // noinspection JSUnusedGlobalSymbols
  chatBodyContainerEffect = effect(() => {
    if (this.chatBodyContainer()) {
      this.scrollbarRef = new PerfectScrollbar(
        this.chatBodyContainer()!.nativeElement,
      );
    } else {
      this.scrollbarRef && this.scrollbarRef.destroy();
    }
  });
  // noinspection JSUnusedGlobalSymbols
  answerInProgressEffect = effect(() => {
    if (this.answerInProgress()) {
      this.messageCtrl.disable();
    } else {
      this.messageCtrl.enable();
    }
  });
  // noinspection JSUnusedGlobalSymbols
  animatingEffect = effect(() => {
    if (!this.animating()) {
      const elements =
        this.chatBodyContainer()?.nativeElement?.querySelectorAll(
          '.chat-message',
        );
      const last = elements && elements[elements.length - 1];

      last && last.scrollIntoView(true);
    }
  });
  // noinspection JSUnusedGlobalSymbols
  statusEffect = effect(() => {
    if (this.status()) {
      const timeoutID = setTimeout(() => {
        this.messageInput().nativeElement.focus();
        clearTimeout(timeoutID);
      });
    }
  });

  messageCtrl = new FormControl<string>('', { nonNullable: true });
  sendMessage$ = new Subject<void>();

  ngOnInit(): void {
    this.listenToSendMessage();
    // this.listenToBotNameChange()
    this.detectFullScreenMode();
  }

  onTextAnimating(event: boolean) {
    this.animating.set(event);
  }

  // listenToBotNameChange() {
  //   this.chatService.onBotNameChange().pipe(takeUntil(this.destroy$)).subscribe()
  // }

  toggleChat() {
    this.status.update(value => !value);
  }

  fullScreenToggle() {
    if (!this.fullscreenStatus()) {
      // this.chatContainer().nativeElement.classList.add('w-full', 'h-full');
      // this.chatContainer().nativeElement.classList.remove(
      //   'w-[500px]',
      //   'h-[600px]',
      // );
      // this.chatContainer().nativeElement.style.width = '100vw';
      // this.chatContainer().nativeElement.style.height = '100vh';
      this.fullscreenStatus.set(true);
      // this.chatContainer()
      // .nativeElement.requestFullscreen()
      // .then(() => this.fullscreenStatus.set(true));
    } else {
      // this.chatContainer().nativeElement.classList.remove('w-full', 'h-full');
      // this.chatContainer().nativeElement.classList.add(
      //   'w-[500px]',
      //   'h-[600px]',
      // );
      // this.chatContainer().nativeElement.style.width = '500px';
      // this.chatContainer().nativeElement.style.height = '600px';
      this.fullscreenStatus.set(false);
      // this.document
      //   .exitFullscreen()
      //   .then(() => this.fullscreenStatus.set(false));
    }
  }

  private listenToSendMessage() {
    return this.sendMessage$
      .pipe(takeUntil(this.destroy$))
      .pipe(filter(() => !!this.messageCtrl.value.trim()))
      .pipe(map(() => this.messageCtrl.value.trim()))
      .pipe(tap(() => this.stopAnimate.set(false)))
      .pipe(tap(() => this.messageCtrl.setValue('')))
      .pipe(tap(() => this.recorder()?.cleartext()))
      .pipe(tap(() => this.answerInProgress.set(true)))
      .pipe(tap(() => this.goToEndOfChat()))
      .pipe(
        exhaustMap(value =>
          this.chatService
            .sendMessage(value)
            .pipe(
              catchError(err => {
                this.answerInProgress.set(false);
                throw new Error(err);
              }),
            )
            .pipe(ignoreErrors()),
        ),
      )
      .subscribe(() => {
        this.answerInProgress.set(false);
        Promise.resolve().then(() => {
          this.messageInput()?.nativeElement?.focus();
          const timeoutID = setTimeout(() => {
            this.scrollToTop();
            clearInterval(timeoutID);
          }, 50);
        });
      });
  }

  scrollToTop(): void {
    const elements =
      this.chatBodyContainer()?.nativeElement?.querySelectorAll(
        '.chat-message',
      );
    const lastElement = elements && elements[elements.length - 1];
    const intervalID = setInterval(() => {
      lastElement && lastElement.scrollIntoView(true);
    }, 50);

    effect(
      onCleanup => {
        !this.animating() && intervalID && clearInterval(intervalID);
        onCleanup(() => {
          intervalID && clearInterval(intervalID);
        });
      },
      { injector: this.injector },
    );
  }

  private goToEndOfChat() {
    const timeoutID = setTimeout(() => {
      const elements =
        this.chatBodyContainer()?.nativeElement?.querySelectorAll(
          '.user-message',
        );
      elements && elements[elements.length - 1]?.scrollIntoView(true);
      clearTimeout(timeoutID);
    });
  }

  clearChatHistory() {
    this.chatService.messages.set([]);
    this.chatService.conversationId.set('');
    this.ratingDone.set(false);
  }

  @HostListener('window:fullscreenchange')
  detectFullScreenMode() {
    const isFullscreen = !!this.document.fullscreenElement;
    if (!isFullscreen) {
      this.fullscreenStatus.set(isFullscreen);
    }
  }

  rateConversation(feedback: FeedbackChat) {
    const conversationId = this.chatService.conversationId();
    this.chatHistoryService
      .addFeedback(conversationId, feedback)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.ratingDone.set(true);
      });
  }
}

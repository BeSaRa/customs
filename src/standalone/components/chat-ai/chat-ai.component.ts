import {
  Component,
  computed,
  effect,
  ElementRef,
  HostBinding,
  inject,
  OnInit,
  SecurityContext,
  signal,
  viewChild,
} from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { AppIcons } from '@constants/app-icons';
import { TextareaComponent } from '@standalone/components/textarea/textarea.component';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { IconButtonComponent } from '@standalone/components/icon-button/icon-button.component';
import { LangService } from '@services/lang.service';
import { MatTooltip } from '@angular/material/tooltip';
import { ChatMessageContract } from '@contracts/chat-message-contract';
import { ChatRoles } from '@enums/chat-roles';
import { ChatContext } from '@enums/chat-context';
import { NgClass } from '@angular/common';
import { ButtonComponent } from '@standalone/components/button/button.component';
import { ChatService } from '@services/chat.service';
import { ChatMessage } from '@models/chat-message';
import { takeUntil, tap } from 'rxjs/operators';
import { OnDestroyMixin } from '@mixins/on-destroy-mixin';
import { MatProgressBar } from '@angular/material/progress-bar';
import { interval } from 'rxjs';
import { LoadingComponent } from '@standalone/components/loading/loading.component';
import { EmployeeService } from '@services/employee.service';
import { DomSanitizer } from '@angular/platform-browser';
import { ChatMessageWrapper } from '@models/chat-message-wrapper';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-chat-ai',
  standalone: true,
  imports: [
    MatIcon,
    TextareaComponent,
    ReactiveFormsModule,
    IconButtonComponent,
    MatTooltip,
    NgClass,
    ButtonComponent,
    MatProgressBar,
    LoadingComponent,
  ],
  templateUrl: './chat-ai.component.html',
  styleUrl: './chat-ai.component.scss',
  animations: [
    trigger('openCloseChat', [
      transition(':enter', [
        style({
          width: 0,
          height: 0,
          opacity: 0,
        }),
        animate(
          100,
          style({
            width: '*',
            height: '*',
            opacity: 1,
          }),
        ),
      ]),
      transition(':leave', [
        animate(
          100,
          style({
            width: 0,
            height: 0,
            opacity: 0,
          }),
        ),
      ]),
    ]),
  ],
})
export class ChatAiComponent
  extends OnDestroyMixin(class {})
  implements OnInit
{
  protected readonly AppIcons = AppIcons;
  @HostBinding('class.opened')
  protected opened = false;
  @HostBinding('class.fullscreen')
  protected fullscreen = false;
  selectedContext = signal<ChatContext | undefined>(undefined);
  context = computed(() => {
    return !this.selectedContext()
      ? ''
      : this.selectedContext() === ChatContext.VIOLATIONS
        ? this.lang.map.violations_and_penalties
        : this.lang.map.customs_procedures;
  });
  protected control = new FormControl({
    value: '',
    disabled: !this.selectedContext(),
  });
  protected readonly ChatContext = ChatContext;
  lang = inject(LangService);
  messages = signal<ChatMessageContract[]>([]);
  chatService = inject(ChatService);
  private currentLang = signal(this.lang.getCurrent());
  chatBody = viewChild<ElementRef<HTMLDivElement>>('chatBody');
  textAreaInput = viewChild(TextareaComponent, {
    read: ElementRef,
  });

  userMessages = computed(() => {
    return this.messages().filter(item => item.role === ChatRoles.USER);
  });

  loading = signal(false);

  loadingEffect = effect(() => {
    this.loading()
      ? this.control.disable()
      : !!this.selectedContext() && this.control.enable();
  });

  scrollTop = signal(0);

  dots: string[] = ['.', '.', '.'];

  contextMap = {
    [ChatContext.VIOLATIONS]: this.lang.map.violations_and_penalties,
    [ChatContext.CUSTOMS_PROCEDURES]: this.lang.map.customs_procedures,
  };

  interval$ = interval(500)
    .pipe(
      tap(() => {
        this.dots.length >= 3 ? (this.dots = []) : this.dots.push('.');
      }),
    )
    .pipe(takeUntil(this.destroy$))
    .subscribe();
  employee = inject(EmployeeService);
  domSanitizer = inject(DomSanitizer);
  welcomeMessage = computed(() => {
    this.currentLang();
    return this.domSanitizer.sanitize(
      SecurityContext.HTML,
      this.lang.map.chat_welcome_x_message.change({
        x: this.employee.getEmployee()?.getNames(),
      }),
    );
  });

  ngOnInit(): void {
    this.lang.change$.subscribe(lang => {
      this.currentLang.set(lang);
    });
  }

  toggleChat() {
    this.opened = !this.opened;
  }

  sendMessage($event: Event) {
    $event.stopPropagation();
    $event.preventDefault();
    const messageWrapper = new ChatMessageWrapper().clone<ChatMessageWrapper>({
      context: this.selectedContext()!,
      messages: [
        new ChatMessage().clone<ChatMessage>({
          role: ChatRoles.USER,
          content: this.control.value!,
        }),
      ],
    });
    this.control.value &&
      this.updateMessages(messageWrapper.messages[0]) &&
      (() => {
        this.loading.set(true);
        return true;
      })() &&
      this.chatService
        .send(messageWrapper)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: message => {
            this.updateMessages(message);
            this.loading.set(false);
          },
          error: () => this.loading.set(false),
          complete: () => this.loading.set(false),
        });
  }

  updateMessages(message: ChatMessage): boolean {
    this.messages.update(messages => [...messages, message]);
    this.control.setValue('');
    setTimeout(() => {
      this.chatBody()?.nativeElement.scrollTo({
        top: this.chatBody()?.nativeElement.scrollHeight,
        behavior: 'smooth',
      });
    });
    return true;
  }

  toggleFullScreen() {
    this.fullscreen = !this.fullscreen;
  }

  isUser(message: ChatMessageContract) {
    return message.role === ChatRoles.USER;
  }

  isAssistant(message: ChatMessageContract) {
    return message.role === ChatRoles.ASSISTANT;
  }

  setContextTo(context: ChatContext) {
    this.selectedContext.set(context);
    this.control.enable();
    this.textAreaInput()?.nativeElement.querySelector('textarea').focus();
    this.messages.update(messages => [
      ...messages,
      {
        context,
        role: ChatRoles.ASSISTANT,
        content: this.lang.map.x_context_selected_successfully.change({
          x: this.contextMap[context],
        }),
      },
    ]);
  }

  getLatestUserMessage() {
    this.userMessages().length &&
      (() => {
        this.control.setValue(
          this.userMessages()[this.userMessages().length - 1].content,
        );
      })();
  }

  scrolling($event: Event) {
    this.scrollTop.set(($event.target as HTMLDivElement).scrollTop);
  }

  clearChat() {
    this.messages.set([]);
  }
}

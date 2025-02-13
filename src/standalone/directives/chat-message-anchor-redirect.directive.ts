import {
  Directive,
  ElementRef,
  inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { AzureAdminService } from '@services/azure-admin.service';

@Directive({
  selector: '[appChatMessageAnchorRedirect]',
  standalone: true,
})
export class ChatMessageAnchorRedirectDirective implements OnInit, OnDestroy {
  elementRef: ElementRef<HTMLElement> = inject(ElementRef);
  azureAdminService = inject(AzureAdminService);

  ngOnInit(): void {
    this.elementRef.nativeElement.addEventListener('click', this._onClick);
  }

  ngOnDestroy(): void {
    this.elementRef.nativeElement.removeEventListener('click', this._onClick);
  }

  private _onClick = (event: MouseEvent) => {
    if (
      event.target instanceof HTMLAnchorElement &&
      event.target.hasAttribute('chat-link')
    ) {
      event.preventDefault();
      this.azureAdminService
        .getSasToken((event as unknown as HTMLAnchorElement).href)
        .subscribe(res => {
          window.open(res, '_blank');
        });
    }
  };
}

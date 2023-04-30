import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { ButtonTypeContract } from '@contracts/button-type-contract';
import { AppIcons } from '@constants/app-icons';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonComponent {
  protected readonly AppIcons = AppIcons;
  @Input()
  disabled = false;
  @Input()
  inProgress = false;
  @Input()
  size: 'md' | 'sm' | 'lg' = 'md';
  @Input()
  buttonType: keyof ButtonTypeContract = 'primary';

  clickEvent($event: MouseEvent) {
    this.disabled && $event.stopPropagation();
  }
}

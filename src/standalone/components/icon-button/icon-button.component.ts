import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { AppIcons, AppIconsType } from '@constants/app-icons';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { coerceBooleanProperty } from '@angular/cdk/coercion';

@Component({
  selector: 'app-icon-button',
  standalone: true,
  imports: [MatIconModule, MatButtonModule],
  templateUrl: './icon-button.component.html',
  styleUrls: ['./icon-button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IconButtonComponent {
  @Input()
  icon: keyof AppIconsType = 'RELOAD';
  _disabled = false;
  @Input()
  color = '';
  @Input()
  bgColor = 'bg-transparent';
  @Input()
  set disabled(value: boolean | unknown) {
    this._disabled = coerceBooleanProperty(value);
  }

  get disabled(): boolean {
    return this._disabled;
  }

  clicked($event: MouseEvent) {
    if (this.disabled) {
      $event.preventDefault();
      $event.stopPropagation();
    }
  }

  get selectedIcon() {
    return AppIcons[this.icon];
  }
}

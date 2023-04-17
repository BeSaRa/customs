import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { InputComponent } from '@standalone/components/input/input.component';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, InputComponent],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent {
  @Output()
  menuClick = new EventEmitter<MouseEvent | undefined>();

  menuClicked($event?: MouseEvent) {
    this.menuClick.emit($event);
  }
}

import { Component } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { InputComponent } from '@standalone/components/input/input.component';
import { MatIconModule } from '@angular/material/icon';
import { InputPrefixDirective } from '@standalone/directives/input-prefix.directive';
import { InputSuffixDirective } from '@standalone/directives/input-suffix.directive';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    InputComponent,
    MatIconModule,
    InputPrefixDirective,
    InputSuffixDirective,
    NgOptimizedImage,
  ],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScreenSizeComponent } from './components/screen-size/screen-size.component';

@NgModule({
  declarations: [ScreenSizeComponent],
  imports: [CommonModule],
  exports: [ScreenSizeComponent],
})
export class SharedModule {}

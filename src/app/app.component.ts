import { Component, inject, OnInit } from '@angular/core';
import { DialogService } from '@services/dialog.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  dialog = inject(DialogService);

  ngOnInit(): void {
    this.dialog
      .error('Please Select One of the below Items First', 'Delete Content')
      .afterClosed()
      .subscribe((value) => {
        console.log(value);
      });
  }
}

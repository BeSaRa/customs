import {
  Component,
  EventEmitter,
  inject,
  InputSignal,
  OnInit,
} from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Offender } from '@models/offender';
import { Investigation } from '@models/investigation';

@Component({
  selector: 'app-single-decision-popup',
  standalone: true,
  imports: [],
  templateUrl: './single-decision-popup.component.html',
  styleUrl: './single-decision-popup.component.scss',
})
export class SingleDecisionPopupComponent implements OnInit {
  data = inject<{
    offender: Offender;
    model: InputSignal<Investigation>;
    updateModel: InputSignal<EventEmitter<void>>;
  }>(MAT_DIALOG_DATA);

  ngOnInit(): void {
    console.log(this.data);
  }
}

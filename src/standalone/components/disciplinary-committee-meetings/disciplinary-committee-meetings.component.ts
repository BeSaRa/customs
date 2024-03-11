import { Component, inject, input, OnInit } from '@angular/core';
import { LangService } from '@services/lang.service';
import { LookupService } from '@services/lookup.service';
import { Investigation } from '@models/investigation';
import { DialogService } from '@services/dialog.service';
import { MeetingService } from '@services/meeting.service';
import { BehaviorSubject, switchMap } from 'rxjs';
import { Meeting } from '@models/meeting';

@Component({
  selector: 'app-disciplinary-committee-meetings',
  standalone: true,
  imports: [],
  templateUrl: './disciplinary-committee-meetings.component.html',
  styleUrl: './disciplinary-committee-meetings.component.scss',
})
export class DisciplinaryCommitteeMeetingsComponent implements OnInit {
  lang = inject(LangService);
  lookupService = inject(LookupService);
  meetingService = inject(MeetingService);
  model = input.required<Investigation>();
  dialog = inject(DialogService);
  reload$: BehaviorSubject<null> = new BehaviorSubject<null>(null);
  dataList: Meeting[] = [];
  ngOnInit(): void {
    this._listenToReload();
  }
  _listenToReload() {
    this.reload$
      .pipe(
        switchMap(() => {
          return this.meetingService.load(undefined, {
            caseId: this.model().id,
          });
        }),
      )
      .subscribe(res => {
        this.dataList = res.rs;
      });
  }
}

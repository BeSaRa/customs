import { BaseCrudWithDialogService } from '@abstracts/base-crud-with-dialog-service';
import { ComponentType } from '@angular/cdk/portal';
import { Injectable } from '@angular/core';
import { Constructor } from '@app-types/constructors';
import { AssignmentToAttend } from '@models/assignment-to-attend';
import { AssignmentToAttendPopupComponent } from '@standalone/components/assignment-to-attend-popup/assignment-to-attend-popup.component';

@Injectable({
  providedIn: 'root',
})
export class AssignmentToAttendService extends BaseCrudWithDialogService<
  AssignmentToAttendPopupComponent,
  AssignmentToAttend
> {
  serviceName = 'AssignmentToAttendService';

  protected getModelClass(): Constructor<AssignmentToAttend> {
    return AssignmentToAttend;
  }

  protected getModelInstance(): AssignmentToAttend {
    return new AssignmentToAttend();
  }

  getDialogComponent(): ComponentType<AssignmentToAttendPopupComponent> {
    return AssignmentToAttendPopupComponent;
  }

  getUrlSegment(): string {
    return this.urlService.URLS.INVESTIGATION;
  }

  assignToAttend(criteria: { caseId: string }) {
    return this.http.post<AssignmentToAttend>(
      `${this.getUrlSegment()}/${criteria.caseId}/obligation-to-attend`,
      {
        ...criteria,
      }
    );
  }
}

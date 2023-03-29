import { Injectable } from '@angular/core';
import { InternalUser } from '@models/internal-user';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  employee?: InternalUser;
  permissionSet?: unknown[];
}

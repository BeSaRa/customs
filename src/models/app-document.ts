import { AdminResult } from '@models/admin-result';
import { Data } from '@angular/router';

export abstract class AppDocument {
  declare id: string;
  declare createdBy: string;
  declare createdOn: string | Date;
  declare lastModified: string | Date;
  declare lastModifier: string;
  declare classDescription: string;
  declare creatorInfo: AdminResult;
  declare ouInfo: AdminResult;
  declare mimeType: string;
  declare documentTitle: string;
  declare contentSize: number;
  declare minorVersionNumber: number;
  declare majorVersionNumber: number;
  declare vsId: string;
  declare versionStatus: number;
  declare isCurrent: boolean;
  declare lockTimeout: string | Data | null;
  declare lockOwner: string;
  declare arName: string;
  declare enName: string;
  declare isExportable: boolean;
}

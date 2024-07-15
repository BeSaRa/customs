import {
  Component,
  ElementRef,
  inject,
  input,
  OnChanges,
  output,
  viewChild,
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { GrowAnimation } from '@animations/grow-animation';
import { BlobModel } from '@models/blob-model';
import { ScanImage } from '@models/scan-image';
import { DialogService } from '@services/dialog.service';
import { LangService } from '@services/lang.service';
import { ViewAttachmentPopupComponent } from '@standalone/popups/view-attachment-popup/view-attachment-popup.component';
import { b64toBlob } from '@utils/utils';

@Component({
  selector: 'app-images-list',
  standalone: true,
  imports: [],
  templateUrl: './images-list.component.html',
  styleUrl: './images-list.component.scss',
  animations: [GrowAnimation],
})
export class ImagesListComponent implements OnChanges {
  images = input.required<ScanImage[]>();
  imageRemoved = output<string>();

  listElement = viewChild<ElementRef<HTMLDivElement>>('list');

  lang = inject(LangService);
  dialog = inject(DialogService);
  domSanitizer = inject(DomSanitizer);

  ngOnChanges(): void {
    this.listElement()?.nativeElement.scrollTo({
      behavior: 'smooth',
      left:
        (this.lang.getCurrent().direction === 'rtl' ? -1 : 1) *
        (this.listElement()?.nativeElement.scrollWidth ?? 0),
    });
  }

  removeImage(imageName: string, event: Event) {
    event.stopPropagation();
    this.imageRemoved.emit(imageName);
  }

  viewImage(img: ScanImage) {
    this.dialog.open(ViewAttachmentPopupComponent, {
      hasBackdrop: true,
      disableClose: true,
      data: {
        model: new BlobModel(
          b64toBlob(img.imageAsBase64, img.mimeType),
          this.domSanitizer,
        ),
        title: img.imageName,
      },
    });
  }
}

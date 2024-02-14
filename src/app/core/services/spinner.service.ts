import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { Injectable } from '@angular/core';
import { defer, NEVER } from 'rxjs';
import { finalize, share } from 'rxjs/operators';
// import { SpinnerDialogComponent } from 'src/app/modules/shared/dialogs/spinner-dialog/spinner-dialog.component';

@Injectable({
  providedIn: 'root',
})
export class SpinnerService {
  private overlayRef?: OverlayRef = undefined;

  constructor(private readonly overlay: Overlay) {}

  public readonly spinner$ = defer(() => {
    this.show();
    return NEVER.pipe(
      finalize(() => {
        this.hide();
      })
    );
  }).pipe(share());

  private show(): void {
    Promise.resolve(null).then(() => {
      this.overlayRef = this.overlay.create({
        positionStrategy: this.overlay
          .position()
          .global()
          .centerHorizontally()
          .centerVertically(),
        hasBackdrop: true,
      });
      console.log(this.overlayRef);
      //   this.overlayRef.attach(new ComponentPortal(SpinnerDialogComponent));
    });
  }

  private hide(): void {
    this.overlayRef?.detach();
    this.overlayRef = undefined;
  }
}

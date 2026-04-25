import {
  ChangeDetectionStrategy,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  signal,
} from '@angular/core';
import { SpinnerComponent } from '@tractor-store/ui';

@Component({
  selector: 'app-checkout-shell',
  imports: [SpinnerComponent],
  template: `
    @if (loaded()) {
      <mfe-checkout></mfe-checkout>
    } @else {
      <ts-spinner label="Loading checkout…" />
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class CheckoutShell {
  protected readonly loaded = signal(customElements.get('mfe-checkout') != null);

  constructor() {
    if (!this.loaded()) {
      customElements.whenDefined('mfe-checkout').then(() => this.loaded.set(true));
    }
  }
}

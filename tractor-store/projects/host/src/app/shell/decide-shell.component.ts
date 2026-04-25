import {
  ChangeDetectionStrategy,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  signal,
} from '@angular/core';
import { SpinnerComponent } from '@tractor-store/ui';

@Component({
  selector: 'app-decide-shell',
  imports: [SpinnerComponent],
  template: `
    @if (loaded()) {
      <mfe-decide></mfe-decide>
    } @else {
      <ts-spinner label="Loading product…" />
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class DecideShell {
  protected readonly loaded = signal(customElements.get('mfe-decide') != null);

  constructor() {
    if (!this.loaded()) {
      customElements.whenDefined('mfe-decide').then(() => this.loaded.set(true));
    }
  }
}

import {
  ChangeDetectionStrategy,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  signal,
} from '@angular/core';
import { SpinnerComponent } from '@tractor-store/ui';

@Component({
  selector: 'app-explore-shell',
  imports: [SpinnerComponent],
  template: `
    @if (loaded()) {
      <mfe-explore></mfe-explore>
    } @else {
      <ts-spinner label="Loading explore…" />
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ExploreShell {
  protected readonly loaded = signal(customElements.get('mfe-explore') != null);

  constructor() {
    if (!this.loaded()) {
      customElements.whenDefined('mfe-explore').then(() => this.loaded.set(true));
    }
  }
}

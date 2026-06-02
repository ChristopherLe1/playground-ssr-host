import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-home',
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: `
    :host {
      display: block;
      max-width: 42rem;
      margin-inline: auto;
    }
    h1 {
      font-size: 2rem;
      margin: 0 0 0.5rem;
    }
    p {
      color: #475569;
      line-height: 1.6;
    }
  `,
  template: `
    <h1>Native Federation + SSR Host</h1>
    <p>
      This host is a thin shell ready to load remote Angular applications over Native Federation.
      Add remote entries to <code>public/federation.manifest.json</code> and register their routes
      in <code>app.routes.ts</code> to mount federated features.
    </p>
  `,
})
export class Home {}

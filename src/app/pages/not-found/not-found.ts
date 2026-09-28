import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found',
  imports: [RouterLink],
  template: `
    <div class="nf">
      <h2>404</h2>
      <p>This page doesn't exist.</p>
      <a routerLink="/">Back to tasks</a>
    </div>
  `,
  styles: `.nf { text-align: center; padding: 60px 0; } h2 { font-size: 3rem; margin: 0; }`,
})
export class NotFound {}

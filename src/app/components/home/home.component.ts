import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [RouterLink],
  standalone: true,
  template: `
    <h1>Welcome Home!</h1>
    <p>This is a simple home component to test navigation.</p>
    <button routerLink="/tasks">Go to Tasks</button>
  `,
  styles: ``
})
export class HomeComponent {

}

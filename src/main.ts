import { bootstrapApplication } from '@angular/platform-browser';
import { Component } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { ProposalListComponent } from './app/components/proposal-list/proposal-list.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ProposalListComponent],
  template: '<app-proposal-list></app-proposal-list>'
})
export class App {}

bootstrapApplication(App, {
  providers: [
    provideHttpClient()
  ]
});
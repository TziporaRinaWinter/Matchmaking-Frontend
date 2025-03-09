import { Component, EventEmitter, Input, Output } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Proposal } from "../../models/proposal";

@Component({
  selector: "app-proposal-form",
  standalone: true,
  templateUrl: "./proposal-form.component.html",
  imports: [CommonModule, FormsModule],
  styles: [
    `
      :host {
        display: block;
        direction: rtl;
      }
    `,
  ],
})
export class ProposalFormComponent {
  @Input() proposal: Proposal = {
    name: "",
    yeshiva: "",
    shadchan: "",
    details: "",
    notes: "",
  };

  @Output() save = new EventEmitter<Proposal>();

  onSubmit(): void {
    this.save.emit({ ...this.proposal });
  }
}

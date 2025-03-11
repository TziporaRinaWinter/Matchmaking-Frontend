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
    documentFile: undefined,
    imageFile: undefined,
  };

  @Output() save = new EventEmitter<Proposal>();

  onSubmit(): void {
    this.save.emit({ ...this.proposal });
  }

  onFileChange(event: Event, type: "pdf" | "image"): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      if (type === "pdf") {
        this.proposal.documentFile = file;
      } else if (type === "image") {
        this.proposal.imageFile = file;
      }
    }
  }
}

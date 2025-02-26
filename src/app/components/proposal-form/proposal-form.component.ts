import { Component, EventEmitter, Input, Output } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Proposal } from "../../models/proposal";

@Component({
  selector: "app-proposal-form",
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <form
      (ngSubmit)="onSubmit()"
      #form="ngForm"
      class="p-4 bg-white rounded shadow"
    >
      <div class="mb-4">
        <label class="block mb-2">שם:</label>
        <input
          type="text"
          [(ngModel)]="proposal.name"
          name="name"
          required
          class="w-full p-2 border rounded"
          dir="rtl"
        />
      </div>
      <div class="mb-4">
        <label class="block mb-2">ישיבה:</label>
        <input
          type="text"
          [(ngModel)]="proposal.yeshiva"
          name="yeshiva"
          required
          class="w-full p-2 border rounded"
          dir="rtl"
        />
      </div>
      <div class="mb-4">
        <label class="block mb-2">שדכן:</label>
        <input
          type="text"
          [(ngModel)]="proposal.shadchan"
          name="shadchan"
          required
          class="w-full p-2 border rounded"
          dir="rtl"
        />
      </div>
      <div class="mb-4">
        <label class="block mb-2">פרטים:</label>
        <input
          type="text"
          [(ngModel)]="proposal.details"
          name="details"
          required
          class="w-full p-2 border rounded"
          dir="rtl"
        />
      </div>
      <div class="mb-4">
        <label class="block mb-2">הערות:</label>
        <textarea
          [(ngModel)]="proposal.notes"
          name="notes"
          class="w-full p-2 border rounded"
          dir="rtl"
        ></textarea>
      </div>
      <div class="flex justify-end">
        <button
          type="submit"
          class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          {{ proposal.id ? "עדכן" : "הוסף" }}
        </button>
      </div>
    </form>
  `,
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

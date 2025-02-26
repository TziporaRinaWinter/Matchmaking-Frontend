import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { ProposalService } from "../../services/proposal.service";
import { ProposalFormComponent } from "../proposal-form/proposal-form.component";
import { Proposal } from "../../models/proposal";

@Component({
  selector: "app-proposal-list",
  standalone: true,
  imports: [CommonModule, FormsModule, ProposalFormComponent],
  template: `
    <div class="container mx-auto p-4" dir="rtl">
      <h1 class="text-2xl font-bold mb-6 text-right">ניהול הצעות</h1>

      <div class="mb-6">
        <div class="relative">
          <input
            type="text"
            [(ngModel)]="searchTerm"
            placeholder="חיפוש לפי שם..."
            class="p-2 border rounded w-full"
            dir="rtl"
          />
          <span class="absolute left-3 top-2 text-gray-400"> 🔍 </span>
        </div>
      </div>

      <div class="mb-6">
        <button
          (click)="showForm = !showForm"
          class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
        >
          <span class="ml-2">+</span> הצעה חדשה
        </button>
      </div>

      <app-proposal-form
        *ngIf="showForm"
        [proposal]="selectedProposal"
        (save)="onSave($event)"
        class="mb-6"
      ></app-proposal-form>

      <div class="grid gap-4">
        <div
          *ngFor="let proposal of filteredProposals"
          class="bg-white p-4 rounded shadow hover:shadow-lg transition"
        >
          <div class="flex justify-between items-start mb-4">
            <h3 class="text-xl font-semibold">{{ proposal.name }}</h3>
            <div class="space-x-2 rtl:space-x-reverse">
              <button
                (click)="editProposal(proposal)"
                class="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition"
              >
                עריכה
              </button>
              <button
                (click)="deleteProposal(proposal.id!)"
                class="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
              >
                מחיקה
              </button>
            </div>
          </div>
          <div class="space-y-2">
            <p><strong>ישיבה:</strong> {{ proposal.yeshiva }}</p>
            <p><strong>שדכן:</strong> {{ proposal.shadchan }}</p>
            <p><strong>פרטים:</strong> {{ proposal.details }}</p>
            <p><strong>הערות:</strong> {{ proposal.notes }}</p>
          </div>
        </div>
      </div>

      <div
        *ngIf="filteredProposals?.length === 0"
        class="text-center py-8 text-gray-500"
      >
        לא נמצאו הצעות
      </div>
    </div>
  `,
})
export class ProposalListComponent implements OnInit {
  proposals: Proposal[] = [];
  selectedProposal: Proposal = {
    name: "",
    yeshiva: "",
    shadchan: "",
    details: "",
    notes: "",
  };
  showForm = false;
  searchTerm = "";

  constructor(private proposalService: ProposalService) {}

  ngOnInit(): void {
    this.proposalService.getProposals().subscribe((proposals) => {
      console.log("Received proposals:", proposals);
      this.proposals = proposals;
    });
  }

  get filteredProposals(): Proposal[] {
    return this.proposals?.filter((proposal) =>
      proposal.name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  onSave(proposal: Proposal): void {
    if (proposal.id) {
      this.proposalService.updateProposal(proposal);
    } else {
      this.proposalService.addProposal(proposal);
    }
    this.showForm = false;
    this.resetSelectedProposal();
  }

  editProposal(proposal: Proposal): void {
    this.selectedProposal = { ...proposal };
    this.showForm = true;
  }

  deleteProposal(id: number): void {
    if (confirm("האם אתה בטוח שברצונך למחוק הצעה זו?")) {
      this.proposalService.deleteProposal(id);
    }
  }

  private resetSelectedProposal(): void {
    this.selectedProposal = {
      name: "",
      yeshiva: "",
      shadchan: "",
      details: "",
      notes: "",
    };
  }
}

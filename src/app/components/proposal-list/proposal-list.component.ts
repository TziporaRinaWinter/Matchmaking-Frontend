import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { ProposalService } from "../../services/proposal.service";
import { ProposalFormComponent } from "../proposal-form/proposal-form.component";
import { Proposal } from "../../models/proposal";

@Component({
  selector: "app-proposal-list",
  standalone: true,
  templateUrl: "./proposal-list.component.html",
  imports: [CommonModule, FormsModule, ProposalFormComponent],
})
export class ProposalListComponent implements OnInit {
  proposals: Proposal[] = [];
  selectedProposal: Proposal = {
    name: "",
    yeshiva: "",
    shadchan: "",
    details: "",
    notes: "",
    documentFile: undefined,
    imageFile: undefined,
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
    if (proposal._id) {
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

  deleteProposal(id: string): void {
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
      documentFile: undefined,
      imageFile: undefined,
    };
  }
}

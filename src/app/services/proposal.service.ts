import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject, Observable } from "rxjs";
import { Proposal } from "../models/proposal";

@Injectable({
  providedIn: "root",
})
export class ProposalService {
  private proposals = new BehaviorSubject<Proposal[]>([]);
  private dataPath = "http://localhost:3000/proposals";

  constructor(private http: HttpClient) {
    this.loadProposals();
  }

  private loadProposals(): void {
    this.http.get<Proposal[]>(this.dataPath).subscribe((data) => {
      this.proposals.next(data);
    });
  }

  // get propsals
  getProposals(): Observable<Proposal[]> {
    return this.proposals.asObservable();
  }
  // add propsal
  addProposal(proposal: Proposal, files: File[]): void {
    const formData = new FormData();
    formData.append("name", proposal.name);
    formData.append("yeshiva", proposal.yeshiva);
    formData.append("shadchan", proposal.shadchan);
    formData.append("details", proposal.details);
    formData.append("notes", proposal.notes);
    formData.append("id", proposal.id.toString());

    // Add the files to FormData
    files.forEach((file) => {
      if (file.type.startsWith("image/")) {
        formData.append("image", file);
      } else if (file.type === "application/pdf") {
        formData.append("pdf", file);
      }
    });

    this.http.post(this.dataPath, formData).subscribe({
      next: (response) => {
        console.log("Proposal added successfully", response);
        this.loadProposals();
      },
      error: (error) => console.error("Error adding proposal:", error),
    });
  }

  // Update proposal
  updateProposal(proposal: Proposal): void {
    const currentProposals = this.proposals.value;
    const index = currentProposals.findIndex((p) => p.id === proposal.id);
    if (index !== -1) {
      currentProposals[index] = proposal;
      this.proposals.next([...currentProposals]);
      this.saveProposals();
    }
  }
  // delete proposal
  deleteProposal(id: string): void {
    const currentProposals = this.proposals.value;
    this.proposals.next(currentProposals.filter((p) => p.id !== id));
    this.saveProposals();
  }

  // Save proposal
  private saveProposals(): void {
    this.http.post(this.dataPath, this.proposals.value).subscribe({
      next: () => console.log(),
      error: (error) => console.error("Error saving proposals:", error),
    });
  }
}

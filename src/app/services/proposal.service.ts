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

  // add proposal
  addProposal(proposal: Proposal): void {
    const formData = new FormData();
    formData.append("name", proposal.name);
    formData.append("yeshiva", proposal.yeshiva);
    formData.append("shadchan", proposal.shadchan);
    formData.append("details", proposal.details);
    formData.append("notes", proposal.notes);

    // Add the files to FormData
    // files.forEach((file) => {
    //   if (file.type.startsWith("image/")) {
    //     formData.append("imageFile", file);
    //   } else if (file.type === "application/pdf") {
    //     formData.append("documentFile", file);
    //   }
    // });

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
    const formData = new FormData();
    formData.append("name", proposal.name);
    formData.append("yeshiva", proposal.yeshiva);
    formData.append("shadchan", proposal.shadchan);
    formData.append("details", proposal.details);
    formData.append("notes", proposal.notes);

    // Add the files to FormData if needed
    // files.forEach((file) => {
    //   if (file.type.startsWith("image/")) {
    //     formData.append("imageFile", file);
    //   } else if (file.type === "application/pdf") {
    //     formData.append("documentFile", file);
    //   }
    // });

    this.http.put(`${this.dataPath}/${proposal.id}`, formData).subscribe({
      next: () => {
        console.log("Proposal updated successfully");
        this.loadProposals();
      },
      error: (error) => console.error("Error updating proposal:", error),
    });
  }

  // Delete proposal
  deleteProposal(id: string): void {
    this.http.delete(`${this.dataPath}/${id}`).subscribe({
      next: () => {
        console.log("Proposal deleted successfully");
        this.loadProposals();
      },
      error: (error) => console.error("Error deleting proposal:", error),
    });
  }
}

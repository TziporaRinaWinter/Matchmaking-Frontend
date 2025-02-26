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

  getProposals(): Observable<Proposal[]> {
    return this.proposals.asObservable();
  }

  addProposal(proposal: Proposal): void {
    let currentProposals: Proposal[] = [];
    currentProposals = this.proposals.value;
    const newProposal = {
      ...proposal,
      id: this.generateId(currentProposals),
    };
    this.proposals.next([...currentProposals, newProposal]);
    this.saveProposals();
  }

  updateProposal(proposal: Proposal): void {
    const currentProposals = this.proposals.value;
    const index = currentProposals.findIndex((p) => p.id === proposal.id);
    if (index !== -1) {
      currentProposals[index] = proposal;
      this.proposals.next([...currentProposals]);
      this.saveProposals();
    }
  }

  deleteProposal(id: number): void {
    const currentProposals = this.proposals.value;
    this.proposals.next(currentProposals.filter((p) => p.id !== id));
    this.saveProposals();
  }

  private generateId(proposals: Proposal[] = []): number {
    return proposals.length > 0
      ? Math.max(...proposals.map((p) => p.id || 0)) + 1
      : 1;
  }

  private saveProposals(): void {
    this.http.post(this.dataPath, this.proposals.value).subscribe({
      next: () => console.log(),
      error: (error) => console.error("Error saving proposals:", error),
    });
  }
}

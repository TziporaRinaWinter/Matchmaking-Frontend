import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject, forkJoin, Observable, of } from "rxjs";
import { Proposal } from "../models/proposal";
import { catchError, map, switchMap } from "rxjs/operators";

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
      data.map((proposal: Proposal) => ({
        ...proposal,
        documentFile:
          proposal.documentFile && proposal._id
            ? {
                ...proposal.documentFile,
                data: this.getDocumentFile(proposal._id),
              }
            : null,
        imageFile:
          proposal.imageFile && proposal._id
            ? { ...proposal.imageFile, data: this.getImageFile(proposal._id) }
            : null,
      }));
      this.proposals.next(data);
    });
  }

  getProposals(): Observable<Proposal[]> {
    return this.proposals.asObservable();
  }

  addProposal(proposal: Proposal): void {
    const formData = new FormData();
    formData.append("name", proposal.name);
    formData.append("yeshiva", proposal.yeshiva);
    formData.append("shadchan", proposal.shadchan);
    formData.append("details", proposal.details);
    formData.append("notes", proposal.notes);

    if (proposal.documentFile) {
      formData.append("documentFile", proposal.documentFile);
    }
    if (proposal.imageFile) {
      formData.append("imageFile", proposal.imageFile);
    }

    this.http.post(this.dataPath, formData).subscribe({
      next: (response) => {
        console.log("Proposal added successfully", response);
        this.loadProposals();
      },
      error: (error) => console.error("Error adding proposal:", error),
    });
  }

  updateProposal(proposal: Proposal): void {
    const formData = new FormData();
    formData.append("name", proposal.name);
    formData.append("yeshiva", proposal.yeshiva);
    formData.append("shadchan", proposal.shadchan);
    formData.append("details", proposal.details);
    formData.append("notes", proposal.notes);

    if (proposal.documentFile) {
      formData.append("documentFile", proposal.documentFile);
    }
    if (proposal.imageFile) {
      formData.append("imageFile", proposal.imageFile);
    }

    this.http.put(`${this.dataPath}/${proposal._id}`, formData).subscribe({
      next: () => {
        console.log("Proposal updated successfully");
        this.loadProposals();
      },
      error: (error) => console.error("Error updating proposal:", error),
    });
  }

  deleteProposal(id: string): void {
    this.http.delete(`${this.dataPath}/${id}`).subscribe({
      next: () => {
        console.log("Proposal deleted successfully");
        this.loadProposals();
      },
      error: (error) => console.error("Error deleting proposal:", error),
    });
  }

  getProposalById(id: string): Observable<Proposal | null> {
    return this.http.get<Proposal>(`${this.dataPath}/${id}`).pipe(
      switchMap((proposal: Proposal) => {
        const documentFile$ =
          proposal.documentFile && proposal._id
            ? this.getDocumentFile(proposal._id).pipe(
                map((data) => ({
                  ...proposal.documentFile,
                  data,
                }))
              )
            : of(null);

        const imageFile$ =
          proposal.imageFile && proposal._id
            ? this.getImageFile(proposal._id).pipe(
                map((data) => ({
                  ...proposal.imageFile,
                  data,
                }))
              )
            : of(null);

        return forkJoin([documentFile$, imageFile$]).pipe(
          map(([documentFile, imageFile]) => ({
            ...proposal,
            documentFile: documentFile || undefined,
            imageFile: imageFile || undefined,
          }))
        );
      }),
      catchError((error) => {
        console.error("Error fetching proposal:", error);
        return of(null); // החזרת null במקרה של שגיאה
      })
    );
  }

  getDocumentFile(id: string): Observable<Blob> {
    return this.http.get(`${this.dataPath}/${id}/document`, {
      responseType: "blob",
    });
  }

  getImageFile(id: string): Observable<Blob> {
    return this.http.get(`${this.dataPath}/${id}/image`, {
      responseType: "blob",
    });
  }
}

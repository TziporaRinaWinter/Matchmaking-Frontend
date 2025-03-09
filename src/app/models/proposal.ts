export interface Proposal {
  _id?: string;
  name: string;
  yeshiva: string;
  shadchan: string;
  details: string;
  notes: string;
  documentFile?: File;
  imageFile?: File;
  documentUrl?: string;
  imageUrl?: string;
}

export interface Role {
  _id: string;
  name: string;
  modules: any[]; // refine later if structure is known
  createdAt: string;
  updatedAt: string;
}
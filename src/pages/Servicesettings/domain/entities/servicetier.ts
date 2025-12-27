export interface ServiceTier {
  _id: string;
  code: string;
  displayName: string;
  description: string;
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
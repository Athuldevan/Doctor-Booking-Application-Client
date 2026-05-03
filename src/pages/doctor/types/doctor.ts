export interface IDoctor {
  _id: string;
  user: {
    name: string;
    email: string;
    phone: string;
  };
  specialization: string;
  experience: number;
  consultationFee: number;
  education: string;
  bio: string;
  createdAt?: string;
  updatedAt?: string;
  isVerified: boolean;
  isDeleted: boolean;
}

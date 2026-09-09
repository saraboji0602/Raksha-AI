export type UserRole = 
  | 'DDMA_OFFICER' 
  | 'SDMA_DIRECTOR' 
  | 'FIELD_OFFICER' 
  | 'PLANNING_OFFICER' 
  | 'SYSTEM_ADMIN';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  designation: string;
  jurisdictionDistrict: string;
  jurisdictionState: string;
  avatarUrl: string;
  badgeNumber: string;
}

export type LanguageCode = 'en' | 'ta' | 'hi';

export interface SystemScoringWeights {
  hazardWeight: number; // default 30
  exposureWeight: number; // default 20
  vulnerabilityWeight: number; // default 20
  infrastructureWeight: number; // default 10
  historicalWeight: number; // default 10
  resilienceWeight: number; // default 10
}

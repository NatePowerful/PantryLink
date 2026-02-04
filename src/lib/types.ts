export type FoodItemStatus =
  | 'received'
  | 'inspected'
  | 'stored'
  | 'allocated'
  | 'picked_up'
  | 'expired'
  | 'trashed';

export type FoodItem = {
  id: string;
  name: string;
  category: string;
  weight: number; // in kg
  condition: 'fresh' | 'frozen' | 'dry' | 'packaged';
  expirationDate: string; // ISO string
  storageTemp: string; // e.g., 'ambient', 'refrigerated', 'frozen'
  allergens: string[];
  dietaryTags: string[];
  pickupLocation: {
    latitude: number;
    longitude: number;
    address: string;
  };
  status: FoodItemStatus;
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
  donorId: string;
  recipientId?: string;
  claimToken: string;
};

export type Recipient = {
  id: string;
  name: string;
  type: 'individual' | 'family' | 'organization';
  contact: string;
  address: string;
  location: {
    latitude: number;
    longitude: number;
  };
  needs: {
    dietaryRestrictions: string[];
    familySize?: number;
    urgency: 'low' | 'medium' | 'high';
  };
};

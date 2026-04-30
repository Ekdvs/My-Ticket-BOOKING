export interface AppEvent {
  id: string;
  title: string;
  category: string;
  subCategory?: string;
  venue?: string;
  location?: string;
  price: number;
  eventDateTime: string;
  active: boolean;

  // 🔥 add these because EventCard expects them
  totalTickets?: number;
  availableTickets?: number;
  imageUrls?: string[];
  organizerId?: string;
}
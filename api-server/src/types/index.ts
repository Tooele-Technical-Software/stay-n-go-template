export interface User {
  id: string;
  email: string;
  name: string;
  created_at: Date;
}

export interface UserRow extends User {
  password_hash: string;
}

export interface Listing {
  id: string;
  host_id: string;
  title: string;
  description: string;
  city: string;
  country: string;
  price_per_night: string;
  max_guests: number;
  bedrooms: number;
  bathrooms: number;
  category: string;
  listing_type: string;
  address: string | null;
  address_line_2: string | null;
  zip_code: string | null;
  home_type: string | null;
  is_active: boolean;
  created_at: Date;
}

export interface ListingWithHost extends Listing {
  host_name: string;
}

export interface Booking {
  id: string;
  listing_id: string;
  guest_id: string;
  check_in: string;
  check_out: string;
  total_price: string;
  status: "pending" | "confirmed" | "cancelled";
  created_at: Date;
}

export interface BookingWithDetails extends Booking {
  listing_title: string;
  city: string;
  country: string;
  guest_name: string;
}

export interface AuthPayload {
  userId: string;
  email: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthPayload;
    }
  }
}

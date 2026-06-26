export interface Listing {
  id: string;
  host_id: string;
  title: string;
  description: string;
  city: string;
  country: string;
  address?: string | null;
  address_line_2?: string | null;
  zip_code?: string | null;
  home_type?: string | null;
  price_per_night: string;
  max_guests: number;
  bedrooms: number;
  bathrooms: number;
  category: string;
  listing_type?: string;
  is_active: boolean;
  created_at: string;
  host_name?: string;
}

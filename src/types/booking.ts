export interface Booking {
  id: string;
  listing_id: string;
  guest_id: string;
  check_in: string;
  check_out: string;
  total_price: string;
  status: "pending" | "confirmed" | "cancelled";
  created_at: string;
  listing_title: string;
  city: string;
  country: string;
  guest_name: string;
}

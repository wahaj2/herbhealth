// Store configuration — edit these values or wire to the settings table in Supabase
export const SHIPPING_FEE = 200; // PKR flat rate
export const FREE_SHIPPING_THRESHOLD = 3000; // PKR — free shipping above this subtotal

export const PAKISTAN_CITIES = [
  "Karachi",
  "Lahore",
  "Islamabad",
  "Rawalpindi",
  "Faisalabad",
  "Multan",
  "Peshawar",
  "Quetta",
  "Sialkot",
  "Gujranwala",
  "Hyderabad",
  "Abbottabad",
  "Bahawalpur",
  "Sargodha",
  "Sukkur",
  "Other",
] as const;

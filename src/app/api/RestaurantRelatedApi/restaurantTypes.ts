

export interface RestaurantItem {
  itemid: string;
  itemname: string;
  itemdescription: string | null;
  baseprice: number;
  discount: number | null;
  rating: number | null;
  availablestatus: boolean;
  createdat: string | null;
  updatedat: string | null;
  itemImages: string[] | null;
  category: string | null;
  restaurantname: string | null; // Added
}

export interface Restaurant {
  restaurantid: string;
  restaurantownerid: string;
  restaurantname: string;
  restaurantlocation: string;
  starttiming: string | null;
  endtiming: string | null;
  rating: number;
  createdat: string;
  updatedat: string;
  restaurantImage: string | null;
  restaurantitems: RestaurantItem[];
}
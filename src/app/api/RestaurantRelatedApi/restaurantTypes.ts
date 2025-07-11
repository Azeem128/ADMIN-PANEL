// export interface RestaurantItem {
//     itemid: string;
//     restaurantid: string;
//     itemname: string;
//     itemdescription: string;
//     baseprice: number;
//     discount: number;
//     available: boolean;
//     status: string;
//     rating: number;
//     createdat: string;
//     updatedat: string;
//     itemsImage: string;
//     itemImages: string[];
//   }
  
//   export interface FoodItem {
//     id: string;
//     name: string;
//     category: string;
//     price: string;
//     available: boolean;
//     imgSrc: string;
//   }
  
//   export interface FoodDetail {
//     id: string;
//     name: string;
//     category: string;
//     price: string;
//     available: boolean;
//     imgSrc: string;
//     ingredients: string;
//     nutrition: string;
//   }




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
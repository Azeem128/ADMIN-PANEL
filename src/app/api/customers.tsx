
import { supabase } from "../../lib/supabaseClient";

// Interface for Customer data
interface Customer {
  customerid: string;
  name?: string;
  email?: string;
  createdat?: string;
  [key: string]: unknown; 
}

// Type for customer updates (partial customer fields)
type CustomerUpdates = Partial<Pick<Customer, 'name' | 'email' >>;

// Interface for API response
interface ApiResponse<T> {
  data: T | null;
  error: string | null;
}

export async function getAllCustomers(): Promise<ApiResponse<Customer[]>> {
  try {
    const { data, error } = await supabase
      .from("customers")
      .select("*"); // Fetch all columns

    if (error) {
      throw error;
    }
    console.log(data);

    return { data, error: null };
  } catch (error: Error) {
    console.error("Error fetching customers:", error.message);
    return { data: null, error: error.message };
  }
}

export async function getCustomerById(id: string): Promise<ApiResponse<Customer>> {
  const { data, error } = await supabase
    .from("customers")
    .select("*")
    .eq("customerid", id)
    .single();

  return { data, error: error ? error.message : null };
}

export async function updateCustomer(customerId: string, updates: CustomerUpdates): Promise<ApiResponse<Customer>> {
  const { data, error } = await supabase
    .from("customers")
    .update(updates)
    .eq("customerid", customerId)
    .select()
    .single();

  console.log(data);

  return { data, error: error ? error.message : null };
}
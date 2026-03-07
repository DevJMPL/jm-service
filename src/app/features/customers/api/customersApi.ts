import { supabase } from "@/shared/lib/supabase/client"

export type CustomerStatus = "active" | "inactive" | "prospect"

export interface Customer {
  id: string
  name: string
  email: string | null
  phone: string | null
  company: string | null
  status: CustomerStatus
  created_by: string
  created_at: string
  updated_at: string
}

export interface CreateCustomerInput {
  name: string
  email?: string
  phone?: string
  company?: string
  status?: CustomerStatus
  created_by: string
}

export interface UpdateCustomerInput {
  name?: string
  email?: string | null
  phone?: string | null
  company?: string | null
  status?: CustomerStatus
}

export async function listCustomers() {
  return supabase
    .from("customers")
    .select("*")
    .order("created_at", { ascending: false })
}

export async function createCustomer(input: CreateCustomerInput) {
  return supabase
    .from("customers")
    .insert({
      name: input.name,
      email: input.email ?? null,
      phone: input.phone ?? null,
      company: input.company ?? null,
      status: input.status ?? "active",
      created_by: input.created_by,
    })
    .select("*")
    .single()
}

export async function updateCustomer(id: string, input: UpdateCustomerInput) {
  return supabase
    .from("customers")
    .update({
      name: input.name,
      email: input.email ?? null,
      phone: input.phone ?? null,
      company: input.company ?? null,
      status: input.status,
    })
    .eq("id", id)
    .select("*")
    .single()
}

export async function setCustomerStatus(id: string, status: CustomerStatus) {
  return supabase
    .from("customers")
    .update({ status })
    .eq("id", id)
    .select("*")
    .single()
}

export async function getCustomerById(id: string) {
  return supabase
    .from("customers")
    .select("*")
    .eq("id", id)
    .single()
}
import { supabase } from "@/shared/lib/supabase/client"

export type CaseStatus = "open" | "review" | "escalated" | "resolved" | "closed"
export type CasePriority = "low" | "medium" | "high" | "critical"

export interface CaseItem {
  id: string
  case_number: string
  customer_id: string
  ticket_id: string | null
  title: string
  description: string | null
  status: CaseStatus
  priority: CasePriority
  owner_id: string | null
  created_by: string
  created_at: string
  updated_at: string
}

export interface CreateCaseInput {
  case_number: string
  customer_id: string
  ticket_id?: string | null
  title: string
  description?: string
  status?: CaseStatus
  priority?: CasePriority
  owner_id?: string | null
  created_by: string
}

export async function listCasesByCustomer(customerId: string) {
  return supabase
    .from("cases")
    .select("*")
    .eq("customer_id", customerId)
    .order("created_at", { ascending: false })
}

export async function createCase(input: CreateCaseInput) {
  return supabase
    .from("cases")
    .insert({
      case_number: input.case_number,
      customer_id: input.customer_id,
      ticket_id: input.ticket_id ?? null,
      title: input.title,
      description: input.description ?? null,
      status: input.status ?? "open",
      priority: input.priority ?? "medium",
      owner_id: input.owner_id ?? null,
      created_by: input.created_by,
    })
    .select("*")
    .single()
}
import { supabase } from "@/shared/lib/supabase/client"

export type TicketStatus = "open" | "in_progress" | "resolved" | "closed"
export type TicketPriority = "low" | "medium" | "high" | "critical"

export interface Ticket {
  id: string
  ticket_number: string
  customer_id: string
  subject: string
  description: string | null
  status: TicketStatus
  priority: TicketPriority
  created_by: string
  assigned_to: string | null
  created_at: string
  updated_at: string
}

export interface CreateTicketInput {
  ticket_number: string
  customer_id: string
  subject: string
  description?: string
  status?: TicketStatus
  priority?: TicketPriority
  created_by: string
  assigned_to?: string | null
}

export async function listTicketsByCustomer(customerId: string) {
  return supabase
    .from("tickets")
    .select("*")
    .eq("customer_id", customerId)
    .order("created_at", { ascending: false })
}

export async function createTicket(input: CreateTicketInput) {
  return supabase
    .from("tickets")
    .insert({
      ticket_number: input.ticket_number,
      customer_id: input.customer_id,
      subject: input.subject,
      description: input.description ?? null,
      status: input.status ?? "open",
      priority: input.priority ?? "medium",
      created_by: input.created_by,
      assigned_to: input.assigned_to ?? null,
    })
    .select("*")
    .single()
}
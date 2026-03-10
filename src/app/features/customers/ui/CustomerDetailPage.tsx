import { useEffect, useMemo, useState } from "react"
import type { ChangeEvent, FormEvent } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { motion } from "framer-motion"
import {
  ArrowLeft,
  Building2,
  CalendarDays,
  FileText,
  Loader2,
  Mail,
  MessageSquare,
  Phone,
  Plus,
  Ticket,
  UserRound,
  X,
} from "lucide-react"

import { useCurrentUser } from "@/app/features/auth/model/useCurrentUser"
import {
  getCustomerById,
  type Customer,
  type CustomerStatus,
} from "@/app/features/customers/api/customersApi"
import {
  createTicket,
  listTicketsByCustomer,
  type Ticket as TicketItem,
  type TicketPriority,
  type TicketStatus,
} from "@/app/features/tickets/api/ticketsApi"
import {
  createCase,
  listCasesByCustomer,
  type CaseItem,
  type CasePriority,
  type CaseStatus,
} from "@/app/features/cases/api/casesApi"
import { generateEntityCode } from "@/shared/lib/formatters/generateCode"
import { PageHeader } from "@/shared/ui/PageHeader"
import { SectionCard } from "@/shared/ui/SectionCard"
import { StatCard } from "@/shared/ui/StatCard"
import { Timeline, type TimelineItem } from "@/shared/ui/Timeline"
import { DataTable } from "@/shared/ui/DataTable"
import { Tabs } from "@/shared/ui/Tabs"

interface TicketFormState {
  subject: string
  description: string
  status: TicketStatus
  priority: TicketPriority
}

interface CaseFormState {
  title: string
  description: string
  status: CaseStatus
  priority: CasePriority
  ticket_id: string
}

const initialTicketForm: TicketFormState = {
  subject: "",
  description: "",
  status: "open",
  priority: "medium",
}

const initialCaseForm: CaseFormState = {
  title: "",
  description: "",
  status: "open",
  priority: "medium",
  ticket_id: "",
}

function getCustomerStatusLabel(status: CustomerStatus) {
  switch (status) {
    case "active":
      return "Activo"
    case "inactive":
      return "Inactivo"
    case "prospect":
      return "Prospecto"
    default:
      return status
  }
}

function getCustomerStatusClasses(status: CustomerStatus) {
  switch (status) {
    case "active":
      return "bg-[#eef8f1] text-[#3d8b5c]"
    case "inactive":
      return "bg-[#f5f6f8] text-[#6b7280]"
    case "prospect":
      return "bg-[#fff4e8] text-[#b7721d]"
    default:
      return "bg-[#eef5ff] text-[#2f80ed]"
  }
}

function getTicketStatusLabel(status: string) {
  switch (status) {
    case "open":
      return "Abierto"
    case "in_progress":
      return "En proceso"
    case "resolved":
      return "Resuelto"
    case "closed":
      return "Cerrado"
    default:
      return status
  }
}

function getCaseStatusLabel(status: string) {
  switch (status) {
    case "open":
      return "Abierto"
    case "review":
      return "En revisión"
    case "escalated":
      return "Escalado"
    case "resolved":
      return "Resuelto"
    case "closed":
      return "Cerrado"
    default:
      return status
  }
}

function getPriorityLabel(priority: string) {
  switch (priority) {
    case "low":
      return "Baja"
    case "medium":
      return "Media"
    case "high":
      return "Alta"
    case "critical":
      return "Crítica"
    default:
      return priority
  }
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("es-MX", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(value))
}

export function CustomerDetailPage() {
  const { customerId } = useParams()
  const navigate = useNavigate()
  const { userId } = useCurrentUser()

  const [customer, setCustomer] = useState<Customer | null>(null)
  const [tickets, setTickets] = useState<TicketItem[]>([])
  const [cases, setCases] = useState<CaseItem[]>([])
  const [loading, setLoading] = useState(true)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("summary")

  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false)
  const [isCaseModalOpen, setIsCaseModalOpen] = useState(false)
  const [ticketSubmitting, setTicketSubmitting] = useState(false)
  const [caseSubmitting, setCaseSubmitting] = useState(false)
  const [ticketForm, setTicketForm] = useState<TicketFormState>(initialTicketForm)
  const [caseForm, setCaseForm] = useState<CaseFormState>(initialCaseForm)

  useEffect(() => {
    const loadWorkspace = async () => {
      if (!customerId) {
        setErrorMsg("No se encontró el identificador del cliente.")
        setLoading(false)
        return
      }

      setLoading(true)
      setErrorMsg(null)

      const [customerResult, ticketsResult, casesResult] = await Promise.all([
        getCustomerById(customerId),
        listTicketsByCustomer(customerId),
        listCasesByCustomer(customerId),
      ])

      if (customerResult.error || !customerResult.data) {
        setErrorMsg("No fue posible cargar el detalle del cliente.")
        setCustomer(null)
        setTickets([])
        setCases([])
        setLoading(false)
        return
      }

      setCustomer(customerResult.data)
      setTickets(ticketsResult.data ?? [])
      setCases(casesResult.data ?? [])
      setLoading(false)
    }

    void loadWorkspace()
  }, [customerId])

  const activity: TimelineItem[] = useMemo(() => {
    const ticketItems: TimelineItem[] = tickets.map((ticket) => ({
      id: `ticket-${ticket.id}`,
      icon: <Ticket className="h-3 w-3" />,
      title: `Ticket ${ticket.ticket_number}`,
      description: ticket.subject,
      date: ticket.created_at,
    }))

    const caseItems: TimelineItem[] = cases.map((caseItem) => ({
      id: `case-${caseItem.id}`,
      icon: <FileText className="h-3 w-3" />,
      title: `Caso ${caseItem.case_number}`,
      description: caseItem.title,
      date: caseItem.created_at,
    }))

    return [...ticketItems, ...caseItems]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .map((item) => ({
        ...item,
        date: formatDate(item.date),
      }))
  }, [tickets, cases])

  const handleTicketInputChange =
    (field: keyof TicketFormState) =>
    (
      e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement> | ChangeEvent<HTMLSelectElement>
    ) => {
      const value = e.target.value
      setTicketForm((prev) => ({ ...prev, [field]: value }))
    }

  const handleCaseInputChange =
    (field: keyof CaseFormState) =>
    (
      e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement> | ChangeEvent<HTMLSelectElement>
    ) => {
      const value = e.target.value
      setCaseForm((prev) => ({ ...prev, [field]: value }))
    }

  const handleCreateTicket = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!customerId || !userId) {
      setErrorMsg("No se pudo identificar el cliente o el usuario actual.")
      return
    }

    if (!ticketForm.subject.trim()) {
      setErrorMsg("El asunto del ticket es obligatorio.")
      return
    }

    setTicketSubmitting(true)
    setErrorMsg(null)

    const { data, error } = await createTicket({
      ticket_number: generateEntityCode("TIC"),
      customer_id: customerId,
      subject: ticketForm.subject.trim(),
      description: ticketForm.description.trim() || undefined,
      status: ticketForm.status,
      priority: ticketForm.priority,
      created_by: userId,
    })

    if (error) {
      setErrorMsg("No fue posible crear el ticket.")
      setTicketSubmitting(false)
      return
    }

    setTickets((prev) => [data, ...prev])
    setTicketSubmitting(false)
    setIsTicketModalOpen(false)
    setTicketForm(initialTicketForm)
    setActiveTab("tickets")
  }

  const handleCreateCase = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!customerId || !userId) {
      setErrorMsg("No se pudo identificar el cliente o el usuario actual.")
      return
    }

    if (!caseForm.title.trim()) {
      setErrorMsg("El título del caso es obligatorio.")
      return
    }

    setCaseSubmitting(true)
    setErrorMsg(null)

    const { data, error } = await createCase({
      case_number: generateEntityCode("CAS"),
      customer_id: customerId,
      ticket_id: caseForm.ticket_id || null,
      title: caseForm.title.trim(),
      description: caseForm.description.trim() || undefined,
      status: caseForm.status,
      priority: caseForm.priority,
      created_by: userId,
    })

    if (error) {
      setErrorMsg("No fue posible crear el caso.")
      setCaseSubmitting(false)
      return
    }

    setCases((prev) => [data, ...prev])
    setCaseSubmitting(false)
    setIsCaseModalOpen(false)
    setCaseForm(initialCaseForm)
    setActiveTab("cases")
  }

  return (
    <>
      <PageHeader
        title={customer ? customer.name : "Detalle del cliente"}
        description="Consulta la información general del cliente y su contexto dentro de Reach Service."
        actions={
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => navigate("/customers")}
              className="inline-flex items-center gap-2 rounded-full border border-[#e7edf5] bg-white px-4 py-2 text-sm font-medium text-[#5e6676] transition hover:bg-[#f9fbfd]"
            >
              <ArrowLeft className="h-4 w-4" />
              Volver a clientes
            </button>

            <button
              onClick={() => setIsTicketModalOpen(true)}
              className="inline-flex items-center gap-2 rounded-full bg-[#2f80ed] px-4 py-2 text-sm font-medium text-white shadow-[0_10px_24px_rgba(47,128,237,0.22)] transition hover:bg-[#2274e2]"
            >
              <Plus className="h-4 w-4" />
              Nuevo ticket
            </button>

            <button
              onClick={() => setIsCaseModalOpen(true)}
              className="inline-flex items-center gap-2 rounded-full border border-[#d8e6fb] bg-[#eef5ff] px-4 py-2 text-sm font-medium text-[#2f80ed] transition hover:bg-[#e8f1ff]"
            >
              <Plus className="h-4 w-4" />
              Nuevo caso
            </button>
          </div>
        }
      />

      <div className="space-y-6">
        {loading ? (
          <div className="flex items-center justify-center py-20 text-[#8f95a3]">
            <Loader2 className="mr-3 h-5 w-5 animate-spin" />
            Cargando detalle del cliente...
          </div>
        ) : errorMsg && !customer ? (
          <div className="rounded-[24px] border border-[#f5d4d4] bg-[#fff6f6] px-6 py-6">
            <p className="text-base font-medium text-[#c65d5d]">{errorMsg}</p>
            <Link
              to="/customers"
              className="mt-4 inline-flex rounded-full border border-[#e7edf5] bg-white px-4 py-2 text-sm font-medium text-[#5e6676] transition hover:bg-[#f9fbfd]"
            >
              Regresar
            </Link>
          </div>
        ) : customer ? (
          <>
            <div className="grid gap-5 md:grid-cols-3">
              <StatCard
                title="Estatus"
                value={getCustomerStatusLabel(customer.status)}
                icon={<UserRound className="h-5 w-5" />}
              />
              <StatCard
                title="Tickets"
                value={String(tickets.length)}
                icon={<Ticket className="h-5 w-5" />}
              />
              <StatCard
                title="Casos"
                value={String(cases.length)}
                icon={<FileText className="h-5 w-5" />}
              />
            </div>

            <Tabs
              activeKey={activeTab}
              onChange={setActiveTab}
              items={[
                { key: "summary", label: "Resumen", icon: <UserRound className="h-4 w-4" /> },
                { key: "tickets", label: "Tickets", icon: <Ticket className="h-4 w-4" /> },
                { key: "cases", label: "Casos", icon: <FileText className="h-4 w-4" /> },
                { key: "activity", label: "Actividad", icon: <MessageSquare className="h-4 w-4" /> },
              ]}
            />

            {errorMsg && (
              <div className="rounded-[20px] border border-[#f5d4d4] bg-[#fff6f6] px-5 py-4 text-sm text-[#c65d5d]">
                {errorMsg}
              </div>
            )}

            {activeTab === "summary" && (
              <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
                <SectionCard
                  title="Información general"
                  description="Datos principales registrados para este cliente."
                >
                  <div className="grid gap-5 md:grid-cols-2">
                    <InfoItem icon={<UserRound className="h-4 w-4" />} label="Nombre" value={customer.name} />
                    <InfoItem icon={<Mail className="h-4 w-4" />} label="Correo electrónico" value={customer.email || "No registrado"} />
                    <InfoItem icon={<Phone className="h-4 w-4" />} label="Teléfono" value={customer.phone || "No registrado"} />
                    <InfoItem icon={<Building2 className="h-4 w-4" />} label="Empresa" value={customer.company || "No registrada"} />
                  </div>
                </SectionCard>

                <SectionCard title="Resumen" description="Vista rápida del contexto actual del cliente.">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25 }}
                    className="space-y-4"
                  >
                    <div className="rounded-[22px] bg-[#f8fafc] px-4 py-4">
                      <p className="text-sm text-[#8f95a3]">Estatus actual</p>
                      <div className="mt-2">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-medium ${getCustomerStatusClasses(
                            customer.status
                          )}`}
                        >
                          {getCustomerStatusLabel(customer.status)}
                        </span>
                      </div>
                    </div>

                    <div className="rounded-[22px] bg-[#f8fafc] px-4 py-4">
                      <p className="text-sm text-[#8f95a3]">Fecha de creación</p>
                      <p className="mt-2 text-sm font-medium text-[#252733]">
                        {formatDate(customer.created_at)}
                      </p>
                    </div>

                    <div className="rounded-[22px] bg-[#f8fafc] px-4 py-4">
                      <p className="text-sm text-[#8f95a3]">Última actualización</p>
                      <p className="mt-2 text-sm font-medium text-[#252733]">
                        {formatDate(customer.updated_at)}
                      </p>
                    </div>
                  </motion.div>
                </SectionCard>
              </div>
            )}

            {activeTab === "tickets" && (
              <SectionCard
                title="Tickets del cliente"
                description="Solicitudes e incidencias relacionadas con este cliente."
                action={
                  <button
                    onClick={() => setIsTicketModalOpen(true)}
                    className="inline-flex items-center gap-2 rounded-full bg-[#2f80ed] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#2274e2]"
                  >
                    <Plus className="h-4 w-4" />
                    Nuevo ticket
                  </button>
                }
              >
                {tickets.length === 0 ? (
                  <EmptyState message="Este cliente aún no tiene tickets registrados." />
                ) : (
                  <DataTable
                    columns={[
                      {
                        key: "ticket_number",
                        header: "Ticket",
                        render: (row) => (
                          <span className="font-medium text-[#252733]">{row.ticket_number}</span>
                        ),
                      },
                      { key: "subject", header: "Asunto" },
                      {
                        key: "status",
                        header: "Estatus",
                        render: (row) => (
                          <span className="rounded-full bg-[#eef5ff] px-3 py-1 text-xs font-medium text-[#2f80ed]">
                            {getTicketStatusLabel(row.status)}
                          </span>
                        ),
                      },
                      {
                        key: "priority",
                        header: "Prioridad",
                        render: (row) => (
                          <span className="rounded-full bg-[#fff4e8] px-3 py-1 text-xs font-medium text-[#b7721d]">
                            {getPriorityLabel(row.priority)}
                          </span>
                        ),
                      },
                    ]}
                    rows={tickets}
                    getRowKey={(row) => row.id}
                  />
                )}
              </SectionCard>
            )}

            {activeTab === "cases" && (
              <SectionCard
                title="Casos del cliente"
                description="Procesos o seguimientos relacionados con este cliente."
                action={
                  <button
                    onClick={() => setIsCaseModalOpen(true)}
                    className="inline-flex items-center gap-2 rounded-full bg-[#2f80ed] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#2274e2]"
                  >
                    <Plus className="h-4 w-4" />
                    Nuevo caso
                  </button>
                }
              >
                {cases.length === 0 ? (
                  <EmptyState message="Este cliente aún no tiene casos registrados." />
                ) : (
                  <DataTable
                    columns={[
                      {
                        key: "case_number",
                        header: "Caso",
                        render: (row) => (
                          <span className="font-medium text-[#252733]">{row.case_number}</span>
                        ),
                      },
                      { key: "title", header: "Título" },
                      {
                        key: "status",
                        header: "Estatus",
                        render: (row) => (
                          <span className="rounded-full bg-[#eef5ff] px-3 py-1 text-xs font-medium text-[#2f80ed]">
                            {getCaseStatusLabel(row.status)}
                          </span>
                        ),
                      },
                      {
                        key: "priority",
                        header: "Prioridad",
                        render: (row) => (
                          <span className="rounded-full bg-[#fff4e8] px-3 py-1 text-xs font-medium text-[#b7721d]">
                            {getPriorityLabel(row.priority)}
                          </span>
                        ),
                      },
                    ]}
                    rows={cases}
                    getRowKey={(row) => row.id}
                  />
                )}
              </SectionCard>
            )}

            {activeTab === "activity" && (
              <SectionCard
                title="Actividad del cliente"
                description="Historial de interacción del cliente dentro de Reach Service."
              >
                {activity.length === 0 ? (
                  <EmptyState message="No hay actividad registrada para este cliente." />
                ) : (
                  <Timeline items={activity} />
                )}
              </SectionCard>
            )}
          </>
        ) : null}
      </div>

      {isTicketModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#252733]/20 px-4 backdrop-blur-[2px]">
          <motion.div
            initial={{ opacity: 0, y: 18, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.2 }}
            className="w-full max-w-xl rounded-[30px] border border-[#eef2f7] bg-white p-6 shadow-[0_18px_60px_rgba(31,41,55,0.15)]"
          >
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold tracking-[-0.03em] text-[#252733]">
                  Nuevo ticket
                </h2>
                <p className="mt-1 text-sm text-[#8f95a3]">
                  Registra una nueva solicitud o incidencia para este cliente.
                </p>
              </div>

              <button
                onClick={() => {
                  if (!ticketSubmitting) {
                    setIsTicketModalOpen(false)
                    setTicketForm(initialTicketForm)
                  }
                }}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-[#eef2f7] bg-white text-[#6f7787] transition hover:bg-[#f9fbfd]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleCreateTicket} className="space-y-5">
              <Field label="Asunto">
                <input
                  type="text"
                  value={ticketForm.subject}
                  onChange={handleTicketInputChange("subject")}
                  placeholder="Asunto del ticket"
                  className="h-[50px] w-full rounded-[18px] border border-[#eef2f7] bg-[#f8fafc] px-4 text-sm text-[#252733] outline-none placeholder:text-[#a0a5b5] focus:border-[#d8e6fb] focus:bg-white"
                  required
                />
              </Field>

              <Field label="Descripción">
                <textarea
                  value={ticketForm.description}
                  onChange={handleTicketInputChange("description")}
                  placeholder="Describe el detalle del ticket"
                  rows={4}
                  className="w-full rounded-[18px] border border-[#eef2f7] bg-[#f8fafc] px-4 py-3 text-sm text-[#252733] outline-none placeholder:text-[#a0a5b5] focus:border-[#d8e6fb] focus:bg-white"
                />
              </Field>

              <div className="grid gap-5 md:grid-cols-2">
                <Field label="Estatus">
                  <select
                    value={ticketForm.status}
                    onChange={handleTicketInputChange("status")}
                    className="h-[50px] w-full rounded-[18px] border border-[#eef2f7] bg-[#f8fafc] px-4 text-sm text-[#252733] outline-none focus:border-[#d8e6fb] focus:bg-white"
                  >
                    <option value="open">Abierto</option>
                    <option value="in_progress">En proceso</option>
                    <option value="resolved">Resuelto</option>
                    <option value="closed">Cerrado</option>
                  </select>
                </Field>

                <Field label="Prioridad">
                  <select
                    value={ticketForm.priority}
                    onChange={handleTicketInputChange("priority")}
                    className="h-[50px] w-full rounded-[18px] border border-[#eef2f7] bg-[#f8fafc] px-4 text-sm text-[#252733] outline-none focus:border-[#d8e6fb] focus:bg-white"
                  >
                    <option value="low">Baja</option>
                    <option value="medium">Media</option>
                    <option value="high">Alta</option>
                    <option value="critical">Crítica</option>
                  </select>
                </Field>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    if (!ticketSubmitting) {
                      setIsTicketModalOpen(false)
                      setTicketForm(initialTicketForm)
                    }
                  }}
                  className="rounded-full border border-[#e7edf5] bg-white px-5 py-3 text-sm font-medium text-[#5e6676] transition hover:bg-[#f9fbfd]"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  disabled={ticketSubmitting}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-[#2f80ed] px-5 py-3 text-sm font-medium text-white shadow-[0_10px_24px_rgba(47,128,237,0.22)] transition hover:bg-[#2274e2] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {ticketSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
                  {ticketSubmitting ? "Guardando..." : "Guardar ticket"}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {isCaseModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#252733]/20 px-4 backdrop-blur-[2px]">
          <motion.div
            initial={{ opacity: 0, y: 18, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.2 }}
            className="w-full max-w-xl rounded-[30px] border border-[#eef2f7] bg-white p-6 shadow-[0_18px_60px_rgba(31,41,55,0.15)]"
          >
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold tracking-[-0.03em] text-[#252733]">
                  Nuevo caso
                </h2>
                <p className="mt-1 text-sm text-[#8f95a3]">
                  Registra un nuevo caso o seguimiento para este cliente.
                </p>
              </div>

              <button
                onClick={() => {
                  if (!caseSubmitting) {
                    setIsCaseModalOpen(false)
                    setCaseForm(initialCaseForm)
                  }
                }}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-[#eef2f7] bg-white text-[#6f7787] transition hover:bg-[#f9fbfd]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleCreateCase} className="space-y-5">
              <Field label="Título">
                <input
                  type="text"
                  value={caseForm.title}
                  onChange={handleCaseInputChange("title")}
                  placeholder="Título del caso"
                  className="h-[50px] w-full rounded-[18px] border border-[#eef2f7] bg-[#f8fafc] px-4 text-sm text-[#252733] outline-none placeholder:text-[#a0a5b5] focus:border-[#d8e6fb] focus:bg-white"
                  required
                />
              </Field>

              <Field label="Descripción">
                <textarea
                  value={caseForm.description}
                  onChange={handleCaseInputChange("description")}
                  placeholder="Describe el detalle del caso"
                  rows={4}
                  className="w-full rounded-[18px] border border-[#eef2f7] bg-[#f8fafc] px-4 py-3 text-sm text-[#252733] outline-none placeholder:text-[#a0a5b5] focus:border-[#d8e6fb] focus:bg-white"
                />
              </Field>

              <div className="grid gap-5 md:grid-cols-2">
                <Field label="Estatus">
                  <select
                    value={caseForm.status}
                    onChange={handleCaseInputChange("status")}
                    className="h-[50px] w-full rounded-[18px] border border-[#eef2f7] bg-[#f8fafc] px-4 text-sm text-[#252733] outline-none focus:border-[#d8e6fb] focus:bg-white"
                  >
                    <option value="open">Abierto</option>
                    <option value="review">En revisión</option>
                    <option value="escalated">Escalado</option>
                    <option value="resolved">Resuelto</option>
                    <option value="closed">Cerrado</option>
                  </select>
                </Field>

                <Field label="Prioridad">
                  <select
                    value={caseForm.priority}
                    onChange={handleCaseInputChange("priority")}
                    className="h-[50px] w-full rounded-[18px] border border-[#eef2f7] bg-[#f8fafc] px-4 text-sm text-[#252733] outline-none focus:border-[#d8e6fb] focus:bg-white"
                  >
                    <option value="low">Baja</option>
                    <option value="medium">Media</option>
                    <option value="high">Alta</option>
                    <option value="critical">Crítica</option>
                  </select>
                </Field>
              </div>

              <Field label="Ticket relacionado (opcional)">
                <select
                  value={caseForm.ticket_id}
                  onChange={handleCaseInputChange("ticket_id")}
                  className="h-[50px] w-full rounded-[18px] border border-[#eef2f7] bg-[#f8fafc] px-4 text-sm text-[#252733] outline-none focus:border-[#d8e6fb] focus:bg-white"
                >
                  <option value="">Sin ticket relacionado</option>
                  {tickets.map((ticket) => (
                    <option key={ticket.id} value={ticket.id}>
                      {ticket.ticket_number} - {ticket.subject}
                    </option>
                  ))}
                </select>
              </Field>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    if (!caseSubmitting) {
                      setIsCaseModalOpen(false)
                      setCaseForm(initialCaseForm)
                    }
                  }}
                  className="rounded-full border border-[#e7edf5] bg-white px-5 py-3 text-sm font-medium text-[#5e6676] transition hover:bg-[#f9fbfd]"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  disabled={caseSubmitting}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-[#2f80ed] px-5 py-3 text-sm font-medium text-white shadow-[0_10px_24px_rgba(47,128,237,0.22)] transition hover:bg-[#2274e2] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {caseSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
                  {caseSubmitting ? "Guardando..." : "Guardar caso"}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </>
  )
}

function InfoItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: string
}) {
  return (
    <div className="rounded-[22px] bg-[#f8fafc] px-4 py-4">
      <div className="mb-2 flex items-center gap-2 text-[#8f95a3]">
        {icon}
        <span className="text-sm">{label}</span>
      </div>
      <p className="text-sm font-medium text-[#252733]">{value}</p>
    </div>
  )
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="rounded-[24px] border border-dashed border-[#dbe3ee] bg-[#fbfcfe] px-6 py-14 text-center">
      <p className="text-sm text-[#8f95a3]">{message}</p>
    </div>
  )
}

function Field({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-[#8f95a3]">{label}</span>
      {children}
    </label>
  )
}
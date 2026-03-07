import { useEffect, useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import type { ChangeEvent, FormEvent } from "react"
import { motion } from "framer-motion"
import {
  Building2,
  Loader2,
  Pencil,
  Plus,
  Power,
  UserRoundSearch,
  Users,
  X,
} from "lucide-react"

import { AppLayout } from "@/app/layouts/AppLayout"
import { useCurrentUser } from "@/app/features/auth/model/useCurrentUser"
import {
  createCustomer,
  listCustomers,
  setCustomerStatus,
  updateCustomer,
  type Customer,
  type CustomerStatus,
} from "@/app/features/customers/api/customersApi"
import { PageToolbar } from "@/shared/ui/PageToolbar"
import { SectionCard } from "@/shared/ui/SectionCard"
import { StatCard } from "@/shared/ui/StatCard"
import { DataTable } from "@/shared/ui/DataTable"

interface CustomerFormState {
  name: string
  email: string
  phone: string
  company: string
  status: CustomerStatus
}

const initialForm: CustomerFormState = {
  name: "",
  email: "",
  phone: "",
  company: "",
  status: "active",
}

function getStatusLabel(status: CustomerStatus) {
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

function getStatusClasses(status: CustomerStatus) {
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

export function CustomersPage() {
  const { userId, loading: userLoading } = useCurrentUser()

  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [statusLoadingId, setStatusLoadingId] = useState<string | null>(null)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [search, setSearch] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null)
  const [form, setForm] = useState<CustomerFormState>(initialForm)
  const navigate = useNavigate()
  const loadCustomers = async () => {
    setLoading(true)
    setErrorMsg(null)

    const { data, error } = await listCustomers()

    if (error) {
      setErrorMsg("No fue posible cargar los clientes.")
      setCustomers([])
      setLoading(false)
      return
    }

    setCustomers(data ?? [])
    setLoading(false)
  }

  useEffect(() => {
    void loadCustomers()
  }, [])

  const filteredCustomers = useMemo(() => {
    const term = search.trim().toLowerCase()

    if (!term) return customers

    return customers.filter((customer) => {
      return (
        customer.name.toLowerCase().includes(term) ||
        (customer.email ?? "").toLowerCase().includes(term) ||
        (customer.company ?? "").toLowerCase().includes(term) ||
        (customer.phone ?? "").toLowerCase().includes(term)
      )
    })
  }, [customers, search])

  const activeCount = useMemo(
    () => customers.filter((customer) => customer.status === "active").length,
    [customers]
  )

  const businessCount = useMemo(
    () => customers.filter((customer) => !!customer.company?.trim()).length,
    [customers]
  )

  const prospectCount = useMemo(
    () => customers.filter((customer) => customer.status === "prospect").length,
    [customers]
  )

  const resetForm = () => {
    setForm(initialForm)
    setEditingCustomer(null)
  }

  const handleOpenCreateModal = () => {
    setErrorMsg(null)
    resetForm()
    setIsModalOpen(true)
  }

  const handleOpenEditModal = (customer: Customer) => {
    setErrorMsg(null)
    setEditingCustomer(customer)
    setForm({
      name: customer.name,
      email: customer.email ?? "",
      phone: customer.phone ?? "",
      company: customer.company ?? "",
      status: customer.status,
    })
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    if (submitting) return
    setIsModalOpen(false)
    resetForm()
  }

  const handleInputChange =
    (field: keyof CustomerFormState) =>
      (
        e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>
      ) => {
        const value = e.target.value
        setForm((prev) => ({ ...prev, [field]: value }))
      }

  const upsertCustomerInState = (customer: Customer) => {
    setCustomers((prev) => {
      const exists = prev.some((item) => item.id === customer.id)

      if (!exists) return [customer, ...prev]

      return prev.map((item) => (item.id === customer.id ? customer : item))
    })
  }

  const handleSubmitCustomer = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!form.name.trim()) {
      setErrorMsg("El nombre del cliente es obligatorio.")
      return
    }

    if (!editingCustomer && !userId) {
      setErrorMsg("No se pudo identificar al usuario actual.")
      return
    }

    setSubmitting(true)
    setErrorMsg(null)

    if (editingCustomer) {
      const { data, error } = await updateCustomer(editingCustomer.id, {
        name: form.name.trim(),
        email: form.email.trim() || null,
        phone: form.phone.trim() || null,
        company: form.company.trim() || null,
        status: form.status,
      })

      if (error) {
        setErrorMsg("No fue posible actualizar el cliente.")
        setSubmitting(false)
        return
      }

      upsertCustomerInState(data)
      setSubmitting(false)
      setIsModalOpen(false)
      resetForm()
      return
    }

    const { data, error } = await createCustomer({
      name: form.name.trim(),
      email: form.email.trim() || undefined,
      phone: form.phone.trim() || undefined,
      company: form.company.trim() || undefined,
      status: form.status,
      created_by: userId!,
    })

    if (error) {
      setErrorMsg("No fue posible crear el cliente.")
      setSubmitting(false)
      return
    }

    upsertCustomerInState(data)
    setSubmitting(false)
    setIsModalOpen(false)
    resetForm()
  }

  const handleToggleStatus = async (customer: Customer) => {
    const nextStatus: CustomerStatus =
      customer.status === "inactive" ? "active" : "inactive"

    setStatusLoadingId(customer.id)
    setErrorMsg(null)

    const { data, error } = await setCustomerStatus(customer.id, nextStatus)

    if (error) {
      setErrorMsg("No fue posible actualizar el estatus del cliente.")
      setStatusLoadingId(null)
      return
    }

    upsertCustomerInState(data)
    setStatusLoadingId(null)
  }

  return (
    <AppLayout
      title="Clientes"
      description="Administra la información de clientes, contactos y cuentas activas."
    >
      <div className="space-y-6">
        <PageToolbar
          searchPlaceholder="Buscar cliente..."
          searchValue={search}
          onSearchChange={(e) => setSearch(e.target.value)}
          rightAction={
            <button
              onClick={handleOpenCreateModal}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#2f80ed] px-5 py-3 text-sm font-medium text-white shadow-[0_10px_24px_rgba(47,128,237,0.22)] transition hover:bg-[#2274e2]"
            >
              <Plus className="h-4 w-4" />
              Nuevo cliente
            </button>
          }
        />

        <div className="grid gap-5 md:grid-cols-3">
          <StatCard
            title="Clientes activos"
            value={String(activeCount)}
            icon={<Users className="h-5 w-5" />}
          />
          <StatCard
            title="Cuentas empresariales"
            value={String(businessCount)}
            icon={<Building2 className="h-5 w-5" />}
          />
          <StatCard
            title="Prospectos"
            value={String(prospectCount)}
            icon={<UserRoundSearch className="h-5 w-5" />}
          />
        </div>

        <SectionCard
          title="Listado de clientes"
          description="Consulta y administra los registros creados en Reach Service."
        >
          {userLoading || loading ? (
            <div className="flex items-center justify-center py-16 text-[#8f95a3]">
              <Loader2 className="mr-3 h-5 w-5 animate-spin" />
              Cargando clientes...
            </div>
          ) : errorMsg && !isModalOpen ? (
            <div className="rounded-[20px] border border-[#f5d4d4] bg-[#fff6f6] px-5 py-4 text-sm text-[#c65d5d]">
              {errorMsg}
            </div>
          ) : filteredCustomers.length === 0 ? (
            <div className="rounded-[24px] border border-dashed border-[#dbe3ee] bg-[#fbfcfe] px-6 py-14 text-center">
              <p className="text-base font-medium text-[#252733]">
                No hay clientes registrados
              </p>
              <p className="mt-2 text-sm text-[#8f95a3]">
                Crea tu primer cliente para comenzar a gestionar tickets y casos.
              </p>
            </div>
          ) : (
            <DataTable
              columns={[
                {
                  key: "name",
                  header: "Cliente",
                  render: (row) => (
                    <button
                      onClick={() => navigate(`/customers/${row.id}`)}
                      className="font-medium text-[#252733] transition hover:text-[#2f80ed]"
                    >
                      {row.name}
                    </button>
                  ),
                },
                {
                  key: "email",
                  header: "Correo",
                  render: (row) => row.email || "—",
                },
                {
                  key: "phone",
                  header: "Teléfono",
                  render: (row) => row.phone || "—",
                },
                {
                  key: "company",
                  header: "Empresa",
                  render: (row) => row.company || "—",
                },
                {
                  key: "status",
                  header: "Estatus",
                  render: (row) => (
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusClasses(
                        row.status
                      )}`}
                    >
                      {getStatusLabel(row.status)}
                    </span>
                  ),
                },
                {
                  key: "actions",
                  header: "Acciones",
                  render: (row) => (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleOpenEditModal(row)}
                        className="inline-flex items-center gap-1 rounded-full border border-[#e7edf5] bg-white px-3 py-1.5 text-xs font-medium text-[#5e6676] transition hover:bg-[#f9fbfd]"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                        Editar
                      </button>

                      <button
                        onClick={() => handleToggleStatus(row)}
                        disabled={statusLoadingId === row.id}
                        className="inline-flex items-center gap-1 rounded-full border border-[#e7edf5] bg-white px-3 py-1.5 text-xs font-medium text-[#5e6676] transition hover:bg-[#f9fbfd] disabled:opacity-60"
                      >
                        {statusLoadingId === row.id ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <Power className="h-3.5 w-3.5" />
                        )}
                        {row.status === "inactive" ? "Activar" : "Desactivar"}
                      </button>
                    </div>
                  ),
                },
              ]}
              rows={filteredCustomers}
              getRowKey={(row) => row.id}
            />
          )}
        </SectionCard>
      </div>

      {isModalOpen && (
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
                  {editingCustomer ? "Editar cliente" : "Nuevo cliente"}
                </h2>
                <p className="mt-1 text-sm text-[#8f95a3]">
                  {editingCustomer
                    ? "Actualiza la información del cliente seleccionado."
                    : "Agrega un cliente para comenzar a registrar tickets y casos."}
                </p>
              </div>

              <button
                onClick={handleCloseModal}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-[#eef2f7] bg-white text-[#6f7787] transition hover:bg-[#f9fbfd]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSubmitCustomer} className="space-y-5">
              <div className="grid gap-5 md:grid-cols-2">
                <Field label="Nombre">
                  <input
                    type="text"
                    value={form.name}
                    onChange={handleInputChange("name")}
                    placeholder="Nombre del cliente"
                    className="h-[50px] w-full rounded-[18px] border border-[#eef2f7] bg-[#f8fafc] px-4 text-sm text-[#252733] outline-none placeholder:text-[#a0a5b5] focus:border-[#d8e6fb] focus:bg-white"
                    required
                  />
                </Field>

                <Field label="Correo electrónico">
                  <input
                    type="email"
                    value={form.email}
                    onChange={handleInputChange("email")}
                    placeholder="correo@empresa.com"
                    className="h-[50px] w-full rounded-[18px] border border-[#eef2f7] bg-[#f8fafc] px-4 text-sm text-[#252733] outline-none placeholder:text-[#a0a5b5] focus:border-[#d8e6fb] focus:bg-white"
                  />
                </Field>

                <Field label="Teléfono">
                  <input
                    type="text"
                    value={form.phone}
                    onChange={handleInputChange("phone")}
                    placeholder="Número telefónico"
                    className="h-[50px] w-full rounded-[18px] border border-[#eef2f7] bg-[#f8fafc] px-4 text-sm text-[#252733] outline-none placeholder:text-[#a0a5b5] focus:border-[#d8e6fb] focus:bg-white"
                  />
                </Field>

                <Field label="Empresa">
                  <input
                    type="text"
                    value={form.company}
                    onChange={handleInputChange("company")}
                    placeholder="Nombre de la empresa"
                    className="h-[50px] w-full rounded-[18px] border border-[#eef2f7] bg-[#f8fafc] px-4 text-sm text-[#252733] outline-none placeholder:text-[#a0a5b5] focus:border-[#d8e6fb] focus:bg-white"
                  />
                </Field>
              </div>

              <Field label="Estatus">
                <select
                  value={form.status}
                  onChange={handleInputChange("status")}
                  className="h-[50px] w-full rounded-[18px] border border-[#eef2f7] bg-[#f8fafc] px-4 text-sm text-[#252733] outline-none focus:border-[#d8e6fb] focus:bg-white"
                >
                  <option value="active">Activo</option>
                  <option value="inactive">Inactivo</option>
                  <option value="prospect">Prospecto</option>
                </select>
              </Field>

              {errorMsg && (
                <div className="rounded-[20px] border border-[#f5d4d4] bg-[#fff6f6] px-5 py-4 text-sm text-[#c65d5d]">
                  {errorMsg}
                </div>
              )}

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="rounded-full border border-[#e7edf5] bg-white px-5 py-3 text-sm font-medium text-[#5e6676] transition hover:bg-[#f9fbfd]"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  disabled={submitting || userLoading}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-[#2f80ed] px-5 py-3 text-sm font-medium text-white shadow-[0_10px_24px_rgba(47,128,237,0.22)] transition hover:bg-[#2274e2] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
                  {submitting
                    ? editingCustomer
                      ? "Guardando cambios..."
                      : "Guardando..."
                    : editingCustomer
                      ? "Actualizar cliente"
                      : "Guardar cliente"}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AppLayout>
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
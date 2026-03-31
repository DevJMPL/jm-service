import { supabase } from "@/shared/lib/supabase/client";

export type WorkspaceRole = "owner" | "admin" | "supervisor" | "agent";
export type WorkspaceInvitationRole = "admin" | "supervisor" | "agent";
export type WorkspaceInvitationStatus = "pending" | "accepted" | "revoked" | "expired";

export type Workspace = {
  id: string;
  name: string;
  slug: string;
  created_by: string;
  created_at: string;
  updated_at: string;
};

export type WorkspaceProfile = {
  id: string;
  full_name: string | null;
  email: string | null;
};

export type WorkspaceMember = {
  id: string;
  workspace_id: string;
  profile_id: string;
  role: WorkspaceRole;
  created_at: string;
  profile?: WorkspaceProfile | null;
};

export type WorkspaceInvitation = {
  id: string;
  workspace_id: string;
  email: string;
  role: WorkspaceInvitationRole;
  status: WorkspaceInvitationStatus;
  invited_by: string;
  token: string;
  expires_at: string | null;
  accepted_at: string | null;
  created_at: string;
};

export type MyWorkspaceItem = {
  membership_id: string;
  role: WorkspaceRole;
  workspace: Workspace;
};

type WorkspaceMemberRow = {
  id: string;
  workspace_id: string;
  profile_id: string;
  role: WorkspaceRole;
  created_at: string;
  profile: WorkspaceProfile[] | WorkspaceProfile | null;
};

function slugify(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function generateInviteToken(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  return `invite_${Date.now()}_${Math.random().toString(36).slice(2, 12)}`;
}

function normalizeProfile(
  profile: WorkspaceProfile[] | WorkspaceProfile | null,
): WorkspaceProfile | null {
  if (!profile) return null;
  if (Array.isArray(profile)) return profile[0] ?? null;
  return profile;
}

async function ensureUniqueSlug(baseName: string): Promise<string> {
  const baseSlug = slugify(baseName) || "workspace";

  const { data, error } = await supabase
    .from("workspaces")
    .select("slug")
    .ilike("slug", `${baseSlug}%`);

  if (error) {
    throw error;
  }

  if (!data || data.length === 0) {
    return baseSlug;
  }

  const existingSlugs = new Set(data.map((item) => item.slug));

  if (!existingSlugs.has(baseSlug)) {
    return baseSlug;
  }

  let counter = 2;
  let candidate = `${baseSlug}-${counter}`;

  while (existingSlugs.has(candidate)) {
    counter += 1;
    candidate = `${baseSlug}-${counter}`;
  }

  return candidate;
}

export async function createWorkspace(params: {
  name: string;
  createdBy: string;
}): Promise<Workspace> {
  const slug = await ensureUniqueSlug(params.name);

  const { data, error } = await supabase
    .from("workspaces")
    .insert({
      name: params.name.trim(),
      slug,
      created_by: params.createdBy,
    })
    .select("*")
    .single();

  if (error) {
    throw error;
  }

  return data as Workspace;
}

export async function updateWorkspace(params: {
  workspaceId: string;
  name: string;
}): Promise<Workspace> {
  const { data, error } = await supabase
    .from("workspaces")
    .update({
      name: params.name.trim(),
      updated_at: new Date().toISOString(),
    })
    .eq("id", params.workspaceId)
    .select("*")
    .single();

  if (error) {
    throw error;
  }

  return data as Workspace;
}

export async function createWorkspaceMember(params: {
  workspaceId: string;
  profileId: string;
  role: WorkspaceRole;
}): Promise<WorkspaceMember> {
  const { data, error } = await supabase
    .from("workspace_members")
    .insert({
      workspace_id: params.workspaceId,
      profile_id: params.profileId,
      role: params.role,
    })
    .select("*")
    .single();

  if (error) {
    throw error;
  }

  return {
    ...(data as Omit<WorkspaceMember, "profile">),
    profile: null,
  };
}

export async function getMyWorkspaces(profileId: string): Promise<MyWorkspaceItem[]> {
  const { data, error } = await supabase
    .from("workspace_members")
    .select(`
      id,
      role,
      workspace:workspaces (
        id,
        name,
        slug,
        created_by,
        created_at,
        updated_at
      )
    `)
    .eq("profile_id", profileId)
    .order("created_at", { ascending: true });

  if (error) {
    throw error;
  }

  return (data ?? []).map((item: any) => ({
    membership_id: item.id,
    role: item.role,
    workspace: item.workspace,
  }));
}

export async function getWorkspaceById(workspaceId: string): Promise<Workspace | null> {
  const { data, error } = await supabase
    .from("workspaces")
    .select("*")
    .eq("id", workspaceId)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return (data as Workspace | null) ?? null;
}

export async function getWorkspaceMembers(workspaceId: string): Promise<WorkspaceMember[]> {
  const { data, error } = await supabase
    .from("workspace_members")
    .select(`
      id,
      workspace_id,
      profile_id,
      role,
      created_at,
      profile:profiles (
        id,
        full_name,
        email
      )
    `)
    .eq("workspace_id", workspaceId)
    .order("created_at", { ascending: true });

  if (error) {
    throw error;
  }

  const rows = (data ?? []) as WorkspaceMemberRow[];

  return rows.map((row) => ({
    id: row.id,
    workspace_id: row.workspace_id,
    profile_id: row.profile_id,
    role: row.role,
    created_at: row.created_at,
    profile: normalizeProfile(row.profile),
  }));
}

export async function getWorkspaceInvitations(
  workspaceId: string,
): Promise<WorkspaceInvitation[]> {
  const { data, error } = await supabase
    .from("workspace_invitations")
    .select("*")
    .eq("workspace_id", workspaceId)
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return (data ?? []) as WorkspaceInvitation[];
}

export async function inviteWorkspaceMember(params: {
  workspaceId: string;
  email: string;
  role: WorkspaceInvitationRole;
  invitedBy: string;
}): Promise<WorkspaceInvitation> {
  const normalizedEmail = params.email.trim().toLowerCase();

  const { data: existingPending, error: existingError } = await supabase
    .from("workspace_invitations")
    .select("id")
    .eq("workspace_id", params.workspaceId)
    .eq("email", normalizedEmail)
    .eq("status", "pending")
    .maybeSingle();

  if (existingError) {
    throw existingError;
  }

  if (existingPending) {
    throw new Error("Ya existe una invitación pendiente para este correo.");
  }

  const { data, error } = await supabase
    .from("workspace_invitations")
    .insert({
      workspace_id: params.workspaceId,
      email: normalizedEmail,
      role: params.role,
      status: "pending",
      invited_by: params.invitedBy,
      token: generateInviteToken(),
    })
    .select("*")
    .single();

  if (error) {
    throw error;
  }

  return data as WorkspaceInvitation;
}

export async function revokeWorkspaceInvitation(invitationId: string): Promise<void> {
  const { error } = await supabase
    .from("workspace_invitations")
    .update({
      status: "revoked",
    })
    .eq("id", invitationId);

  if (error) {
    throw error;
  }
}

export async function acceptWorkspaceInvitation(params: {
  invitationId: string;
  profileId: string;
}): Promise<void> {
  const { data: invitation, error: invitationError } = await supabase
    .from("workspace_invitations")
    .select("*")
    .eq("id", params.invitationId)
    .eq("status", "pending")
    .single();

  if (invitationError) {
    throw invitationError;
  }

  const { error: memberError } = await supabase
    .from("workspace_members")
    .insert({
      workspace_id: invitation.workspace_id,
      profile_id: params.profileId,
      role: invitation.role,
    });

  if (memberError) {
    throw memberError;
  }

  const { error: updateError } = await supabase
    .from("workspace_invitations")
    .update({
      status: "accepted",
      accepted_at: new Date().toISOString(),
    })
    .eq("id", params.invitationId);

  if (updateError) {
    throw updateError;
  }
}
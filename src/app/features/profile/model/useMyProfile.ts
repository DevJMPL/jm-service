import { useEffect, useState } from "react";

import { supabase } from "@/shared/lib/supabase/client";
import { useAuthStore } from "@/app/features/auth/model/useAuth";

export type Profile = {
  id: string;
  full_name: string | null;
  email: string | null;
};

type UseMyProfileResult = {
  profile: Profile | null;
  isLoading: boolean;
  error: string | null;
  reload: () => Promise<void>;
};

export function useMyProfile(): UseMyProfileResult {
  const user = useAuthStore((state) => state.user);

  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function loadProfile() {
    if (!user?.id) {
      setProfile(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, full_name, email")
        .eq("id", user.id)
        .maybeSingle(); // 👈 CLAVE

      if (error) {
        throw error;
      }

      setProfile(data ?? null);
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "No se pudo cargar el perfil.";

      setError(message);
      setProfile(null);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadProfile();
  }, [user?.id]);

  return {
    profile,
    isLoading,
    error,
    reload: loadProfile,
  };
}

export default useMyProfile;
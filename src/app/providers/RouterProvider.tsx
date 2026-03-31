import { useEffect } from "react";
import { RouterProvider as ReactRouterProvider } from "react-router-dom";

import { router } from "@/app/routes";
import { supabase } from "@/shared/lib/supabase/client";
import { useAuthStore } from "@/app/features/auth/model/useAuth";

export function RouterProvider() {
  const initialize = useAuthStore((state) => state.initialize);
  const setSession = useAuthStore((state) => state.setSession);
  const clear = useAuthStore((state) => state.clear);
  const isInitialized = useAuthStore((state) => state.isInitialized);

  useEffect(() => {
    let isMounted = true;

    async function bootstrap() {
      try {
        await initialize();
      } catch (error) {
        console.error("No se pudo inicializar la sesión", error);
      }
    }

    void bootstrap();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!isMounted) return;

      try {
        if (session) {
          await setSession(session);
        } else {
          clear();
        }
      } catch (error) {
        console.error("Error sincronizando sesión", error);
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [initialize, setSession, clear]);

  if (!isInitialized) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#fbfbfc]">
        <div className="rounded-2xl border border-[#eef2f7] bg-white px-6 py-5 shadow-[0_8px_30px_rgba(120,144,180,0.08)]">
          <p className="text-sm font-medium text-[#252733]">Cargando sesión...</p>
          <p className="mt-1 text-sm text-[#8f95a3]">
            Preparando tu espacio de trabajo.
          </p>
        </div>
      </div>
    );
  }

  return <ReactRouterProvider router={router} />;
}

export default RouterProvider;
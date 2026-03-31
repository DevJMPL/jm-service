import type { ReactNode } from "react";

type SupabaseProviderProps = {
  children: ReactNode;
};

export function SupabaseProvider({ children }: SupabaseProviderProps) {
  return <>{children}</>;
}

export default SupabaseProvider;
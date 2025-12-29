import type { ReactNode } from "react";
import AdminProtection from "@/components/AdminProtection";

export const metadata = {
  title: "Admin | EduCentral",
  description: "Admin dashboard for managing teacher records",
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  return <AdminProtection>{children}</AdminProtection>;
}

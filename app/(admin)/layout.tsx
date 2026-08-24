import { AdminProfileProvider } from "@/components/AdminProfileContext";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminProfileProvider>
      {children}
    </AdminProfileProvider>
  );
}
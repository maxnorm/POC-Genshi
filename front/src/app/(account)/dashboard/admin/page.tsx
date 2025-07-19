import Access from "@/components/Access";
import { Metadata } from "next";
import AdminPage from "@/components/pages/dashboard/admin/AdminPage";

export const metadata: Metadata = {
  title: "Admin – GENSHI",
  description: `Gérez la plateforme GENSHI`,
  robots: {
    index: false,
    follow: false,
  },
};
function Admin() {
  return (
    <Access requiredRoles={['DEFAULT_ADMIN_ROLE']}>
      <AdminPage />
    </Access>
  );
}

export default Admin; 
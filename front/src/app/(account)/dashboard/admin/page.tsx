import Access from "@/components/Access";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Metadata } from "next";

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
      <div className="space-y-6">
        <PageHeader title="Administration" description="Gérez la plateforme GENSHI" />
      </div>
    </Access>
  );
}

export default Admin; 
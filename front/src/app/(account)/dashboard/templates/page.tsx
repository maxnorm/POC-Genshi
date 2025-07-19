import { Metadata } from "next";
import TemplatePage from "@/components/pages/dashboard/template/TemplatePage";
import Access from "@/components/Access";

export const metadata: Metadata = {
  title: "Templates – GENSHI",
  description: `Manage your templates.`,
  robots: {
    index: false,
    follow: false,
  },
};

function Templates() {
  return (
    <Access requiredRoles={['TEMPLATE_MANAGER']}>
      <TemplatePage />
    </Access>
  );
}

export default Templates;
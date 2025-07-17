import Auth from "@/components/Auth";
import DashboardLayout from "@/components/dashboard/DashboardLayout";

function AccountLayout({ children }: { children: React.ReactNode }) {
  return (
    <Auth>
      <DashboardLayout>
        {children}
      </DashboardLayout>
    </Auth>
  );
}

export default AccountLayout;
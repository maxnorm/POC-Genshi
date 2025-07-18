import Auth from "@/components/Auth";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { UserProvider } from "@/contexts/useUser";

function AccountLayout({ children }: { children: React.ReactNode }) {
  return (
    <Auth>
      <UserProvider>
        <DashboardLayout>
          {children}
        </DashboardLayout>  
      </UserProvider>
    </Auth>
  );
}

export default AccountLayout;
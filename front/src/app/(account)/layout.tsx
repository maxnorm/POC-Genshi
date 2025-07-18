import Auth from "@/components/Auth";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { UserProvider } from "@/contexts/useUser";
import DashboardContextWrapper from "@/components/dashboard/DashboardContextWrapper";

function AccountLayout({ children }: { children: React.ReactNode }) {
  return (
    <Auth>
      <UserProvider>
        <DashboardContextWrapper>
          <DashboardLayout>
            {children}
          </DashboardLayout>  
        </DashboardContextWrapper>
      </UserProvider>
    </Auth>
  );
}

export default AccountLayout;
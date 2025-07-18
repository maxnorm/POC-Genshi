import { Metadata } from "next";
import MainDashboardPage from "@/components/pages/dashboard/MainDashboardPage";

export const metadata: Metadata = {
  title: "Dashboard – GENSHI",
  description: `Welcome to your GENSHI traceability dashboard.`,
  robots: {
    index: false,
    follow: false,
  },
};

function Dashboard() {
  return (
    <MainDashboardPage />
  );
}

export default Dashboard;
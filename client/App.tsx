import "./global.css";

import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Index from "./pages/Index";
import HowItWorks from "./pages/HowItWorks";
import Payments from "./pages/Payments";
import SuccessStories from "./pages/SuccessStories";
import FAQ from "./pages/FAQ";
import Contact from "./pages/Contact";
import Apply from "./pages/Apply";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import TrustedVendor from "./pages/TrustedVendor";
import PaymentRequest from "./pages/PaymentRequest";
import PaymentInstructions from "./pages/PaymentInstructions";
import PaymentRequests from "./pages/PaymentRequests";
import AdminPaymentRequests from "./pages/AdminPaymentRequests";
import AdminPanel, { AdminDashboard, AdminPlaceholder } from "./pages/AdminPanel";
import AdminUsers from "./pages/AdminUsers";
import AdminApplications from "./pages/AdminApplications";
import AdminDevices from "./pages/AdminDevices";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./lib/auth";

const queryClient = new QueryClient();

const pageTitles: Record<string, string> = {
  "/": "Amazon Contributor Program",
  "/how-it-works": "Amazon Contributor Program | How It Works",
  "/payments": "Amazon Contributor Program | Payments",
  "/success-stories": "Amazon Contributor Program | Success Stories",
  "/faq": "Amazon Contributor Program | FAQ",
  "/contact": "Amazon Contributor Program | Contact",
  "/apply": "Amazon Contributor Application Portal",
  "/login": "Amazon Contributor Login",
  "/dashboard": "Amazon Contributor Dashboard",
  "/trusted-vendor": "Amazon Contributor Program | Trusted Vendor",
  "/trusted-vendor/request-payment": "Amazon Contributor Program | Request Payment",
  "/trusted-vendor/payment-instructions": "Amazon Contributor Program | Payment Instructions",
  "/trusted-vendor/requests": "Amazon Contributor Program | My Payment Requests",
  "/admin/payment-requests": "Amazon Contributor Program | Payment Requests",
  "/admin": "Amazon Contributor Admin | Dashboard",
  "/admin/users": "Amazon Contributor Admin | Users",
  "/admin/applications": "Amazon Contributor Admin | Applications",
  "/admin/device-requests": "Amazon Contributor Admin | Device Requests",
  "/admin/devices": "Amazon Contributor Admin | Devices",
};

function DocumentTitle() {
  const { pathname } = useLocation();

  useEffect(() => {
    document.title = pageTitles[pathname] ?? "Amazon Contributor Program";
  }, [pathname]);

  return null;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <DocumentTitle />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/payments" element={<Payments />} />
          <Route path="/success-stories" element={<SuccessStories />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/apply" element={<Apply />} />
          <Route path="/login" element={<Login />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/trusted-vendor" element={<TrustedVendor />} />
            <Route path="/trusted-vendor/request-payment" element={<PaymentRequest />} />
            <Route path="/trusted-vendor/payment-instructions" element={<PaymentInstructions />} />
            <Route path="/trusted-vendor/requests" element={<PaymentRequests />} />
            <Route path="/admin/payment-requests" element={<AdminPaymentRequests />} />
            <Route path="/admin" element={<AdminPanel />}>
              <Route index element={<AdminDashboard />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="applications" element={<AdminApplications />} />
              <Route path="device-requests" element={<AdminPlaceholder section="device-requests" />} />
              <Route path="devices" element={<AdminDevices />} />
            </Route>
          </Route>
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);

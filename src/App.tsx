import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import CarDetails from "./pages/CarDetails";
import Ads from "./pages/Ads";
import CreateAd from "./pages/CreateAd";
import Profile from "./pages/Profile";
import Admin from "./pages/Admin";
import EditAd from "./pages/EditAd";
import Messages from "./pages/Messages";
import Settings from "./pages/Settings";
import AdminSections from "./pages/AdminSections";
import AdminCategories from "./pages/AdminCategories";
import AdminCarModels from "./pages/AdminCarModels";
import AdminUsers from "./pages/AdminUsers";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/car/:id" element={<CarDetails />} />
            <Route path="/ads" element={<Ads />} />
            <Route path="/create-ad" element={<CreateAd />} />
            <Route path="/edit-ad/:id" element={<EditAd />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/admin/sections" element={<AdminSections />} />
            <Route path="/admin/categories" element={<AdminCategories />} />
            <Route path="/admin/car-models" element={<AdminCarModels />} />
            <Route path="/admin/users" element={<AdminUsers />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;

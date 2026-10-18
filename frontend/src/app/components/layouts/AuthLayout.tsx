import { Outlet } from "react-router";
import { Toaster } from "../ui/sonner";

export function AuthLayout() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e8f3ee] via-[#f8faf9] to-[#bee9e8]">
      <Outlet />
      <Toaster position="top-right" />
    </div>
  );
}
import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import RightSidebar from "./RightSidebar";
import MobileNav from "./MobileNav";
import { useMediaQuery } from "../../hooks/useMediaQuery";

export default function Layout() {
  const isMobile = useMediaQuery("(max-width: 639px)");

  return (
    <div className="flex justify-center max-w-[1265px] mx-auto min-h-screen">
      <Sidebar />
      <main className="flex-1 max-w-[600px] min-h-screen border-x border-x-border">
        <Outlet />
      </main>
      <RightSidebar />
      {isMobile && <MobileNav />}
    </div>
  );
}

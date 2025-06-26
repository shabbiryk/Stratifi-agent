"use client";

import { usePathname } from "next/navigation";
import Navbar from "./navbar";

export default function ConditionalNavbar() {
  const pathname = usePathname();

  // Pages that use sidebar layout - don't show navbar
  const sidebarPages = ["/", "/portfolio", "/strategies", "/points"];

  if (sidebarPages.includes(pathname)) {
    return null;
  }

  return <Navbar />;
}

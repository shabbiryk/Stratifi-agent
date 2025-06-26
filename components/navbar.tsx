"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Wallet,
  Home as HomeIcon,
  Menu,
  X,
  User,
  ChevronDown,
  UserPlus,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface NavLink {
  href: string;
  label: string;
  icon: React.ReactNode;
  description?: string;
  badge?: string;
  external?: boolean;
}

const navLinks: NavLink[] = [
  {
    href: "/",
    label: "Home",
    icon: <HomeIcon className="h-4 w-4" />,
    description: "Overview & analytics",
  },
  {
    href: "/about",
    label: "About",
    icon: <User className="h-4 w-4" />,
    description: "Learn more about us",
  },
  {
    href: "/contacts",
    label: "Contact",
    icon: <UserPlus className="h-4 w-4" />,
    description: "Get in touch",
  },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const pathname = usePathname();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (pathname === "/") {
        setIsScrolled(window.scrollY > 10);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [pathname]);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setActiveDropdown(null);
  }, [pathname]);

  return (
    <>
      <nav
        className={cn(
          "fixed top-0 left-0 right-0 z-50",
          pathname === "/"
            ? isScrolled
              ? "bg-gray-900/95 backdrop-blur-md border-b border-stratifi-300/20 shadow-lg"
              : "bg-transparent"
            : "bg-gray-900/95 backdrop-blur-md border-b border-stratifi-300/20 shadow-lg"
        )}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-3">
              <div className="relative">
                <img
                  src="/logo.png"
                  alt="StratiFi Logo"
                  className="h-8 w-auto"
                />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-nohemi font-normal text-white">
                  StratiFi
                </h1>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-8">
              {navLinks.map((link) => (
                <NavItem key={link.href} link={link} pathname={pathname} />
              ))}
            </div>

            {/* Right Section */}
            <div className="flex items-center space-x-4">
              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 text-slate-300 hover:text-white transition-colors"
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-stratifi-400/95 backdrop-blur-md border-t border-stratifi-300/20">
            <div className="container mx-auto px-4 py-4 space-y-4">
              {/* Mobile Navigation Links */}
              {navLinks.map((link) =>
                link.external ? (
                  <a
                    key={link.href}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(
                      "flex items-center space-x-3 p-3 rounded-lg",
                      pathname === link.href
                        ? "bg-stratifi-200/10 text-white"
                        : "text-slate-300 hover:text-white hover:bg-stratifi-300/10"
                    )}
                  >
                    {link.icon}
                    <span>{link.label}</span>
                    {link.badge && (
                      <Badge
                        variant="outline"
                        className="ml-2 bg-blue-500/10 text-blue-400 border-none"
                      >
                        {link.badge}
                      </Badge>
                    )}
                  </a>
                ) : (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "flex items-center space-x-3 p-3 rounded-lg",
                      pathname === link.href
                        ? "bg-stratifi-200/10 text-white"
                        : "text-slate-300 hover:text-white hover:bg-stratifi-300/10"
                    )}
                  >
                    {link.icon}
                    <span>{link.label}</span>
                    {link.badge && (
                      <Badge
                        variant="outline"
                        className="ml-2 bg-blue-500/10 text-blue-400 border-none"
                      >
                        {link.badge}
                      </Badge>
                    )}
                  </Link>
                )
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Spacer to prevent content from hiding behind fixed navbar */}
      <div className="h-16 lg:h-20" />
    </>
  );
}

interface NavItemProps {
  link: NavLink;
  pathname: string;
}

function NavItem({ link, pathname }: NavItemProps) {
  return link.external ? (
    <a
      href={link.href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors",
        pathname === link.href
          ? "text-white bg-stratifi-200/10"
          : "text-slate-300 hover:text-white hover:bg-stratifi-300/10"
      )}
    >
      {link.icon}
      <span className="font-medium">{link.label}</span>
      {link.badge && (
        <Badge
          variant="outline"
          className="ml-2 bg-blue-500/10 text-blue-400 border-none"
        >
          {link.badge}
        </Badge>
      )}
    </a>
  ) : (
    <Link
      href={link.href}
      className={cn(
        "flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors",
        pathname === link.href
          ? "text-white bg-stratifi-200/10"
          : "text-slate-300 hover:text-white hover:bg-stratifi-300/10"
      )}
    >
      {link.icon}
      <span className="font-medium">{link.label}</span>
      {link.badge && (
        <Badge
          variant="outline"
          className="ml-2 bg-blue-500/10 text-blue-400 border-none"
        >
          {link.badge}
        </Badge>
      )}
    </Link>
  );
}

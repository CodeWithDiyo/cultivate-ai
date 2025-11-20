"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { 
  Leaf, 
  Bot, 
  Rocket, 
  Users, 
  Building, 
  BarChart3, 
  Home,
  Menu,
  X
} from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigation = [
    { name: "Home", href: "/", icon: Home },
    { name: "Innovators", href: "/innovators", icon: Rocket },
    { name: "Investors", href: "/investors", icon: Users },
    { name: "Campaigns", href: "/campaigns", icon: Building },
    { name: "AI Engine", href: "/ai", icon: Bot },
    { name: "Dashboard", href: "/dashboard", icon: BarChart3 },
    { name: "About", href: "/about", icon: Leaf },
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <nav className="w-full bg-white/95 backdrop-blur-lg border-b border-green-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Brand */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="p-2 bg-green-100 rounded-xl group-hover:bg-green-200 transition-all duration-200">
              <Leaf className="h-6 w-6 text-green-700" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold text-green-800">Cultivate AI</span>
              <span className="text-xs text-green-600 -mt-1 font-medium">Climate Innovation Platform</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center space-x-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive(item.href)
                      ? "bg-green-100 text-green-800 border border-green-200"
                      : "text-gray-600 hover:text-green-700 hover:bg-green-50"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>

          {/* Authentication & Mobile Menu Button */}
          <div className="flex items-center space-x-4">
            <SignedOut>
              <div className="hidden md:flex items-center space-x-3">
                <Link
                  href="/sign-in"
                  className="px-4 py-2 text-sm font-medium text-green-700 hover:text-green-800 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/sign-up"
                  className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
                >
                  Join Now
                </Link>
              </div>
            </SignedOut>

            <SignedIn>
              <div className="hidden md:flex items-center space-x-4">
                <UserButton 
                  afterSignOutUrl="/"
                  appearance={{
                    elements: {
                      userButtonAvatarBox: "w-8 h-8",
                      userButtonOuterIdentifier: "text-sm font-medium text-gray-700"
                    }
                  }}
                />
                <Link
                  href="/sign-out"
                  className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Sign Out
                </Link>
              </div>
            </SignedIn>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-gray-600 hover:text-green-700 hover:bg-green-50 transition-colors"
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col space-y-2">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-base font-medium transition-all duration-200 ${
                      isActive(item.href)
                        ? "bg-green-100 text-green-800 border border-green-200"
                        : "text-gray-600 hover:text-green-700 hover:bg-green-50"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
              
              <div className="pt-4 border-t border-gray-200">
                <SignedOut>
                  <div className="flex flex-col space-y-2">
                    <Link
                      href="/sign-in"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="px-4 py-3 text-base font-medium text-green-700 hover:text-green-800 text-center"
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/sign-up"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="px-4 py-3 bg-green-600 text-white rounded-lg text-base font-medium hover:bg-green-700 text-center"
                    >
                      Join Now
                    </Link>
                  </div>
                </SignedOut>
                <SignedIn>
                  <div className="flex flex-col space-y-2">
                    <div className="px-4 py-3 flex items-center justify-center space-x-3">
                      <UserButton 
                        afterSignOutUrl="/"
                        appearance={{
                          elements: {
                            userButtonAvatarBox: "w-6 h-6",
                          }
                        }}
                      />
                      <span className="text-sm text-gray-600">My Account</span>
                    </div>
                    <Link
                      href="/sign-out"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="px-4 py-3 text-base font-medium text-gray-600 hover:text-gray-800 text-center border border-gray-200 rounded-lg"
                    >
                      Sign Out
                    </Link>
                  </div>
                </SignedIn>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

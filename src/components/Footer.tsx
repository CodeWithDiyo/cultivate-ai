"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Leaf, Github, Twitter, Linkedin, Mail } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    Company: [
      { name: "About Us", href: "/about" },
      { name: "How It Works", href: "/how-it-works" },
      { name: "Impact", href: "/impact" },
    ],
    Resources: [
      { name: "Blog", href: "/blog" },
      { name: "Documentation", href: "/docs" },
      { name: "Support", href: "/support" },
      { name: "Community", href: "/community" },
    ],
    Legal: [
      { name: "Privacy Policy", href: "/privacy" },
      { name: "Terms of Service", href: "/terms" },
      { name: "Cookie Policy", href: "/cookies" },
    ],
  };

  const socialLinks = [
    {
      icon: Twitter,
      href: "https://twitter.com/cultivateai",
      label: "Twitter",
    },
    {
      icon: Linkedin,
      href: "https://linkedin.com/company/cultivateai",
      label: "LinkedIn",
    },
    {
      icon: Github,
      href: "https://github.com/cultivateai",
      label: "GitHub",
    },
    {
      icon: Mail,
      href: "mailto:hello@cultivateai.com",
      label: "Email",
    },
  ];

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 mb-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-green-600 rounded-lg">
                <Leaf className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Cultivate AI</h3>
                <p className="text-green-200 text-sm">Climate Innovation Platform</p>
              </div>
            </Link>
            <p className="text-gray-300 mb-6 max-w-md text-sm leading-relaxed">
              The AI-powered platform where innovators, investors, and institutions unite 
              to create sustainable impact and build a greener future together.
            </p>
            
            {/* Social Links */}
            <div className="flex space-x-4">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-2 bg-gray-800 rounded-lg hover:bg-green-600 transition-colors"
                    aria-label={social.label}
                  >
                    <Icon className="h-4 w-4" />
                  </motion.a>
                );
              })}
            </div>
          </div>

          {/* Footer Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="font-semibold text-green-400 mb-4 text-sm uppercase tracking-wider">
                {category}
              </h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-gray-300 hover:text-green-400 transition-colors text-sm"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-700">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-center md:text-left">
              <p className="text-gray-400 text-sm">
                © {currentYear} Cultivate AI — Empowering Sustainable Futures
              </p>
              <p className="text-green-300 text-xs mt-1 font-medium">
                POWERED BY: THE DIYOWSKAN SENSE
              </p>
            </div>
            
            <div className="flex items-center space-x-6 text-sm text-gray-400">
              <Link href="/privacy" className="hover:text-green-400 transition-colors">
                Privacy
              </Link>
              <Link href="/terms" className="hover:text-green-400 transition-colors">
                Terms
              </Link>
              <Link href="/sitemap" className="hover:text-green-400 transition-colors">
                Sitemap
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

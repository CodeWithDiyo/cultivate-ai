// FILE: app/page.tsx
"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Leaf, Users, Bot, ArrowRight } from "lucide-react";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-6 py-24 bg-linear-to-b from-green-100 via-white to-gray-50">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl mx-auto"
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-green-700">
            Cultivate AI 🌿
          </h1>
          <p className="text-lg text-gray-700 mb-8">
            The AI-powered platform where{" "}
            <strong>innovators</strong>, <strong>investors</strong>, and{" "}
            <strong>institutions</strong> unite to create sustainable impact.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/sign-up">
              <Button className="px-6 py-3 text-lg bg-green-600 hover:bg-green-700">
                Get Started <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/about">
              <Button variant="outline" className="px-6 py-3 text-lg">
                Learn More
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Feature Section */}
      <section className="px-8 py-16 bg-white border-t border-gray-200">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-10 text-center">
          <FeatureCard
            icon={<Leaf className="h-10 w-10 text-green-600" />}
            title="Innovators"
            desc="Showcase your climate solutions and get AI-guided exposure."
          />
          <FeatureCard
            icon={<Users className="h-10 w-10 text-blue-600" />}
            title="Investors"
            desc="Discover and fund verified high-impact campaigns."
          />
          <FeatureCard
            icon={<Bot className="h-10 w-10 text-purple-600" />}
            title="AI Intelligence"
            desc="AgentKit AI continuously recommends top projects and strategies."
          />
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 text-center text-gray-500 border-t bg-gray-50">
        <p className="text-sm">
          © {new Date().getFullYear()} Cultivate AI — Empowering Sustainable Futures 
          POWERED BY: THE DIYOWSKAN SENSE 
        </p>
      </footer>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 250, damping: 20 }}
      className="bg-gray-50 p-6 rounded-2xl shadow-sm border border-gray-200 hover:shadow-md"
    >
      <div className="flex justify-center mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>
      <p className="text-gray-600">{desc}</p>
    </motion.div>
  );
}

import Link from "next/link";
import { 
  Leaf, 
  Zap, 
  Users, 
  TrendingUp, 
  Shield,
  Globe,
  ArrowRight,
  CheckCircle,
  Bot,
  Rocket,

} from "lucide-react";

export default function HomePage() {
  const features = [
    {
      icon: Zap,
      title: "AI-Powered Matching",
      description: "Intelligent algorithms connect the right innovations with the right funding and expertise."
    },
    {
      icon: Users,
      title: "Global Network",
      description: "Access to thousands of climate innovators, investors, and institutions worldwide."
    },
    {
      icon: TrendingUp,
      title: "Impact Analytics",
      description: "Comprehensive data and insights to measure and maximize environmental impact."
    },
    {
      icon: Shield,
      title: "Verified Projects",
      description: "Rigorous vetting process ensures only high-potential, credible solutions are featured."
    }
  ];

  const benefits = [
    "Access to $50M+ climate funding network",
    "AI-driven project evaluation and optimization",
    "Global visibility and partnership opportunities",
    "Real-time impact tracking and reporting",
    "Expert mentorship and growth guidance",
    "Seamless investment and funding processes"
  ];

  const platformFeatures = [
    {
      icon: Rocket,
      title: "Innovators",
      description: "Showcase your climate solutions and get AI-guided exposure to investors and institutions."
    },
    {
      icon: Users,
      title: "Investors", 
      description: "Discover and fund verified high-impact climate campaigns with AI-driven risk assessment."
    },
    {
      icon: Bot,
      title: "AI Intelligence",
      description: "AgentKit AI continuously analyzes and recommends top projects and investment strategies."
    }
  ];

  return (
    <div className="min-h-screen bg-linear-to-b from-green-50 to-white">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="inline-flex items-center gap-3 mb-8 px-6 py-3 bg-green-100 rounded-full">
              <Leaf className="h-5 w-5 text-green-700" />
              <span className="text-green-800 font-medium">The Future of Climate Innovation is Here</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-green-900 mb-6 leading-tight">
              Cultivate AI
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-700 max-w-3xl mx-auto mb-8 leading-relaxed">
              The AI-powered platform where{" "}
              <strong className="text-green-600">innovators</strong>, <strong className="text-blue-600">investors</strong>, and{" "}
              <strong className="text-purple-600">institutions</strong> unite to create sustainable impact.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link
                href="/sign-up"
                className="px-8 py-4 bg-green-600 text-white rounded-xl font-bold text-lg hover:bg-green-700 transition-colors shadow-lg flex items-center justify-center gap-2"
              >
                Get Started Free
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                href="/about"
                className="px-8 py-4 border-2 border-green-600 text-green-700 rounded-xl font-bold text-lg hover:bg-green-50 transition-colors flex items-center justify-center gap-2"
              >
                Learn More
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-800">500+</div>
                <div className="text-sm text-gray-600">Active Projects</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-800">$50M+</div>
                <div className="text-sm text-gray-600">Funding Deployed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-800">2.5K+</div>
                <div className="text-sm text-gray-600">Innovators</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-800">85%</div>
                <div className="text-sm text-gray-600">Success Rate</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Platform Features Section */}
      <section className="px-8 py-16 bg-white border-t border-gray-200">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-10 text-center">
          {platformFeatures.map((feature, index) => (
            <div
              key={index}
              className="bg-gray-50 p-8 rounded-2xl shadow-sm border border-gray-200 hover:shadow-lg transition-all hover:scale-105"
            >
              <div className="flex justify-center mb-6">
                <feature.icon className={`h-12 w-12 ${
                  feature.title === "Innovators" ? "text-green-600" :
                  feature.title === "Investors" ? "text-blue-600" :
                  "text-purple-600"
                }`} />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-green-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-green-900 mb-4">Why Choose Cultivate AI?</h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              The most comprehensive platform for climate innovation and impact investment
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="bg-green-100 rounded-2xl p-4 w-fit mx-auto mb-6">
                  <feature.icon className="h-8 w-8 text-green-700" />
                </div>
                <h3 className="text-xl font-bold text-green-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-green-900 mb-6">
                Everything You Need to Scale Climate Impact
              </h2>
              <p className="text-lg text-gray-700 mb-8 leading-relaxed">
                Our platform provides the complete toolkit for climate innovators and investors to 
                connect, collaborate, and create meaningful environmental change at scale.
              </p>
              
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle className="h-6 w-6 text-green-600 shrink-0" />
                    <span className="text-gray-700">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-green-100">
              <div className="text-center mb-6">
                <Globe className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-green-900">Join the Movement</h3>
              </div>
              
              <div className="space-y-4">
                <Link
                  href="/sign-up?role=innovator"
                  className="block w-full text-center px-6 py-4 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors"
                >
                  I&apos;m an Innovator
                </Link>
                <Link
                  href="/sign-up?role=investor"
                  className="block w-full text-center px-6 py-4 border-2 border-green-600 text-green-700 rounded-lg font-semibold hover:bg-green-50 transition-colors"
                >
                  I&apos;m an Investor
                </Link>
                <Link
                  href="/sign-up?role=institution"
                  className="block w-full text-center px-6 py-4 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                >
                  I&apos;m an Institution
                </Link>
              </div>
              
              <p className="text-center text-sm text-gray-600 mt-4">
                Already have an account?{" "}
                <Link href="/sign-in" className="text-green-600 hover:text-green-700 font-semibold">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-linear-to-r from-green-600 to-emerald-700">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Build a Sustainable Future?
          </h2>
          <p className="text-xl text-green-100 mb-8">
            Join thousands of climate leaders already making an impact with Cultivate AI
          </p>
          <Link
            href="/sign-up"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-green-700 rounded-xl font-bold text-lg hover:bg-green-50 transition-colors shadow-lg"
          >
            Start Your Impact Journey
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}

import { 
  Leaf, 
  Target, 
  Users, 
  Shield,
  TrendingUp,
  Award
} from "lucide-react";
import Link from "next/link";

export default function AboutPage() {
  const stats = [
    { number: "500+", label: "Climate Projects" },
    { number: "$50M+", label: "Funding Deployed" },
    { number: "2.5K+", label: "Active Innovators" },
    { number: "150+", label: "Countries Reached" },
  ];

  const values = [
    {
      icon: Target,
      title: "Impact-First Approach",
      description: "Every solution is measured by its potential environmental impact and scalability for global change."
    },
    {
      icon: Shield,
      title: "Transparent & Ethical",
      description: "Complete transparency in funding, project selection, and impact measurement for all stakeholders."
    },
    {
      icon: Users,
      title: "Collaborative Ecosystem",
      description: "Breaking down silos between innovators, investors, and institutions for maximum climate impact."
    },
    {
      icon: TrendingUp,
      title: "Data-Driven Decisions",
      description: "Leveraging AI and comprehensive data analytics to identify and scale the most promising solutions."
    }
  ];

  const team = [
    {
      name: "Climate Science Division",
      role: "Environmental Impact Assessment",
      description: "Ensuring all projects meet rigorous environmental standards and contribute meaningfully to climate goals."
    },
    {
      name: "AI Research Team",
      role: "Machine Learning & Analytics",
      description: "Developing cutting-edge AI models to evaluate, optimize, and scale climate solutions efficiently."
    },
    {
      name: "Investment Advisory",
      role: "Strategic Funding & Growth",
      description: "Connecting the right projects with appropriate funding sources and providing growth guidance."
    }
  ];

  return (
    <div className="min-h-screen bg-linear-to-b from-green-50 via-white to-emerald-50">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-4 mb-8">
              <div className="p-4 bg-green-100 rounded-2xl shadow-lg">
                <Leaf className="h-12 w-12 text-green-700" />
              </div>
              <h1 className="text-5xl md:text-6xl font-bold text-green-900">
                About Cultivate AI
              </h1>
            </div>
            <p className="text-xl md:text-2xl text-gray-700 max-w-4xl mx-auto leading-relaxed font-light">
              We&apos;re building the world&apos;s most intelligent climate innovation platform—where artificial intelligence 
              meets human ingenuity to solve our planet&apos;s most pressing environmental challenges.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-green-800 mb-2">{stat.number}</div>
                <div className="text-sm md:text-base text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-green-900 mb-4">Our Mission</h2>
            <div className="w-24 h-1 bg-green-600 mx-auto"></div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12 text-lg text-gray-700 leading-relaxed">
            <div className="space-y-6">
              <p>
                <strong className="text-green-800">Cultivate AI exists to accelerate the transition to a sustainable future.</strong> We bridge the gap between 
                groundbreaking climate innovations and the resources needed to scale them globally.
              </p>
              <p>
                Our platform leverages advanced artificial intelligence to identify, evaluate, and connect the most 
                promising environmental solutions with investors, institutions, and partners who can help them grow.
              </p>
              <p>
                From carbon capture technologies and renewable energy systems to sustainable agriculture and circular 
                economy solutions, we provide the intelligence and connectivity needed to turn ideas into impact.
              </p>
            </div>
            <div className="space-y-6">
              <p>
                What sets us apart is our <strong className="text-green-800">AI-powered matching engine</strong> that analyzes thousands of data points 
                to ensure the right solutions find the right support at the right time.
              </p>
              <p>
                We believe that technology, when guided by purpose and powered by collaboration, can solve the 
                climate crisis. Our platform is designed to make that collaboration seamless, efficient, and 
                massively scalable.
              </p>
              <p className="text-green-800 font-semibold text-xl">
                Together, we&apos;re cultivating a greener world—one intelligent solution at a time.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-green-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-green-900 mb-4">Our Values</h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              The principles that guide every decision and innovation on our platform
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 shadow-lg border border-green-100 hover:shadow-xl transition-shadow">
                <div className="p-3 bg-green-100 rounded-xl w-fit mb-6">
                  <value.icon className="h-8 w-8 text-green-700" />
                </div>
                <h3 className="text-xl font-bold text-green-900 mb-4">{value.title}</h3>
                <p className="text-gray-600 leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-green-900 mb-4">Our Expertise</h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              Cross-disciplinary teams working together to maximize climate impact
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {team.map((team, index) => (
              <div key={index} className="text-center">
                <div className="bg-green-100 rounded-2xl p-6 mb-6">
                  <Award className="h-12 w-12 text-green-700 mx-auto" />
                </div>
                <h3 className="text-xl font-bold text-green-900 mb-2">{team.name}</h3>
                <p className="text-green-600 font-medium mb-4">{team.role}</p>
                <p className="text-gray-600 leading-relaxed">{team.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-linear-to-r from-green-600 to-emerald-700">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-6">Ready to Make an Impact?</h2>
          <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
            Join thousands of climate innovators, investors, and institutions already using Cultivate AI to drive meaningful environmental change.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/sign-up"
              className="px-8 py-4 bg-white text-green-700 rounded-xl font-bold text-lg hover:bg-green-50 transition-colors shadow-lg"
            >
              Start Your Journey
            </Link>
            <Link
              href="/campaigns"
              className="px-8 py-4 border-2 border-white text-white rounded-xl font-bold text-lg hover:bg-white hover:text-green-700 transition-colors"
            >
              Explore Solutions
            </Link>
          </div>
          <p className="text-green-200 mt-6 text-sm">
            Join the movement. Make a difference. Build the future.
          </p>
        </div>
      </section>
    </div>
  );
}

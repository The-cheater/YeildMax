import { Header } from "@/components/layout/Header"
import { YieldComparison } from "@/components/dashboard/YieldComparison"
import { PortfolioTracker } from "@/components/dashboard/PortfolioTracker"
import { RiskAssessment } from "@/components/dashboard/RiskAssessment"
import { RecommendationPanel } from "@/components/dashboard/RecommendationPanel"
import { Sparkles, ArrowRight, Shield, Brain } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"

export default function Dashboard() {
  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="relative">
        {/* Hero Section */}
        <section className="relative py-20 md:py-32 overflow-hidden">
          <div className="container mx-auto px-6">
            <div className="text-center max-w-6xl mx-auto">
              <div className="inline-flex items-center space-x-2 bg-green-500/10 border border-green-500/20 rounded-full px-4 py-2 mb-8">
                <Sparkles className="h-4 w-4 text-green-400" />
                <span className="text-green-400 font-medium">AI-Powered Yield Optimization</span>
              </div>
              
              {/* Hero Text with Logo */}
              <div className="flex flex-row items-center justify-center gap-8 mb-8">
                {/* Logo */}
                <div className="flex-shrink-0">
                  <Image
                    src="/logo.png"
                    alt="YieldMax Logo"
                    width={120}
                    height={120}
                    className="w-24 h-30 md:w-32 md:h-37 lg:w-40 lg:h-40 object-contain drop-shadow-2xl"
                    priority
                  />
                </div>
                
                {/* Hero Text */}
                <h1 className="hero-text text-white">
                  Maximize Your
                  <br />
                  <span className="primary-gradient">DeFi Yields</span>
                </h1>
              </div>
              
              <p className="subtitle-text text-gray-400 max-w-3xl mx-auto mb-12">
                Smart yield farming with AI recommendations across 50+ protocols. 
                Advanced risk assessment, portfolio optimization, and one-click execution.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button 
                  size="lg" 
                  className="bg-green-500 hover:bg-green-600 text-black font-bold text-lg px-8 py-4 h-auto green-glow"
                >
                  Start Optimizing
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="border-green-500/50 text-green-400 hover:bg-green-500/10 font-bold text-lg px-8 py-4 h-auto"
                >
                  View Demo
                </Button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20">
                {[
                  { label: 'Total Value Locked', value: '$2.4B+', icon: Shield },
                  { label: 'Protocols Integrated', value: '50+', icon: Brain },
                  { label: 'Average APY Boost', value: '+187%', icon: Sparkles },
                ].map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-green-500/20 rounded-full mb-4">
                      <stat.icon className="h-6 w-6 text-green-400" />
                    </div>
                    <div className="metric-value text-white mb-2">{stat.value}</div>
                    <p className="text-gray-400 font-medium">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Dashboard Grid */}
        <section className="py-16">
          <div className="container mx-auto px-6 space-y-12">
            {/* Yield Comparison */}
            <div>
              <h2 className="text-4xl font-bold text-white mb-8 text-center">
                Live Yield <span className="primary-gradient">Opportunities</span>
              </h2>
              <YieldComparison />
            </div>
            
            {/* Portfolio & Risk Assessment Row */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
              <div className="xl:col-span-2">
                <h2 className="text-3xl font-bold text-white mb-6">
                  Portfolio <span className="primary-gradient">Analytics</span>
                </h2>
                <PortfolioTracker />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-white mb-6">
                  Risk <span className="primary-gradient">Assessment</span>
                </h2>
                <RiskAssessment />
              </div>
            </div>
            
            {/* AI Recommendations */}
            <div>
              <h2 className="text-4xl font-bold text-white mb-8 text-center">
                AI <span className="primary-gradient">Recommendations</span>
              </h2>
              <RecommendationPanel />
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

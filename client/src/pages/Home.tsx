import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Zap, Code2, Rocket, Users } from "lucide-react";
import { getLoginUrl } from "@/const";
import { useLocation } from "wouter";

export default function Home() {
  const { user, isAuthenticated } = useAuth();
  const [, navigate] = useLocation();

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* Header */}
      <header className="border-b border-blue-200 bg-white/80 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Zap className="w-8 h-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">Zarish Sphere</h1>
          </div>
          <div className="flex gap-2">
            {isAuthenticated ? (
              <>
                <span className="text-sm text-gray-600">
                  Welcome, {user?.name}
                </span>
                <Button
                  onClick={() => navigate("/builder")}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Open Builder
                </Button>
              </>
            ) : (
              <Button
                onClick={() => (window.location.href = getLoginUrl())}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Sign In
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {/* Hero Section */}
        <section className="max-w-6xl mx-auto px-4 py-16 text-center">
          <h2 className="text-5xl font-bold text-gray-900 mb-4">
            Build Full-Stack Applications Without Code
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Zarish Sphere is an Enterprise-Grade, AI-powered
            Platform-as-a-Service that enables non-coders to rapidly build,
            implement, and deploy full-stack applications through an intuitive
            GUI.
          </p>
          <div className="flex gap-4 justify-center">
            {isAuthenticated ? (
              <Button
                size="lg"
                onClick={() => navigate("/builder")}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Rocket className="w-5 h-5 mr-2" />
                Start Building
              </Button>
            ) : (
              <Button
                size="lg"
                onClick={() => (window.location.href = getLoginUrl())}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Get Started
              </Button>
            )}
            <Button size="lg" variant="outline">
              Learn More
            </Button>
          </div>
        </section>

        {/* Features Section */}
        <section className="max-w-6xl mx-auto px-4 py-16">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Key Features
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <Zap className="w-8 h-8 text-blue-600 mb-4" />
              <h4 className="font-bold text-lg mb-2">Drag & Drop</h4>
              <p className="text-gray-600">
                Build applications by dragging and dropping components
              </p>
            </Card>
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <Code2 className="w-8 h-8 text-indigo-600 mb-4" />
              <h4 className="font-bold text-lg mb-2">No Code</h4>
              <p className="text-gray-600">
                Create full-stack applications without writing a single line of
                code
              </p>
            </Card>
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <Rocket className="w-8 h-8 text-purple-600 mb-4" />
              <h4 className="font-bold text-lg mb-2">One-Click Deploy</h4>
              <p className="text-gray-600">
                Deploy your applications to production instantly
              </p>
            </Card>
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <Users className="w-8 h-8 text-pink-600 mb-4" />
              <h4 className="font-bold text-lg mb-2">Collaborate</h4>
              <p className="text-gray-600">
                Work with team members in real-time
              </p>
            </Card>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-blue-600 text-white py-16 mt-16">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h3 className="text-3xl font-bold mb-4">
              Ready to Transform Your Operations?
            </h3>
            <p className="text-lg mb-8 opacity-90">
              Join organizations worldwide using Zarish Sphere to streamline
              their operations
            </p>
            {isAuthenticated ? (
              <Button
                size="lg"
                onClick={() => navigate("/builder")}
                className="bg-white text-blue-600 hover:bg-gray-100"
              >
                Open GUI Builder
              </Button>
            ) : (
              <Button
                size="lg"
                onClick={() => (window.location.href = getLoginUrl())}
                className="bg-white text-blue-600 hover:bg-gray-100"
              >
                Start for Free
              </Button>
            )}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white py-8">
        <div className="max-w-6xl mx-auto px-4 text-center text-gray-600">
          <p>&copy; 2025 Zarish Sphere Platform. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

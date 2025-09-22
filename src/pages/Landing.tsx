import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { DollarSign, Users, Calculator, Star } from "lucide-react";

const Landing = () => {
  const features = [
    {
      icon: DollarSign,
      title: "Easy Bill Splitting",
      description: "Split bills effortlessly with friends and groups"
    },
    {
      icon: Users,
      title: "Invite Anyone",
      description: "Invite friends via code, no registration required for guests"
    },
    {
      icon: Calculator,
      title: "Smart Calculations",
      description: "Automatically calculate splits equally or custom amounts"
    },
    {
      icon: Star,
      title: "Premium Features",
      description: "Upgrade for unlimited bills and advanced features"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/20">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <DollarSign className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold text-foreground">SplitBuddy</span>
          </div>
          <div className="space-x-4">
            <Button variant="ghost" asChild>
              <Link to="/login">Login</Link>
            </Button>
            <Button asChild>
              <Link to="/register">Get Started</Link>
            </Button>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-16">
        <div className="text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-5xl md:text-6xl font-bold text-foreground">
              Split Bills
              <span className="text-primary block">Effortlessly</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              The smart way to split expenses with friends, family, and colleagues. 
              Track who owes what and settle up easily.
            </p>
          </div>

          <div className="space-x-4">
            <Button size="lg" asChild>
              <Link to="/register">Start Splitting</Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link to="/guest-join">Join as Guest</Link>
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mt-24 grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="text-center p-6 hover:shadow-lg transition-shadow">
              <CardContent className="space-y-4">
                <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-lg">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-24 text-center space-y-6">
          <div className="bg-card border rounded-lg p-8 max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">Ready to get started?</h2>
            <p className="text-muted-foreground mb-6">
              Join thousands of users who trust SplitBuddy for their expense sharing needs.
            </p>
            <div className="space-x-4">
              <Button size="lg" asChild>
                <Link to="/register">Create Account</Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link to="/login">Sign In</Link>
              </Button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-6 w-6 text-primary" />
              <span className="font-semibold">SplitBuddy</span>
            </div>
            <p className="text-muted-foreground text-sm">
              © 2024 SplitBuddy. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
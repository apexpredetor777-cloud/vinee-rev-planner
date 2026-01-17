import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Sparkles, ArrowRight, BookOpen, CalendarDays, BarChart3, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const Index = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return null;
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl gradient-primary">
              <Sparkles className="h-5 w-5 text-primary-foreground" />
            </div>
            <h1 className="font-heading text-xl font-bold text-foreground">
              Smart Revision Planner
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link to="/signup">
              <Button className="gradient-primary text-primary-foreground">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-4xl text-center">
            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6">
              Study Smarter,{' '}
              <span className="text-gradient">Not Harder</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
              Generate personalized, adaptive study plans based on your subjects, 
              exam dates, and available time. Let AI help you ace your exams.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/signup">
                <Button size="lg" className="gradient-primary text-primary-foreground gap-2">
                  Start Planning Free
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Link to="/login">
                <Button size="lg" variant="outline">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-16 px-4 bg-card/50">
          <div className="container mx-auto max-w-6xl">
            <h2 className="font-heading text-3xl font-bold text-center mb-12">
              Everything You Need to Succeed
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="p-6 rounded-xl bg-card border border-border hover:border-primary/50 transition-all">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 mb-4">
                  <BookOpen className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-heading font-semibold text-lg mb-2">
                  Subject Management
                </h3>
                <p className="text-muted-foreground text-sm">
                  Add subjects with exam dates, difficulty levels, and weak areas
                </p>
              </div>

              <div className="p-6 rounded-xl bg-card border border-border hover:border-primary/50 transition-all">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 mb-4">
                  <CalendarDays className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-heading font-semibold text-lg mb-2">
                  Smart Scheduling
                </h3>
                <p className="text-muted-foreground text-sm">
                  Auto-generated study plans that adapt to your pace and priorities
                </p>
              </div>

              <div className="p-6 rounded-xl bg-card border border-border hover:border-primary/50 transition-all">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 mb-4">
                  <CheckCircle className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-heading font-semibold text-lg mb-2">
                  Progress Tracking
                </h3>
                <p className="text-muted-foreground text-sm">
                  Daily checklists and visual progress tracking to stay motivated
                </p>
              </div>

              <div className="p-6 rounded-xl bg-card border border-border hover:border-primary/50 transition-all">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 mb-4">
                  <BarChart3 className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-heading font-semibold text-lg mb-2">
                  Analytics Dashboard
                </h3>
                <p className="text-muted-foreground text-sm">
                  Insights on your performance with at-risk subject alerts
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-2xl text-center">
            <h2 className="font-heading text-3xl font-bold mb-4">
              Ready to Ace Your Exams?
            </h2>
            <p className="text-muted-foreground mb-8">
              Join students who improved their exam preparation with personalized study plans.
            </p>
            <Link to="/signup">
              <Button size="lg" className="gradient-primary text-primary-foreground">
                Get Started Free
              </Button>
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-4">
        <div className="container mx-auto text-center text-sm text-muted-foreground">
          <p>© 2024 Smart Revision Planner. Built for students, by students.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;

import { ArrowRight } from "lucide-react";

const Newsletter = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-primary/5 to-transparent" />
      
      <div className="container mx-auto px-4 relative">
        <div className="max-w-4xl mx-auto text-center">
          <span className="text-primary uppercase tracking-wider text-sm font-medium">
            Stay Updated
          </span>
          <h2 className="font-display text-4xl md:text-5xl mt-2">
            Join the Racing Community
          </h2>
          <p className="text-muted-foreground mt-4 max-w-xl mx-auto">
            Get exclusive access to new arrivals, special offers, and racing tips 
            delivered straight to your inbox.
          </p>

          {/* Form */}
          <form className="mt-8 flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-4 rounded-md bg-secondary border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
            />
            <button className="btn-racing inline-flex items-center justify-center gap-2 whitespace-nowrap">
              Subscribe
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          <p className="text-xs text-muted-foreground mt-4">
            By subscribing, you agree to our Privacy Policy and consent to receive updates.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;

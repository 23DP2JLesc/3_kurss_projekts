import { ArrowRight } from "lucide-react";
import heroImage from "@/assets/hero-moto.jpg";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImage}
          alt="High performance motorcycle"
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-transparent to-background/40" />
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/10 mb-8 animate-fade-in">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse-glow" />
            <span className="text-sm font-medium text-primary uppercase tracking-wider">
              Sacīkšu veiktspējas detaļas
            </span>
          </div>

          {/* Headline */}
          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl leading-none mb-6 animate-slide-up">
            <span className="block">Veidots</span>
            <span className="text-gradient">Ātrumam</span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-xl mb-10 animate-fade-in" style={{ animationDelay: "0.2s" }}>
            Augstākās kvalitātes motociklu detaļas, kas izstrādātas optimālai veiktspējai. 
            No sacīkšu izplūdēm līdz sacīkšu specifikācijas balstiekārtām.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 animate-fade-in" style={{ animationDelay: "0.4s" }}>
            <button className="btn-racing inline-flex items-center justify-center gap-2 group">
              Iepirkties tagad
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <a
              href="/about"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-md border border-border hover:border-primary/50 transition-colors font-semibold"
            >
              About Us
            </a>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 mt-16 pt-8 border-t border-border/50 animate-fade-in" style={{ animationDelay: "0.6s" }}>
            <div>
              <div className="font-display text-3xl md:text-4xl text-primary">500+</div>
              <div className="text-sm text-muted-foreground uppercase tracking-wider mt-1">Produkti</div>
            </div>
            <div>
              <div className="font-display text-3xl md:text-4xl text-primary">50K+</div>
              <div className="text-sm text-muted-foreground uppercase tracking-wider mt-1">Braucēji</div>
            </div>
            <div>
              <div className="font-display text-3xl md:text-4xl text-primary">24/7</div>
              <div className="text-sm text-muted-foreground uppercase tracking-wider mt-1">Atbalsts</div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 rounded-full border-2 border-muted-foreground flex items-start justify-center p-2">
          <div className="w-1.5 h-3 rounded-full bg-primary" />
        </div>
      </div>
    </section>
  );
};

export default Hero;

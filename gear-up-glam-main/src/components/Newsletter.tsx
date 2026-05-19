import { ArrowRight } from "lucide-react";

const Newsletter = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-primary/5 to-transparent" />
      
      <div className="container mx-auto px-4 relative">
        <div className="max-w-4xl mx-auto text-center">
          <span className="text-primary uppercase tracking-wider text-sm font-medium">
            Esi informēts
          </span>
          <h2 className="font-display text-4xl md:text-5xl mt-2">
            Pievienojies sacīkšu kopienai
          </h2>
          <p className="text-muted-foreground mt-4 max-w-xl mx-auto">
            Saņem ekskluzīvus paziņojumus par jaunumiem, īpašiem piedāvājumiem un sacīkšu padomiem tieši savā pastkastītē.
          </p>

          {/* Form */}
          <form className="mt-8 flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-4 rounded-md bg-secondary border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
            />
            <button className="btn-racing inline-flex items-center justify-center gap-2 whitespace-nowrap">
              Abonēt
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          <p className="text-xs text-muted-foreground mt-4">
            Abonējot, tu piekrīti mūsu privātuma politikai un saņem informāciju.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;

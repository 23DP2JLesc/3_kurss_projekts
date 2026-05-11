import { Mail, MapPin, Phone } from "lucide-react";
import Header from "@/components/Header";
import ContactForm from "@/components/ContactForm";
import Footer from "@/components/Footer";

const Contact = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20">
        <section className="py-16 bg-secondary/20">
          <div className="container mx-auto px-4 text-center">
            <span className="text-primary uppercase tracking-wider text-sm font-medium">Support</span>
            <h1 className="font-display text-5xl md:text-6xl mt-3">Contact MotoParts</h1>
            <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
              Ask about fitment, stock, orders, or performance upgrades for your build.
            </p>
          </div>
        </section>

        <section className="py-12">
          <div className="container mx-auto px-4 grid gap-4 md:grid-cols-3">
            <div className="rounded-lg border border-border bg-card p-6 text-center">
              <Mail className="mx-auto h-7 w-7 text-primary" />
              <h2 className="font-display text-xl mt-4">Email</h2>
              <p className="text-muted-foreground mt-2">support@motoparts.example</p>
            </div>
            <div className="rounded-lg border border-border bg-card p-6 text-center">
              <Phone className="mx-auto h-7 w-7 text-primary" />
              <h2 className="font-display text-xl mt-4">Phone</h2>
              <p className="text-muted-foreground mt-2">+1 (555) 019-7283</p>
            </div>
            <div className="rounded-lg border border-border bg-card p-6 text-center">
              <MapPin className="mx-auto h-7 w-7 text-primary" />
              <h2 className="font-display text-xl mt-4">Workshop</h2>
              <p className="text-muted-foreground mt-2">Performance District, Track City</p>
            </div>
          </div>
        </section>

        <ContactForm />
      </main>
      <Footer />
    </div>
  );
};

export default Contact;
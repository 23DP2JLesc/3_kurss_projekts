import { Instagram, Twitter, Youtube, Facebook } from "lucide-react";

const Footer = () => {
  const footerLinks = {
    shop: ["Visi produkti", "Jaunumi", "Populārākie", "Track detaļas", "Street detaļas"],
    support: ["Sazinies ar mums", "BUJ", "Piegādes info", "Atgriešana", "Sekot pasūtījumam"],
    company: ["Par mums", "Karjera", "Prese", "Partneri", "Filiales"],
  };

  const socialLinks = [
    { icon: Instagram, href: "#" },
    { icon: Twitter, href: "#" },
    { icon: Youtube, href: "#" },
    { icon: Facebook, href: "#" },
  ];

  return (
    <footer className="border-t border-border bg-card">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <a href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-md bg-primary flex items-center justify-center">
                <span className="font-display text-2xl text-primary-foreground">M</span>
              </div>
              <span className="font-display text-2xl tracking-wider">MOTOPARTS</span>
            </a>
            <p className="text-muted-foreground mt-4 max-w-xs">
              Augstākās kvalitātes motociklu detaļas braucējiem, kuri pieprasa vislabāko. 
              Sacīkšu veiktspēja, ikdienas uzticamība.
            </p>
            <div className="flex items-center gap-4 mt-6">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  className="w-10 h-10 rounded-full border border-border hover:border-primary hover:bg-primary hover:text-primary-foreground flex items-center justify-center transition-all duration-300"
                >
                  <social.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-display text-lg mb-4">Veikals</h4>
            <ul className="space-y-2">
              {footerLinks.shop.map((link) => (
                <li key={link}>
                  <a href="#" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display text-lg mb-4">Atbalsts</h4>
            <ul className="space-y-2">
              {footerLinks.support.map((link) => (
                <li key={link}>
                  <a href="#" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display text-lg mb-4">Uzņēmums</h4>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link}>
                  <a href="#" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="glow-line mt-12 mb-8" />
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <p>© 2024 MotoParts. Visas tiesības rezervētas.</p>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-primary transition-colors">Privātuma politika</a>
            <a href="#" className="hover:text-primary transition-colors">Pakalpojumu noteikumi</a>
            <a href="#" className="hover:text-primary transition-colors">Sīkfailu iestatījumi</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

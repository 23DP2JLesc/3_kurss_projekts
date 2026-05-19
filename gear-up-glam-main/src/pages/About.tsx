import { Award, Gauge, ShieldCheck, Wrench } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const values = [
  { icon: Gauge, title: "Pārbaudīts trasē", text: "Detaļas izvēlētas braucējiem, kuriem svarīga bremzēšanas sajūta, reakcija uz gāzi un konsekvence apļa pēc apļa." },
  { icon: ShieldCheck, title: "Uzticama kvalitāte", text: "Katrs produkts tiek atlasīts pēc fitmenta, izturības un reālās lietošanas uzticamības pirms nonākšanas veikalā." },
  { icon: Wrench, title: "Fitmenta atbalsts", text: "Mēs palīdzam izvēlēties detaļas atbilstoši tavam motocikla modelim, stilam un veiktspējas mērķiem." },
  { icon: Award, title: "Sacīkšu domāšana", text: "Katalogs koncentrēts uz sporta, ielas un veiktspējas komplektiem bez nevajadzīga trokšņa." },
];

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20">
        <section className="bg-gradient-to-b from-secondary/30 to-background py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl">
              <span className="text-primary uppercase tracking-wider text-sm font-medium">Par MotoParts</span>
              <h1 className="font-display text-5xl md:text-7xl mt-4">Veidots braucējiem, kuri spiež cietāk</h1>
              <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
                MotoParts ir veikals ar augstas veiktspējas motociklu detaļām, kas koncentrējas uz sacīkšu iedvesmotajiem uzlabojumiem, uzticamām zīmoliem un skaidru fitmenta vadību nopietniem ielas un trases braucējiem.
              </p>
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="container mx-auto px-4 grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:items-start">
            <div>
              <span className="text-primary uppercase tracking-wider text-sm font-medium">Mūsu misija</span>
              <h2 className="font-display text-4xl mt-3">Veiktspēja bez minēšanās</h2>
            </div>
            <div className="space-y-5 text-muted-foreground leading-relaxed">
              <p>
                Mēs izveidojām MotoParts, lai motocikla uzlabošana būtu skaidra un pārliecinoša. Tā vietā, lai būtu bezgalīgi nejauši saraksti, veikals izceļ detaļas pēc markas, modeļa, veida, krājuma statusa un praktiskas lietošanas.
              </p>
              <p>
                No izplūdes sistēmām un bremžu komplektiem līdz balstiekārtai un virsbūves detaļām, mērķis ir vienkāršs: palīdzēt braucējiem atrast pareizo komponentu ātrāk un saglabāt pirkuma pieredzi asu, tiešu un sacīkšu gatavu.
              </p>
            </div>
          </div>
        </section>

        <section className="bg-secondary/20 py-20">
          <div className="container mx-auto px-4 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {values.map((item) => (
              <article key={item.title} className="rounded-lg border border-border bg-card p-6">
                <item.icon className="h-8 w-8 text-primary" />
                <h3 className="font-display text-xl mt-5">{item.title}</h3>
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{item.text}</p>
              </article>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default About;
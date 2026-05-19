import { Star, Clock, TrendingUp } from "lucide-react";

const Sidebar = () => {
  const relatedArticles = [
    { title: "10 labākie veiktspējas uzlabojumi 2024.", views: "12.5K" },
    { title: "Kā izvēlēties pareizo izplūdes sistēmu", views: "8.3K" },
    { title: "Bremžu apkores ceļvedis", views: "6.1K" },
    { title: "Piekares regulēšana trases dienām", views: "5.4K" },
  ];

  return (
    <aside className="bg-card border border-border rounded-lg p-6 space-y-8">
      {/* Related Articles */}
      <div>
        <h3 className="font-display text-lg mb-4 flex items-center gap-2">
          <Clock className="h-5 w-5 text-primary" />
          Saistītie raksti
        </h3>
        <ul className="space-y-4">
          {relatedArticles.map((article, index) => (
            <li key={index}>
              <a
                href="#"
                className="block group"
              >
                <p className="text-sm text-foreground group-hover:text-primary transition-colors line-clamp-2">
                  {article.title}
                </p>
                <span className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                  <Star className="h-3 w-3" />
                  {article.views} skatījumi
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>

      {/* Promo Banner */}
      <div className="bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/30 rounded-lg p-4 text-center">
        <p className="text-primary font-display text-lg">ĀTRAIS IZPĀRDOŠANA</p>
        <p className="text-sm text-muted-foreground mt-1">Līdz 40% atlaide sacīkšu detaļām</p>
        <a
          href="#"
          className="inline-block mt-3 px-4 py-2 bg-primary text-primary-foreground text-sm font-semibold rounded-md hover:bg-primary/90 transition-colors"
        >
          Iepērcies tagad
        </a>
      </div>
    </aside>
  );
};

export default Sidebar;

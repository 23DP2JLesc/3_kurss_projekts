import { useState, useEffect } from "react";
import { ExternalLink, Loader2, RefreshCw, AlertTriangle } from "lucide-react";
import { Button } from "./ui/button";

interface NewsArticle {
  title: string;
  description: string;
  url: string;
  urlToImage: string | null;
  publishedAt: string;
  source: {
    name: string;
  };
}

// Mock news data (since we can't use real API without key)
const mockNews: NewsArticle[] = [
  {
    title: "MotoGP 2024: Revolutionary Aerodynamic Innovations",
    description: "New carbon fiber fairings and winglet designs are pushing the boundaries of motorcycle racing performance.",
    url: "#",
    urlToImage: null,
    publishedAt: new Date().toISOString(),
    source: { name: "Racing Weekly" }
  },
  {
    title: "Electric Motorcycles Break Speed Records",
    description: "The latest electric superbikes are challenging traditional combustion engines in track performance.",
    url: "#",
    urlToImage: null,
    publishedAt: new Date(Date.now() - 86400000).toISOString(),
    source: { name: "Moto News" }
  },
  {
    title: "Suspension Technology: What's Next?",
    description: "Active suspension systems are becoming more accessible for everyday riders.",
    url: "#",
    urlToImage: null,
    publishedAt: new Date(Date.now() - 172800000).toISOString(),
    source: { name: "Tech Riders" }
  },
];

const NEWS_CACHE_KEY = "motoparts_news_cache";

const NewsSection = () => {
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNews = async () => {
    setLoading(true);
    setError(null);

    try {
      // Simulate API fetch delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, you would fetch from an API:
      // const response = await fetch('https://api.example.com/news?topic=motorcycle');
      // if (!response.ok) throw new Error('Failed to fetch news');
      // const data = await response.json();
      
      // Using mock data for demonstration
      setNews(mockNews);
      
      // Cache the results
      localStorage.setItem(NEWS_CACHE_KEY, JSON.stringify({
        data: mockNews,
        timestamp: Date.now()
      }));
    } catch (err) {
      setError("Unable to load news. Please try again later.");
      
      // Try to load from cache
      const cached = localStorage.getItem(NEWS_CACHE_KEY);
      if (cached) {
        const { data } = JSON.parse(cached);
        setNews(data);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Check cache first
    const cached = localStorage.getItem(NEWS_CACHE_KEY);
    if (cached) {
      const { data, timestamp } = JSON.parse(cached);
      // Use cache if less than 1 hour old
      if (Date.now() - timestamp < 3600000) {
        setNews(data);
        setLoading(false);
        return;
      }
    }
    
    fetchNews();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <section id="news" className="py-24 bg-card">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12">
          <div>
            <span className="text-primary uppercase tracking-wider text-sm font-medium">
              Stay Informed
            </span>
            <h2 className="font-display text-4xl md:text-5xl mt-2">Racing News</h2>
          </div>
          <Button
            variant="outline"
            onClick={fetchNews}
            disabled={loading}
            className="border-border hover:border-primary"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        <div className="glow-line mb-12" />

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-16">
            <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
            <p className="text-muted-foreground">Loading latest news...</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <AlertTriangle className="h-12 w-12 text-destructive mb-4" />
            <p className="text-destructive mb-4">{error}</p>
            <Button onClick={fetchNews} className="btn-racing">
              Try Again
            </Button>
          </div>
        )}

        {/* News Grid */}
        {!loading && news.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {news.map((article, index) => (
              <article
                key={index}
                className="card-racing overflow-hidden group animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Image Placeholder */}
                <div className="aspect-video bg-secondary relative overflow-hidden">
                  {article.urlToImage ? (
                    <img
                      src={article.urlToImage}
                      alt={article.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-transparent">
                      <span className="font-display text-4xl text-primary/50">NEWS</span>
                    </div>
                  )}
                  <div className="absolute top-3 left-3 px-2 py-1 bg-primary text-primary-foreground text-xs font-bold rounded">
                    {article.source.name}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <p className="text-xs text-muted-foreground mb-2">
                    {formatDate(article.publishedAt)}
                  </p>
                  <h3 className="font-display text-xl mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                    {article.title}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                    {article.description}
                  </p>
                  <a
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-primary text-sm font-medium hover:underline"
                  >
                    Read More
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* No News */}
        {!loading && !error && news.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No news available at the moment.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default NewsSection;

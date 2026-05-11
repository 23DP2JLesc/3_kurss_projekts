import Header from "@/components/Header";
import Hero from "@/components/Hero";
import FeaturedProducts from "@/components/FeaturedProducts";
import Sidebar from "@/components/Sidebar";
import SearchFilter from "@/components/SearchFilter";
import NewsSection from "@/components/NewsSection";
import ContactForm from "@/components/ContactForm";
import Newsletter from "@/components/Newsletter";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        
        {/* Main content with sidebar layout */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Main Content Area */}
              <div className="lg:col-span-3">
                <FeaturedProducts />
              </div>
              
              {/* Sidebar */}
              <aside className="lg:col-span-1">
                <Sidebar />
              </aside>
            </div>
          </div>
        </section>
        
        <SearchFilter />
        <NewsSection />
        <ContactForm />
        <Newsletter />
      </main>
      <Footer />
    </div>
  );
};

export default Index;

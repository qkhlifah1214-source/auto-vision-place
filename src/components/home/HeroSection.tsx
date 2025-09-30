import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

interface HeroSectionProps {
  isRTL: boolean;
}

const HeroSection = ({ isRTL }: HeroSectionProps) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");

  const heroSlides = [
    {
      id: 1,
      title: isRTL ? "ابحث عن سيارتك المثالية" : "Find Your Perfect Car",
      subtitle: isRTL ? "أفضل العروض والأسعار المنافسة" : "Best deals and competitive prices",
      image: "https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=1200&h=600&fit=crop",
      gradient: "from-primary/90 to-dark/80"
    },
    {
      id: 2,
      title: isRTL ? "بيع سيارتك بسهولة" : "Sell Your Car Easily",
      subtitle: isRTL ? "انشر إعلانك مجاناً واحصل على أفضل الصفقات" : "Post your ad for free and get the best deals",
      image: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=1200&h=600&fit=crop",
      gradient: "from-primary-hover/90 to-dark/80"
    },
    {
      id: 3,
      title: isRTL ? "تأجير السيارات" : "Car Rental",
      subtitle: isRTL ? "اختر من مجموعة واسعة من السيارات للتأجير" : "Choose from a wide range of cars for rent",
      image: "https://images.unsplash.com/photo-1502877338535-766e1452684a?w=1200&h=600&fit=crop",
      gradient: "from-primary-light/90 to-dark/80"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [heroSlides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  const handleSearch = () => {
    // Navigate to ads page with search query
    window.location.href = `/ads?search=${encodeURIComponent(searchQuery)}`;
  };

  return (
    <section className="relative h-[70vh] overflow-hidden">
      {/* Slide Images */}
      <div className="absolute inset-0">
        {heroSlides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
          >
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover"
            />
            <div className={`absolute inset-0 bg-gradient-to-r ${slide.gradient}`} />
          </div>
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 h-full flex items-center">
        <div className="max-w-2xl text-white">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">
            {heroSlides[currentSlide].title}
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90">
            {heroSlides[currentSlide].subtitle}
          </p>

          {/* Search Bar */}
          <div className="bg-white/95 backdrop-blur-sm rounded-xl p-6 shadow-2xl">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <Input
                  type="text"
                  placeholder={isRTL ? "ابحث عن سيارة..." : "Search for a car..."}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="text-lg py-3 border-0 focus:ring-2 focus:ring-primary"
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>
              <Button 
                onClick={handleSearch}
                className="btn-primary text-lg py-3 px-8"
              >
                <Search className="w-5 h-5 mr-2 rtl:ml-2 rtl:mr-0" />
                {isRTL ? "بحث" : "Search"}
              </Button>
            </div>
            
            <div className="flex flex-wrap gap-4 mt-4">
              <Link to="/ads?type=sale">
                <Button variant="outline" className="text-primary border-primary hover:bg-primary hover:text-white">
                  {isRTL ? "للبيع" : "For Sale"}
                </Button>
              </Link>
              <Link to="/ads?type=rent">
                <Button variant="outline" className="text-primary border-primary hover:bg-primary hover:text-white">
                  {isRTL ? "للتأجير" : "For Rent"}
                </Button>
              </Link>
              <Link to="/create-ad">
                <Button variant="outline" className="text-primary border-primary hover:bg-primary hover:text-white">
                  {isRTL ? "أضف إعلانك" : "Post Your Ad"}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 rtl:right-4 rtl:left-auto top-1/2 transform -translate-y-1/2 z-20 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-3 transition-all duration-300"
      >
        {isRTL ? <ChevronRight className="w-6 h-6 text-white" /> : <ChevronLeft className="w-6 h-6 text-white" />}
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 rtl:left-4 rtl:right-auto top-1/2 transform -translate-y-1/2 z-20 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-3 transition-all duration-300"
      >
        {isRTL ? <ChevronLeft className="w-6 h-6 text-white" /> : <ChevronRight className="w-6 h-6 text-white" />}
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-20 flex space-x-2 rtl:space-x-reverse">
        {heroSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide
                ? "bg-white"
                : "bg-white/50 hover:bg-white/70"
            }`}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroSection;
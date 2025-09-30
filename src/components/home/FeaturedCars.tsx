import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, Eye, Calendar, Fuel, Settings, MapPin, MessageCircle } from "lucide-react";

interface FeaturedCarsProps {
  isRTL: boolean;
}

const FeaturedCars = ({ isRTL }: FeaturedCarsProps) => {
  const [favorites, setFavorites] = useState<number[]>([]);

  // Sample data - will be replaced with real data from database
  const featuredCars = [
    {
      id: 1,
      title: isRTL ? "تويوتا كامري 2023" : "Toyota Camry 2023",
      price: "85,000",
      currency: isRTL ? "ريال" : "SAR",
      image: "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=400&h=300&fit=crop",
      location: isRTL ? "الرياض" : "Riyadh",
      year: "2023",
      fuel: isRTL ? "بنزين" : "Gasoline",
      transmission: isRTL ? "أوتوماتيك" : "Automatic",
      mileage: "15,000",
      type: "sale",
      featured: true,
      views: 156
    },
    {
      id: 2,
      title: isRTL ? "BMW X5 2022" : "BMW X5 2022",
      price: "180,000",
      currency: isRTL ? "ريال" : "SAR",
      image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400&h=300&fit=crop",
      location: isRTL ? "جدة" : "Jeddah",
      year: "2022",
      fuel: isRTL ? "بنزين" : "Gasoline",
      transmission: isRTL ? "أوتوماتيك" : "Automatic",
      mileage: "25,000",
      type: "sale",
      featured: true,
      views: 234
    },
    {
      id: 3,
      title: isRTL ? "مرسيدس C-Class 2023" : "Mercedes C-Class 2023",
      price: "250",
      currency: isRTL ? "ريال/يوم" : "SAR/day",
      image: "https://images.unsplash.com/photo-1563720223185-11003d516935?w=400&h=300&fit=crop",
      location: isRTL ? "الدمام" : "Dammam",
      year: "2023",
      fuel: isRTL ? "بنزين" : "Gasoline",
      transmission: isRTL ? "أوتوماتيك" : "Automatic",
      mileage: "8,000",
      type: "rent",
      featured: true,
      views: 89
    },
    {
      id: 4,
      title: isRTL ? "هوندا أكورد 2022" : "Honda Accord 2022",
      price: "72,000",
      currency: isRTL ? "ريال" : "SAR",
      image: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=400&h=300&fit=crop",
      location: isRTL ? "الرياض" : "Riyadh",
      year: "2022",
      fuel: isRTL ? "هايبرد" : "Hybrid",
      transmission: isRTL ? "أوتوماتيك" : "Automatic",
      mileage: "32,000",
      type: "sale",
      featured: true,
      views: 178
    }
  ];

  const toggleFavorite = (carId: number) => {
    setFavorites(prev => 
      prev.includes(carId)
        ? prev.filter(id => id !== carId)
        : [...prev, carId]
    );
  };

  const formatWhatsAppUrl = (carTitle: string) => {
    const message = encodeURIComponent(
      isRTL 
        ? `مرحباً، أهتم بهذه السيارة: ${carTitle}`
        : `Hello, I'm interested in this car: ${carTitle}`
    );
    return `https://wa.me/966501234567?text=${message}`;
  };

  return (
    <section className="py-16 bg-secondary/30">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-primary-hover bg-clip-text text-transparent">
            {isRTL ? "السيارات المميزة" : "Featured Cars"}
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            {isRTL 
              ? "اكتشف مجموعة مختارة من أفضل السيارات المتاحة للبيع والتأجير"
              : "Discover a curated selection of the best cars available for sale and rent"
            }
          </p>
        </div>

        {/* Cars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
          {featuredCars.map((car) => (
            <div key={car.id} className="car-card group">
              {/* Image Container */}
              <div className="relative overflow-hidden">
                <img
                  src={car.image}
                  alt={car.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                
                {/* Overlay Actions */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center space-x-2 rtl:space-x-reverse">
                  <Button
                    size="sm"
                    variant="secondary"
                    className="bg-white/90 text-dark hover:bg-white"
                    onClick={() => toggleFavorite(car.id)}
                  >
                    <Heart 
                      className={`w-4 h-4 ${favorites.includes(car.id) ? 'fill-red-500 text-red-500' : ''}`} 
                    />
                  </Button>
                  <Link to={`/car/${car.id}`}>
                    <Button size="sm" variant="secondary" className="bg-white/90 text-dark hover:bg-white">
                      <Eye className="w-4 h-4" />
                    </Button>
                  </Link>
                  <a href={formatWhatsAppUrl(car.title)} target="_blank" rel="noopener noreferrer">
                    <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white">
                      <MessageCircle className="w-4 h-4" />
                    </Button>
                  </a>
                </div>

                {/* Badges */}
                <div className="absolute top-3 left-3 rtl:right-3 rtl:left-auto flex flex-col gap-2">
                  {car.featured && (
                    <Badge className="bg-primary text-primary-foreground">
                      {isRTL ? "مميز" : "Featured"}
                    </Badge>
                  )}
                  <Badge variant={car.type === 'sale' ? 'default' : 'secondary'}>
                    {car.type === 'sale' 
                      ? (isRTL ? "للبيع" : "For Sale")
                      : (isRTL ? "للتأجير" : "For Rent")
                    }
                  </Badge>
                </div>

                {/* Views Counter */}
                <div className="absolute top-3 right-3 rtl:left-3 rtl:right-auto bg-black/60 text-white text-xs px-2 py-1 rounded-full flex items-center">
                  <Eye className="w-3 h-3 mr-1 rtl:ml-1 rtl:mr-0" />
                  {car.views}
                </div>
              </div>

              {/* Card Content */}
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-2 line-clamp-1">{car.title}</h3>
                
                {/* Price */}
                <div className="text-2xl font-bold text-primary mb-3">
                  {car.price} <span className="text-sm font-normal text-muted-foreground">{car.currency}</span>
                </div>

                {/* Car Details */}
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1 rtl:ml-1 rtl:mr-0" />
                      {car.year}
                    </div>
                    <div className="flex items-center">
                      <Fuel className="w-4 h-4 mr-1 rtl:ml-1 rtl:mr-0" />
                      {car.fuel}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Settings className="w-4 h-4 mr-1 rtl:ml-1 rtl:mr-0" />
                      {car.transmission}
                    </div>
                    <div className="text-xs">
                      {car.mileage} {isRTL ? "كم" : "km"}
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-1 rtl:ml-1 rtl:mr-0" />
                    {car.location}
                  </div>
                </div>

                {/* Action Button */}
                <Link to={`/car/${car.id}`} className="block mt-4">
                  <Button className="w-full btn-primary">
                    {isRTL ? "عرض التفاصيل" : "View Details"}
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center">
          <Link to="/ads">
            <Button className="btn-primary text-lg px-8 py-3">
              {isRTL ? "عرض جميع الإعلانات" : "View All Ads"}
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedCars;
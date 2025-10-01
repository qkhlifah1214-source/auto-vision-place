import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, MapPin, Calendar, Gauge, Fuel, Settings, Phone, Eye } from "lucide-react";
import { toast } from "sonner";

interface Car {
  id: string;
  title: string;
  description: string;
  price: number;
  year: number;
  mileage: number;
  fuel_type: string;
  transmission: string;
  color: string;
  city: string;
  images: string[];
  views: number;
  profiles: {
    full_name: string;
    phone: string;
  };
}

const CarDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [car, setCar] = useState<Car | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isRTL, setIsRTL] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user || null);
    });
  }, []);

  useEffect(() => {
    if (id) {
      fetchCar();
      incrementViews();
      if (user) checkFavorite();
    }
  }, [id, user]);

  const fetchCar = async () => {
    try {
      const { data, error } = await supabase
        .from("cars")
        .select(`
          *,
          profiles (full_name, phone)
        `)
        .eq("id", id)
        .single();

      if (error) throw error;
      setCar(data);
    } catch (error) {
      toast.error("فشل تحميل بيانات السيارة");
      navigate("/ads");
    } finally {
      setLoading(false);
    }
  };

  const incrementViews = async () => {
    await supabase.rpc("increment", {
      row_id: id,
    });
  };

  const checkFavorite = async () => {
    if (!user) return;
    const { data } = await supabase
      .from("favorites")
      .select("id")
      .eq("car_id", id)
      .eq("user_id", user.id)
      .maybeSingle();

    setIsFavorite(!!data);
  };

  const toggleFavorite = async () => {
    if (!user) {
      toast.error("يجب تسجيل الدخول أولاً");
      navigate("/auth");
      return;
    }

    try {
      if (isFavorite) {
        await supabase.from("favorites").delete().eq("car_id", id).eq("user_id", user.id);
        setIsFavorite(false);
        toast.success("تم الإزالة من المفضلة");
      } else {
        await supabase.from("favorites").insert({ car_id: id, user_id: user.id });
        setIsFavorite(true);
        toast.success("تم الإضافة للمفضلة");
      }
    } catch (error) {
      toast.error("حدث خطأ");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!car) return null;

  return (
    <div className="min-h-screen bg-background" dir={isRTL ? "rtl" : "ltr"}>
      <Header
        isRTL={isRTL}
        toggleLanguage={() => setIsRTL(!isRTL)}
        isDarkMode={isDarkMode}
        toggleTheme={() => setIsDarkMode(!isDarkMode)}
      />

      <main className="container mx-auto px-4 py-8 mt-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Image Gallery */}
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-0">
                <img
                  src={car.images[0] || "/placeholder.svg"}
                  alt={car.title}
                  className="w-full h-[400px] object-cover rounded-t-lg"
                />
                <div className="grid grid-cols-4 gap-2 p-4">
                  {car.images.slice(1, 5).map((img, index) => (
                    <img
                      key={index}
                      src={img}
                      alt={`${car.title} ${index + 2}`}
                      className="w-full h-24 object-cover rounded cursor-pointer hover:opacity-75 transition"
                    />
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="mt-6">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h1 className="text-3xl font-bold mb-2">{car.title}</h1>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      <span>{car.city}</span>
                      <Eye className="w-4 h-4 mr-4" />
                      <span>{car.views} مشاهدة</span>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" onClick={toggleFavorite}>
                    <Heart className={`w-6 h-6 ${isFavorite ? "fill-red-500 text-red-500" : ""}`} />
                  </Button>
                </div>

                <div className="text-4xl font-bold text-primary mb-6">
                  {car.price.toLocaleString()} ريال
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">السنة</p>
                      <p className="font-semibold">{car.year}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Gauge className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">الكيلومترات</p>
                      <p className="font-semibold">{car.mileage?.toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Fuel className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">نوع الوقود</p>
                      <p className="font-semibold">{car.fuel_type}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Settings className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">ناقل الحركة</p>
                      <p className="font-semibold">{car.transmission}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full border-2" style={{ backgroundColor: car.color }} />
                    <div>
                      <p className="text-sm text-muted-foreground">اللون</p>
                      <p className="font-semibold">{car.color}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">الوصف</h3>
                  <p className="text-muted-foreground">{car.description}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contact Card */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardContent className="p-6">
                <h3 className="font-semibold text-xl mb-4">معلومات البائع</h3>
                <div className="mb-4">
                  <p className="text-lg font-semibold">{car.profiles.full_name}</p>
                </div>
                {car.profiles.phone && (
                  <Button className="w-full" size="lg">
                    <Phone className="w-4 h-4 ml-2" />
                    {car.profiles.phone}
                  </Button>
                )}
                <Button variant="outline" className="w-full mt-2">
                  إرسال رسالة
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CarDetails;

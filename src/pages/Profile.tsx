import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Car, Heart, User, Plus } from "lucide-react";

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [myCars, setMyCars] = useState<any[]>([]);
  const [favorites, setFavorites] = useState<any[]>([]);
  const [isRTL, setIsRTL] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/auth");
      } else {
        setUser(session.user);
        fetchProfile(session.user.id);
        fetchMyCars(session.user.id);
        fetchFavorites(session.user.id);
      }
    });
  }, [navigate]);

  const fetchProfile = async (userId: string) => {
    const { data } = await supabase.from("profiles").select("*").eq("id", userId).single();
    setProfile(data);
  };

  const fetchMyCars = async (userId: string) => {
    const { data } = await supabase
      .from("cars")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
    setMyCars(data || []);
  };

  const fetchFavorites = async (userId: string) => {
    const { data } = await supabase
      .from("favorites")
      .select(`
        *,
        cars (*)
      `)
      .eq("user_id", userId);
    setFavorites(data || []);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("تم تسجيل الخروج بنجاح");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background" dir={isRTL ? "rtl" : "ltr"}>
      <Header
        isRTL={isRTL}
        toggleLanguage={() => setIsRTL(!isRTL)}
        isDarkMode={isDarkMode}
        toggleTheme={() => setIsDarkMode(!isDarkMode)}
      />

      <main className="container mx-auto px-4 py-8 mt-20">
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="w-10 h-10 text-primary" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold">{profile?.full_name || user?.email}</h1>
                  <p className="text-muted-foreground">{user?.email}</p>
                </div>
              </div>
              <Button variant="outline" onClick={handleLogout}>
                تسجيل الخروج
              </Button>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="my-ads" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="my-ads">
              <Car className="w-4 h-4 ml-2" />
              إعلاناتي ({myCars.length})
            </TabsTrigger>
            <TabsTrigger value="favorites">
              <Heart className="w-4 h-4 ml-2" />
              المفضلة ({favorites.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="my-ads" className="mt-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">إعلاناتي</h2>
              <Button onClick={() => navigate("/create-ad")}>
                <Plus className="w-4 h-4 ml-2" />
                إضافة إعلان
              </Button>
            </div>

            {myCars.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <Car className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-xl mb-2">لا توجد إعلانات</p>
                  <p className="text-muted-foreground mb-4">ابدأ بإضافة إعلانك الأول</p>
                  <Button onClick={() => navigate("/create-ad")}>إنشاء إعلان</Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {myCars.map((car) => (
                  <Card key={car.id} className="cursor-pointer hover:shadow-lg transition" onClick={() => navigate(`/car/${car.id}`)}>
                    <img src={car.images[0] || "/placeholder.svg"} alt={car.title} className="w-full h-48 object-cover rounded-t-lg" />
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-bold line-clamp-1">{car.title}</h3>
                        <Badge variant={car.status === "active" ? "default" : "secondary"}>
                          {car.status === "active" ? "نشط" : car.status === "sold" ? "مباع" : "معلق"}
                        </Badge>
                      </div>
                      <p className="text-xl font-bold text-primary">{car.price.toLocaleString()} ريال</p>
                      <p className="text-sm text-muted-foreground">{car.views} مشاهدة</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="favorites" className="mt-6">
            <h2 className="text-xl font-semibold mb-4">المفضلة</h2>

            {favorites.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <Heart className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-xl mb-2">لا توجد مفضلات</p>
                  <p className="text-muted-foreground mb-4">ابدأ بإضافة سيارات لقائمة المفضلة</p>
                  <Button onClick={() => navigate("/ads")}>تصفح الإعلانات</Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {favorites.map((fav) => (
                  <Card key={fav.id} className="cursor-pointer hover:shadow-lg transition" onClick={() => navigate(`/car/${fav.cars.id}`)}>
                    <img src={fav.cars.images[0] || "/placeholder.svg"} alt={fav.cars.title} className="w-full h-48 object-cover rounded-t-lg" />
                    <CardContent className="p-4">
                      <h3 className="font-bold line-clamp-1 mb-2">{fav.cars.title}</h3>
                      <p className="text-xl font-bold text-primary">{fav.cars.price.toLocaleString()} ريال</p>
                      <p className="text-sm text-muted-foreground">{fav.cars.city}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>

      <Footer isRTL={isRTL} />
    </div>
  );
};

export default Profile;

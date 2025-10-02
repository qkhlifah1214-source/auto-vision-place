import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/layout/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Car, Users, Heart, TrendingUp } from "lucide-react";

const Admin = () => {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ cars: 0, users: 0, favorites: 0 });
  const [cars, setCars] = useState<any[]>([]);
  const [isRTL, setIsRTL] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    checkAdmin();
  }, []);

  const checkAdmin = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      navigate("/auth");
      return;
    }

    const { data: roleData } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", session.user.id)
      .eq("role", "admin")
      .maybeSingle();

    if (!roleData) {
      toast.error("ليس لديك صلاحيات الدخول");
      navigate("/");
      return;
    }

    setIsAdmin(true);
    fetchStats();
    fetchCars();
    setLoading(false);
  };

  const fetchStats = async () => {
    const [carsCount, usersCount, favoritesCount] = await Promise.all([
      supabase.from("cars").select("*", { count: "exact", head: true }),
      supabase.from("profiles").select("*", { count: "exact", head: true }),
      supabase.from("favorites").select("*", { count: "exact", head: true }),
    ]);

    setStats({
      cars: carsCount.count || 0,
      users: usersCount.count || 0,
      favorites: favoritesCount.count || 0,
    });
  };

  const fetchCars = async () => {
    const { data } = await supabase
      .from("cars")
      .select(`
        *,
        profiles (full_name)
      `)
      .order("created_at", { ascending: false });
    setCars(data || []);
  };

  const updateCarStatus = async (carId: string, status: string) => {
    const { error } = await supabase.from("cars").update({ status }).eq("id", carId);
    
    if (error) {
      toast.error("حدث خطأ");
    } else {
      toast.success("تم تحديث الحالة");
      fetchCars();
    }
  };

  const toggleFeatured = async (carId: string, featured: boolean) => {
    const { error } = await supabase.from("cars").update({ featured: !featured }).eq("id", carId);
    
    if (error) {
      toast.error("حدث خطأ");
    } else {
      toast.success(featured ? "تم إلغاء التمييز" : "تم التمييز");
      fetchCars();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-background" dir={isRTL ? "rtl" : "ltr"}>
      <Header
        isRTL={isRTL}
        toggleLanguage={() => setIsRTL(!isRTL)}
        isDarkMode={isDarkMode}
        toggleTheme={() => setIsDarkMode(!isDarkMode)}
      />

      <main className="container mx-auto px-4 py-8 mt-20">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">لوحة التحكم</h1>
          <div className="flex gap-2 flex-wrap">
            <Button variant="outline" size="sm" onClick={() => navigate("/admin/sections")}>
              إدارة الأقسام
            </Button>
            <Button variant="outline" size="sm" onClick={() => navigate("/admin/categories")}>
              إدارة الفئات
            </Button>
            <Button variant="outline" size="sm" onClick={() => navigate("/admin/car-models")}>
              إدارة الموديلات
            </Button>
            <Button variant="outline" size="sm" onClick={() => navigate("/admin/users")}>
              إدارة المستخدمين
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">إجمالي السيارات</CardTitle>
              <Car className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.cars}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">المستخدمين</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.users}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">المفضلات</CardTitle>
              <Heart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.favorites}</div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>إدارة الإعلانات</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {cars.map((car) => (
                <div key={car.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <img src={car.images[0] || "/placeholder.svg"} alt={car.title} className="w-20 h-20 object-cover rounded" />
                    <div>
                      <h3 className="font-semibold">{car.title}</h3>
                      <p className="text-sm text-muted-foreground">البائع: {car.profiles.full_name}</p>
                      <p className="text-sm font-bold text-primary">{car.price.toLocaleString()} ريال</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Badge variant={car.status === "active" ? "default" : "secondary"}>
                      {car.status === "active" ? "نشط" : car.status === "sold" ? "مباع" : "معلق"}
                    </Badge>
                    
                    {car.featured && <Badge variant="default">مميز</Badge>}
                    
                    <Button size="sm" variant="outline" onClick={() => toggleFeatured(car.id, car.featured)}>
                      {car.featured ? "إلغاء التمييز" : "تمييز"}
                    </Button>
                    
                    <Button
                      size="sm"
                      variant={car.status === "active" ? "destructive" : "default"}
                      onClick={() => updateCarStatus(car.id, car.status === "active" ? "pending" : "active")}
                    >
                      {car.status === "active" ? "تعليق" : "تفعيل"}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Admin;

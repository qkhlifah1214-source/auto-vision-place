import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

const CreateAd = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [isRTL, setIsRTL] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    year: "",
    mileage: "",
    fuel_type: "بنزين",
    transmission: "أوتوماتيك",
    color: "",
    city: "",
    images: [] as string[],
  });

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        toast.error("يجب تسجيل الدخول أولاً");
        navigate("/auth");
      } else {
        setUser(session.user);
      }
    });
  }, [navigate]);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.from("cars").insert([
        {
          user_id: user.id,
          title: formData.title,
          description: formData.description,
          price: parseFloat(formData.price),
          year: parseInt(formData.year),
          mileage: parseInt(formData.mileage),
          fuel_type: formData.fuel_type,
          transmission: formData.transmission,
          color: formData.color,
          city: formData.city,
          images: formData.images.length > 0 ? formData.images : ["/placeholder.svg"],
          status: "active",
        },
      ]);

      if (error) throw error;

      toast.success("تم نشر الإعلان بنجاح!");
      navigate("/ads");
    } catch (error: any) {
      toast.error(error.message || "حدث خطأ أثناء نشر الإعلان");
    } finally {
      setLoading(false);
    }
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
        <Card className="max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle className="text-3xl">إنشاء إعلان جديد</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">عنوان الإعلان *</Label>
                <Input
                  id="title"
                  required
                  value={formData.title}
                  onChange={(e) => handleChange("title", e.target.value)}
                  placeholder="مثال: تويوتا كامري 2020"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">الوصف</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                  placeholder="اكتب وصف تفصيلي للسيارة..."
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">السعر (ريال) *</Label>
                  <Input
                    id="price"
                    type="number"
                    required
                    value={formData.price}
                    onChange={(e) => handleChange("price", e.target.value)}
                    placeholder="50000"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="year">سنة الصنع *</Label>
                  <Input
                    id="year"
                    type="number"
                    required
                    value={formData.year}
                    onChange={(e) => handleChange("year", e.target.value)}
                    placeholder="2020"
                    min="1950"
                    max={new Date().getFullYear() + 1}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="mileage">الكيلومترات *</Label>
                  <Input
                    id="mileage"
                    type="number"
                    required
                    value={formData.mileage}
                    onChange={(e) => handleChange("mileage", e.target.value)}
                    placeholder="50000"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="city">المدينة *</Label>
                  <Input
                    id="city"
                    required
                    value={formData.city}
                    onChange={(e) => handleChange("city", e.target.value)}
                    placeholder="الرياض"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fuel_type">نوع الوقود</Label>
                  <Select value={formData.fuel_type} onValueChange={(value) => handleChange("fuel_type", value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="بنزين">بنزين</SelectItem>
                      <SelectItem value="ديزل">ديزل</SelectItem>
                      <SelectItem value="كهرباء">كهرباء</SelectItem>
                      <SelectItem value="هايبرد">هايبرد</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="transmission">ناقل الحركة</Label>
                  <Select value={formData.transmission} onValueChange={(value) => handleChange("transmission", value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="أوتوماتيك">أوتوماتيك</SelectItem>
                      <SelectItem value="يدوي">يدوي</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="color">اللون</Label>
                  <Input
                    id="color"
                    value={formData.color}
                    onChange={(e) => handleChange("color", e.target.value)}
                    placeholder="أبيض"
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <Button type="submit" disabled={loading} className="flex-1">
                  {loading ? "جاري النشر..." : "نشر الإعلان"}
                </Button>
                <Button type="button" variant="outline" onClick={() => navigate("/ads")}>
                  إلغاء
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
};

export default CreateAd;

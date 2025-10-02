import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

const EditAd = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isRTL, setIsRTL] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    category_id: "",
    year: "",
    mileage: "",
    color: "",
    transmission: "",
    fuel_type: "",
    city: "",
  });

  useEffect(() => {
    fetchCategories();
    if (id) fetchCarData();
  }, [id]);

  const fetchCategories = async () => {
    const { data } = await supabase.from("categories").select("*");
    setCategories(data || []);
  };

  const fetchCarData = async () => {
    const { data } = await supabase.from("cars").select("*").eq("id", id).single();
    if (data) {
      setFormData({
        title: data.title,
        description: data.description || "",
        price: data.price.toString(),
        category_id: data.category_id || "",
        year: data.year.toString(),
        mileage: data.mileage?.toString() || "",
        color: data.color || "",
        transmission: data.transmission || "",
        fuel_type: data.fuel_type || "",
        city: data.city || "",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { error } = await supabase
      .from("cars")
      .update({
        title: formData.title,
        description: formData.description,
        price: parseFloat(formData.price),
        category_id: formData.category_id || null,
        year: parseInt(formData.year),
        mileage: formData.mileage ? parseInt(formData.mileage) : null,
        color: formData.color,
        transmission: formData.transmission,
        fuel_type: formData.fuel_type,
        city: formData.city,
      })
      .eq("id", id);

    if (error) {
      toast.error("حدث خطأ في تحديث الإعلان");
    } else {
      toast.success("تم تحديث الإعلان بنجاح");
      navigate("/profile");
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
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>تعديل الإعلان</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label>العنوان</Label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label>الوصف</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>السعر (ريال)</Label>
                  <Input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <Label>القسم</Label>
                  <Select value={formData.category_id} onValueChange={(value) => setFormData({ ...formData, category_id: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر القسم" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>
                          {cat.name_ar}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>السنة</Label>
                  <Input
                    type="number"
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <Label>الكيلومترات</Label>
                  <Input
                    type="number"
                    value={formData.mileage}
                    onChange={(e) => setFormData({ ...formData, mileage: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>اللون</Label>
                  <Input
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                  />
                </div>

                <div>
                  <Label>ناقل الحركة</Label>
                  <Select value={formData.transmission} onValueChange={(value) => setFormData({ ...formData, transmission: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر ناقل الحركة" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="automatic">أوتوماتيك</SelectItem>
                      <SelectItem value="manual">يدوي</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>نوع الوقود</Label>
                  <Select value={formData.fuel_type} onValueChange={(value) => setFormData({ ...formData, fuel_type: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر نوع الوقود" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="gasoline">بنزين</SelectItem>
                      <SelectItem value="diesel">ديزل</SelectItem>
                      <SelectItem value="hybrid">هايبرد</SelectItem>
                      <SelectItem value="electric">كهربائي</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>المدينة</Label>
                  <Input
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <Button type="submit" className="flex-1">حفظ التعديلات</Button>
                <Button type="button" variant="outline" onClick={() => navigate("/profile")}>
                  إلغاء
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>

      <Footer isRTL={isRTL} />
    </div>
  );
};

export default EditAd;
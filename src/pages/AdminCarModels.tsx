import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Plus, Pencil, Trash2 } from "lucide-react";

const AdminCarModels = () => {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [carModels, setCarModels] = useState<any[]>([]);
  const [isRTL, setIsRTL] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingModel, setEditingModel] = useState<any>(null);
  const [formData, setFormData] = useState({
    make: "",
    model: "",
    year: "",
  });

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
      .single();

    if (roleData?.role !== "admin") {
      navigate("/");
      return;
    }

    setIsAdmin(true);
    fetchCarModels();
  };

  const fetchCarModels = async () => {
    const { data } = await supabase
      .from("car_models")
      .select("*")
      .order("make", { ascending: true });
    setCarModels(data || []);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const dataToSubmit = {
      make: formData.make,
      model: formData.model,
      year: formData.year ? parseInt(formData.year) : null,
    };

    if (editingModel) {
      const { error } = await supabase
        .from("car_models")
        .update(dataToSubmit)
        .eq("id", editingModel.id);

      if (error) {
        toast.error("فشل تحديث الموديل");
      } else {
        toast.success("تم تحديث الموديل بنجاح");
        resetForm();
        fetchCarModels();
      }
    } else {
      const { error } = await supabase.from("car_models").insert(dataToSubmit);

      if (error) {
        toast.error("فشل إضافة الموديل");
      } else {
        toast.success("تم إضافة الموديل بنجاح");
        resetForm();
        fetchCarModels();
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذا الموديل؟")) return;

    const { error } = await supabase.from("car_models").delete().eq("id", id);

    if (error) {
      toast.error("فشل حذف الموديل");
    } else {
      toast.success("تم حذف الموديل بنجاح");
      fetchCarModels();
    }
  };

  const resetForm = () => {
    setFormData({ make: "", model: "", year: "" });
    setEditingModel(null);
    setDialogOpen(false);
  };

  const openEditDialog = (model: any) => {
    setEditingModel(model);
    setFormData({
      make: model.make,
      model: model.model,
      year: model.year?.toString() || "",
    });
    setDialogOpen(true);
  };

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
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">إدارة موديلات السيارات</h1>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => resetForm()}>
                <Plus className="w-4 h-4 ml-2" />
                إضافة موديل
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingModel ? "تعديل الموديل" : "إضافة موديل جديد"}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label>الشركة المصنعة</Label>
                  <Input
                    value={formData.make}
                    onChange={(e) => setFormData({ ...formData, make: e.target.value })}
                    placeholder="تويوتا، هوندا، مرسيدس..."
                    required
                  />
                </div>
                <div>
                  <Label>الموديل</Label>
                  <Input
                    value={formData.model}
                    onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                    placeholder="كامري، أكورد، E-Class..."
                    required
                  />
                </div>
                <div>
                  <Label>السنة (اختياري)</Label>
                  <Input
                    type="number"
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                    placeholder="2024"
                  />
                </div>
                <Button type="submit" className="w-full">
                  {editingModel ? "حفظ التعديلات" : "إضافة"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>جميع الموديلات ({carModels.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>الشركة المصنعة</TableHead>
                  <TableHead>الموديل</TableHead>
                  <TableHead>السنة</TableHead>
                  <TableHead>الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {carModels.map((model) => (
                  <TableRow key={model.id}>
                    <TableCell>{model.make}</TableCell>
                    <TableCell>{model.model}</TableCell>
                    <TableCell>{model.year || "-"}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => openEditDialog(model)}>
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => handleDelete(model.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>

      <Footer isRTL={isRTL} />
    </div>
  );
};

export default AdminCarModels;
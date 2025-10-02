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

const AdminSections = () => {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [sections, setSections] = useState<any[]>([]);
  const [isRTL, setIsRTL] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingSection, setEditingSection] = useState<any>(null);
  const [formData, setFormData] = useState({
    name_ar: "",
    name_en: "",
    icon: "",
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
    fetchSections();
  };

  const fetchSections = async () => {
    const { data } = await supabase
      .from("sections")
      .select("*")
      .order("created_at", { ascending: false });
    setSections(data || []);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (editingSection) {
      const { error } = await supabase
        .from("sections")
        .update(formData)
        .eq("id", editingSection.id);

      if (error) {
        toast.error("فشل تحديث القسم");
      } else {
        toast.success("تم تحديث القسم بنجاح");
        resetForm();
        fetchSections();
      }
    } else {
      const { error } = await supabase.from("sections").insert(formData);

      if (error) {
        toast.error("فشل إضافة القسم");
      } else {
        toast.success("تم إضافة القسم بنجاح");
        resetForm();
        fetchSections();
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذا القسم؟")) return;

    const { error } = await supabase.from("sections").delete().eq("id", id);

    if (error) {
      toast.error("فشل حذف القسم");
    } else {
      toast.success("تم حذف القسم بنجاح");
      fetchSections();
    }
  };

  const resetForm = () => {
    setFormData({ name_ar: "", name_en: "", icon: "" });
    setEditingSection(null);
    setDialogOpen(false);
  };

  const openEditDialog = (section: any) => {
    setEditingSection(section);
    setFormData({
      name_ar: section.name_ar,
      name_en: section.name_en,
      icon: section.icon || "",
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
          <h1 className="text-3xl font-bold">إدارة الأقسام</h1>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => resetForm()}>
                <Plus className="w-4 h-4 ml-2" />
                إضافة قسم
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingSection ? "تعديل القسم" : "إضافة قسم جديد"}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label>الاسم بالعربية</Label>
                  <Input
                    value={formData.name_ar}
                    onChange={(e) => setFormData({ ...formData, name_ar: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label>الاسم بالإنجليزية</Label>
                  <Input
                    value={formData.name_en}
                    onChange={(e) => setFormData({ ...formData, name_en: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label>الأيقونة</Label>
                  <Input
                    value={formData.icon}
                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                    placeholder="Car, Building, etc."
                  />
                </div>
                <Button type="submit" className="w-full">
                  {editingSection ? "حفظ التعديلات" : "إضافة"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>جميع الأقسام ({sections.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>الاسم بالعربية</TableHead>
                  <TableHead>الاسم بالإنجليزية</TableHead>
                  <TableHead>الأيقونة</TableHead>
                  <TableHead>الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sections.map((section) => (
                  <TableRow key={section.id}>
                    <TableCell>{section.name_ar}</TableCell>
                    <TableCell>{section.name_en}</TableCell>
                    <TableCell>{section.icon}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => openEditDialog(section)}>
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => handleDelete(section.id)}>
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

export default AdminSections;
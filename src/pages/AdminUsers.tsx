import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Shield, User } from "lucide-react";

const AdminUsers = () => {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [users, setUsers] = useState<any[]>([]);
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
      .single();

    if (roleData?.role !== "admin") {
      navigate("/");
      return;
    }

    setIsAdmin(true);
    fetchUsers();
  };

  const fetchUsers = async () => {
    const { data } = await supabase
      .from("profiles")
      .select(`
        *,
        user_roles (role)
      `)
      .order("created_at", { ascending: false });
    
    setUsers(data || []);
  };

  const toggleAdminRole = async (userId: string, currentRole: string) => {
    if (!confirm(`هل أنت متأكد من تغيير دور هذا المستخدم؟`)) return;

    if (currentRole === "admin") {
      const { error } = await supabase
        .from("user_roles")
        .delete()
        .eq("user_id", userId);

      if (error) {
        toast.error("فشل إزالة دور الأدمن");
      } else {
        toast.success("تم إزالة دور الأدمن بنجاح");
        fetchUsers();
      }
    } else {
      const { error } = await supabase
        .from("user_roles")
        .insert({ user_id: userId, role: "admin" });

      if (error) {
        toast.error("فشل إضافة دور الأدمن");
      } else {
        toast.success("تم إضافة دور الأدمن بنجاح");
        fetchUsers();
      }
    }
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
        <h1 className="text-3xl font-bold mb-6">إدارة المستخدمين</h1>

        <Card>
          <CardHeader>
            <CardTitle>جميع المستخدمين ({users.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>الاسم</TableHead>
                  <TableHead>المدينة</TableHead>
                  <TableHead>رقم الجوال</TableHead>
                  <TableHead>الدور</TableHead>
                  <TableHead>تاريخ التسجيل</TableHead>
                  <TableHead>الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => {
                  const role = user.user_roles?.[0]?.role || "user";
                  return (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.full_name}</TableCell>
                      <TableCell>{user.city || "-"}</TableCell>
                      <TableCell>{user.phone || "-"}</TableCell>
                      <TableCell>
                        <Badge variant={role === "admin" ? "default" : "secondary"}>
                          {role === "admin" ? (
                            <>
                              <Shield className="w-3 h-3 ml-1" />
                              أدمن
                            </>
                          ) : (
                            <>
                              <User className="w-3 h-3 ml-1" />
                              مستخدم
                            </>
                          )}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(user.created_at).toLocaleDateString("ar")}
                      </TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          variant={role === "admin" ? "destructive" : "default"}
                          onClick={() => toggleAdminRole(user.id, role)}
                        >
                          {role === "admin" ? "إزالة دور الأدمن" : "جعله أدمن"}
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>

      <Footer isRTL={isRTL} />
    </div>
  );
};

export default AdminUsers;
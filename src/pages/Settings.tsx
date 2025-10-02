import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { User, Lock } from "lucide-react";

const Settings = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [isRTL, setIsRTL] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [profileData, setProfileData] = useState({
    full_name: "",
    phone: "",
    city: "",
  });
  const [passwordData, setPasswordData] = useState({
    current: "",
    new: "",
    confirm: "",
  });

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/auth");
      } else {
        setUser(session.user);
        fetchProfile(session.user.id);
      }
    });
  }, [navigate]);

  const fetchProfile = async (userId: string) => {
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();
    
    if (data) {
      setProfile(data);
      setProfileData({
        full_name: data.full_name || "",
        phone: data.phone || "",
        city: data.city || "",
      });
    }
  };

  const updateProfile = async (e: React.FormEvent) => {
    e.preventDefault();

    const { error } = await supabase
      .from("profiles")
      .update(profileData)
      .eq("id", user.id);

    if (error) {
      toast.error("فشل تحديث البيانات");
    } else {
      toast.success("تم تحديث البيانات بنجاح");
      fetchProfile(user.id);
    }
  };

  const updatePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (passwordData.new !== passwordData.confirm) {
      toast.error("كلمة المرور الجديدة غير متطابقة");
      return;
    }

    const { error } = await supabase.auth.updateUser({
      password: passwordData.new,
    });

    if (error) {
      toast.error("فشل تحديث كلمة المرور");
    } else {
      toast.success("تم تحديث كلمة المرور بنجاح");
      setPasswordData({ current: "", new: "", confirm: "" });
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
        <h1 className="text-3xl font-bold mb-6">الإعدادات</h1>

        <Tabs defaultValue="profile" className="max-w-2xl">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="profile">
              <User className="w-4 h-4 ml-2" />
              البيانات الشخصية
            </TabsTrigger>
            <TabsTrigger value="password">
              <Lock className="w-4 h-4 ml-2" />
              كلمة المرور
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>تحديث البيانات الشخصية</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={updateProfile} className="space-y-4">
                  <div>
                    <Label>الاسم الكامل</Label>
                    <Input
                      value={profileData.full_name}
                      onChange={(e) =>
                        setProfileData({ ...profileData, full_name: e.target.value })
                      }
                    />
                  </div>

                  <div>
                    <Label>رقم الجوال</Label>
                    <Input
                      value={profileData.phone}
                      onChange={(e) =>
                        setProfileData({ ...profileData, phone: e.target.value })
                      }
                    />
                  </div>

                  <div>
                    <Label>المدينة</Label>
                    <Input
                      value={profileData.city}
                      onChange={(e) =>
                        setProfileData({ ...profileData, city: e.target.value })
                      }
                    />
                  </div>

                  <div>
                    <Label>البريد الإلكتروني</Label>
                    <Input value={user?.email} disabled />
                  </div>

                  <Button type="submit">حفظ التغييرات</Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="password">
            <Card>
              <CardHeader>
                <CardTitle>تغيير كلمة المرور</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={updatePassword} className="space-y-4">
                  <div>
                    <Label>كلمة المرور الجديدة</Label>
                    <Input
                      type="password"
                      value={passwordData.new}
                      onChange={(e) =>
                        setPasswordData({ ...passwordData, new: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div>
                    <Label>تأكيد كلمة المرور</Label>
                    <Input
                      type="password"
                      value={passwordData.confirm}
                      onChange={(e) =>
                        setPasswordData({ ...passwordData, confirm: e.target.value })
                      }
                      required
                    />
                  </div>

                  <Button type="submit">تحديث كلمة المرور</Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      <Footer isRTL={isRTL} />
    </div>
  );
};

export default Settings;
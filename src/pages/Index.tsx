import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/home/HeroSection";
import FeaturedCars from "@/components/home/FeaturedCars";

const Index = () => {
  const [isRTL, setIsRTL] = useState(true); // Default to Arabic
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Set document direction based on language
    document.documentElement.dir = isRTL ? "rtl" : "ltr";
    document.documentElement.lang = isRTL ? "ar" : "en";
  }, [isRTL]);

  const toggleLanguage = () => {
    setIsRTL(!isRTL);
  };

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header 
        isRTL={isRTL}
        toggleLanguage={toggleLanguage}
        isDarkMode={theme === "dark"}
        toggleTheme={toggleTheme}
      />
      
      <main>
        <HeroSection isRTL={isRTL} />
        <FeaturedCars isRTL={isRTL} />
      </main>
      
      <Footer isRTL={isRTL} />
    </div>
  );
};

export default Index;

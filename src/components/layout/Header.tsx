import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Car, 
  Menu, 
  X, 
  Sun, 
  Moon, 
  Globe, 
  Heart,
  User,
  LogOut,
  Settings
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

interface HeaderProps {
  isRTL: boolean;
  toggleLanguage: () => void;
  isDarkMode: boolean;
  toggleTheme: () => void;
}

const Header = ({ isRTL, toggleLanguage, isDarkMode, toggleTheme }: HeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // This will be connected to auth later
  const navigate = useNavigate();

  const menuItems = [
    { 
      name: isRTL ? "الرئيسية" : "Home", 
      path: "/",
      icon: Car
    },
    { 
      name: isRTL ? "جميع الإعلانات" : "All Ads", 
      path: "/ads",
      icon: Car
    },
    { 
      name: isRTL ? "إضافة إعلان" : "Post Ad", 
      path: "/create-ad",
      icon: Car
    },
  ];

  const handleAuthAction = () => {
    if (isLoggedIn) {
      setIsLoggedIn(false);
      navigate("/");
    } else {
      navigate("/auth");
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border/50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 rtl:space-x-reverse">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <Car className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-primary-hover bg-clip-text text-transparent">
              {isRTL ? "عربيتي" : "Arabity"}
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8 rtl:space-x-reverse">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="text-foreground hover:text-primary transition-colors duration-200 font-medium"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center space-x-4 rtl:space-x-reverse">
            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="hover:bg-secondary"
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </Button>

            {/* Language Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleLanguage}
              className="hover:bg-secondary"
            >
              <Globe className="w-5 h-5" />
            </Button>

            {/* User Menu */}
            {isLoggedIn ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="hover:bg-secondary">
                    <User className="w-5 h-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align={isRTL ? "start" : "end"}>
                  <DropdownMenuItem onClick={() => navigate("/favorites")}>
                    <Heart className="w-4 h-4 mr-2 rtl:ml-2 rtl:mr-0" />
                    {isRTL ? "المفضلة" : "Favorites"}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/profile")}>
                    <Settings className="w-4 h-4 mr-2 rtl:ml-2 rtl:mr-0" />
                    {isRTL ? "إعدادات الحساب" : "Profile Settings"}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleAuthAction} className="text-red-600">
                    <LogOut className="w-4 h-4 mr-2 rtl:ml-2 rtl:mr-0" />
                    {isRTL ? "تسجيل الخروج" : "Logout"}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button 
                onClick={handleAuthAction}
                className="btn-primary"
              >
                {isRTL ? "تسجيل الدخول" : "Login"}
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden py-4 border-t border-border/50">
            <nav className="flex flex-col space-y-4">
              {menuItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className="text-foreground hover:text-primary transition-colors duration-200 font-medium px-2 py-1"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              
              <div className="flex items-center justify-between pt-4 border-t border-border/50">
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleTheme}
                  >
                    {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleLanguage}
                  >
                    <Globe className="w-5 h-5" />
                  </Button>
                </div>
                
                <Button 
                  onClick={handleAuthAction}
                  className="btn-primary"
                >
                  {isLoggedIn ? (isRTL ? "تسجيل الخروج" : "Logout") : (isRTL ? "تسجيل الدخول" : "Login")}
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
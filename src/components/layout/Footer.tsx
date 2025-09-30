import { Link } from "react-router-dom";
import { Car, Heart, Mail, Phone, MapPin } from "lucide-react";

interface FooterProps {
  isRTL: boolean;
}

const Footer = ({ isRTL }: FooterProps) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-dark text-dark-foreground mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo & Description */}
          <div className="col-span-1 lg:col-span-2">
            <Link to="/" className="flex items-center space-x-2 rtl:space-x-reverse mb-4">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Car className="w-6 h-6 text-primary-foreground" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent">
                {isRTL ? "عربيتي" : "Arabity"}
              </span>
            </Link>
            <p className="text-gray-300 text-sm leading-relaxed max-w-md">
              {isRTL 
                ? "منصة رائدة لعرض وبيع وتأجير السيارات. نوفر لك أفضل الخيارات بأسعار منافسة وخدمة عملاء متميزة."
                : "Leading platform for displaying, selling and renting cars. We provide you with the best options at competitive prices and excellent customer service."
              }
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-primary">
              {isRTL ? "روابط سريعة" : "Quick Links"}
            </h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-primary transition-colors">
                  {isRTL ? "الرئيسية" : "Home"}
                </Link>
              </li>
              <li>
                <Link to="/ads" className="text-gray-300 hover:text-primary transition-colors">
                  {isRTL ? "جميع الإعلانات" : "All Ads"}
                </Link>
              </li>
              <li>
                <Link to="/create-ad" className="text-gray-300 hover:text-primary transition-colors">
                  {isRTL ? "إضافة إعلان" : "Post Ad"}
                </Link>
              </li>
              <li>
                <Link to="/favorites" className="text-gray-300 hover:text-primary transition-colors">
                  {isRTL ? "المفضلة" : "Favorites"}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-primary">
              {isRTL ? "تواصل معنا" : "Contact Us"}
            </h3>
            <ul className="space-y-3">
              <li className="flex items-center space-x-2 rtl:space-x-reverse text-gray-300">
                <Phone className="w-4 h-4 text-primary" />
                <span>+966 50 123 4567</span>
              </li>
              <li className="flex items-center space-x-2 rtl:space-x-reverse text-gray-300">
                <Mail className="w-4 h-4 text-primary" />
                <span>info@arabity.com</span>
              </li>
              <li className="flex items-center space-x-2 rtl:space-x-reverse text-gray-300">
                <MapPin className="w-4 h-4 text-primary" />
                <span>{isRTL ? "الرياض، المملكة العربية السعودية" : "Riyadh, Saudi Arabia"}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © {currentYear} {isRTL ? "عربيتي" : "Arabity"}. {isRTL ? "جميع الحقوق محفوظة" : "All rights reserved"}.
          </p>
          <div className="flex items-center space-x-4 rtl:space-x-reverse mt-4 md:mt-0">
            <span className="text-gray-400 text-sm flex items-center">
              {isRTL ? "صنع بـ" : "Made with"} <Heart className="w-4 h-4 text-red-500 mx-1" /> {isRTL ? "في المملكة العربية السعودية" : "in Saudi Arabia"}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
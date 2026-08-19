import { FaFacebookF, FaInstagram, FaTiktok, FaWhatsapp } from "react-icons/fa";

export const SOCIAL_LINKS = [
  {
    href: "https://www.tiktok.com/@ccristianojordan",
    icon: FaTiktok,
    className: "hover:text-teal-500",
  },
  {
    href: "https://www.instagram.com/ccristianojordan/",
    icon: FaInstagram,
    className: "hover:text-teal-500",
  },
  {
    href: "https://www.facebook.com/ccristianojordan",
    icon: FaFacebookF,
    className: "hover:text-teal-500",
  },
  {
    href: "https://wa.me/524425813349?text=¡Hola,%20buen%20día!%20😊",
    icon: FaWhatsapp,
    className: "hover:text-teal-500 transition-colors duration-300",
  },
];

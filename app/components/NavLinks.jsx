import Link from "next/link";
import { FaComments, FaUser, FaGift } from "react-icons/fa";

const links = [
  { href: "/chat", label: "Chat Assistant", icon: <FaComments className="mr-2" /> },
  { href: "/gift-ideas", label: "Gift Ideas", icon: <FaGift className="mr-2" /> },
  { href: "/profile", label: "My Profile", icon: <FaUser className="mr-2" /> },
];

const NavLinks = () => {
  return (
    <ul className="menu text-base-content space-y-2">
      {links.map((link) => {
        return (
          <li key={link.href}>
            <Link 
              href={link.href} 
              className="flex items-center py-3 px-4 rounded-lg hover:bg-base-200 transition-colors duration-200"
            >
              {link.icon}
              <span className="capitalize">{link.label}</span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
};

export default NavLinks;
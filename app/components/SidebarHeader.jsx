import ThemeToggle from "./ThemeToggle";
import { FaGift } from "react-icons/fa";
import Link from "next/link";

const SidebarHeader = () => {
  return (
    <div className="flex items-center mb-8 gap-4 px-4 py-2 border-b border-base-300 pb-4">
      <Link href="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center shadow-md">
          <FaGift className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-extrabold text-primary">
            <span className="bg-gradient-to-r from-pink-500 to-purple-600 text-transparent bg-clip-text">
              GIVORA
            </span>
          </h2>
          <p className="text-xs text-gray-600 dark:text-gray-400">Smart Gift Recommendations</p>
        </div>
      </Link>
      <ThemeToggle />
    </div>
  );
};

export default SidebarHeader;
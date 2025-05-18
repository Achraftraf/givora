"use client";

import SidebarHeader from "./SidebarHeader";
import NavLinks from "./NavLinks";
import MemberProfile from "./MemberProfile";
import { motion } from "framer-motion";


const Sidebar = () => {
  return (
    <motion.div 
      initial={{ x: -300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="px-4 w-80 min-h-full bg-base-200 dark:bg-gray-800 py-8 grid grid-rows-[auto,1fr,auto] shadow-lg"
    >
      {/* Header row */}
      <SidebarHeader />
      
      {/* Navigation links row */}
      <div className="mb-auto">
        <h3 className="text-xs uppercase font-bold text-gray-500 dark:text-gray-400 tracking-wider mb-3 px-4">Navigation</h3>
        <NavLinks />
      </div>
      
      {/* User profile row */}
      <div className="pt-6 mt-6 border-t border-base-300">
        <MemberProfile />
      </div>
    </motion.div>
  );
};

export default Sidebar;
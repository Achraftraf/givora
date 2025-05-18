"use client";
import { UserButton, useUser } from "@clerk/nextjs";
import { useState, useEffect } from "react";
import { FaUserCircle } from "react-icons/fa";

const MemberProfile = () => {
  const { user, isLoaded, isSignedIn } = useUser();
  const [mounted, setMounted] = useState(false);

  // Handle mounting state to prevent hydration errors
  useEffect(() => {
    setMounted(true);
  }, []);

  // Show skeleton loader during loading state
  if (!mounted || !isLoaded) {
    return (
      <div className="px-4 py-3 flex items-center gap-3 bg-base-200/50 rounded-lg animate-pulse">
        <div className="w-10 h-10 rounded-full bg-base-300"></div>
        <div className="h-4 w-32 bg-base-300 rounded"></div>
      </div>
    );
  }

  // Return nothing if not signed in
  if (!isSignedIn) {
    return null;
  }

  // Get user's name or email
  const displayName = user?.fullName || user?.emailAddresses[0]?.emailAddress || "Member";
  const userInitial = displayName.charAt(0).toUpperCase();

  return (
    <div className="px-4 py-3 flex items-center gap-3 bg-base-200/50 rounded-lg">
      <UserButton 
        afterSignOutUrl="/"
        appearance={{
          elements: {
            userButtonAvatarBox: "w-10 h-10"
          }
        }}
        fallbackContent={userInitial}
      />
      <div className="flex flex-col">
        <p className="font-medium text-sm">{displayName}</p>
        <span className="text-xs text-gray-500 dark:text-gray-400">Premium Member</span>
      </div>
    </div>
  );
};

export default MemberProfile;
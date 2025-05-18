import GiftIdea from "../../../components/GiftIdea";

import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

export const metadata = {
  title: "GIVORA - Personalized Gift Recommendations",
  description: "Get thoughtful, personalized gift ideas for any occasion with GIVORA.",
};

export default async function GivoraPage() {
  // Check if user is authenticated
  const { userId } = auth();
  
  // Redirect to login if not authenticated
  if (!userId) {
    redirect("/sign-in");
  }
  
  // Initialize query client
  const queryClient = new QueryClient();
  
  return (
    <div className="bg-gradient-to-b from-purple-50 to-pink-50 dark:from-gray-900 dark:to-purple-900 min-h-screen py-8">
      <HydrationBoundary state={dehydrate(queryClient)}>
        <GiftIdea />
      </HydrationBoundary>
    </div>
  );
}
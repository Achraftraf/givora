import GiftIdea from "../../components/GiftIdea";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
export default async function GivoraPage() {
  const queryClient = new QueryClient();
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <GiftIdea />
    </HydrationBoundary>
  );
}
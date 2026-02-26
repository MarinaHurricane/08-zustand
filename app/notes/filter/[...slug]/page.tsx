import { fetchNotes } from "@/lib/api";
import {
  QueryClient,
  dehydrate,
  HydrationBoundary,
} from "@tanstack/react-query";
import NotesClient from "./Notes.client";
import { Metadata } from "next";

interface NoteListProps {
  params: Promise<{ slug: string[] }>;
  searchParams: Promise<{ page?: string; query?: string }>;
}

export async function generateMetadata({
  params,
  searchParams,
}: NoteListProps): Promise<Metadata> {
  const { slug } = await params;
  const { page, query } = await searchParams;
  const tag = slug?.[0];
  const searchQuery = query ? query : "";

  return {
    title: searchQuery
      ? `Results for "${searchQuery}" in ${tag ?? "all"} notes`
      : `Notes in ${tag ?? "all"} category`,
    description: searchQuery
      ? `Browse notes matching "${searchQuery}" in the ${tag ?? "all"} category.`
      : `Browse all notes in the ${tag ?? "all"} category.`,
    openGraph: {
      url: "https://vercel.com/marynas-projects-3f5c6324/08-zustand",
      title: "Notes App",
      description: "App for creating and managing notes",
      siteName: "Notes App",
      images: [
        {
          url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
          width: 600,
          height: 300,
          alt: "Notes App preview image",
        },
      ],
    },
  };
}

export default async function Notelist({
  params,
  searchParams,
}: NoteListProps) {
  const { slug } = await params;
  const { page, query } = await searchParams;

  const tag = slug?.[0];
  const currentPage = Number(page ?? 1);
  const searchQuery = query ?? "";

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["notes", currentPage, searchQuery, tag],
    queryFn: () =>
      fetchNotes(
        currentPage,
        searchQuery,
        !tag || tag === "all" ? undefined : tag,
      ),
  });

  return (
    <>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <NotesClient tag={tag} />
      </HydrationBoundary>
    </>
  );
}

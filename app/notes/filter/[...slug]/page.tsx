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

// export async function generateMetadata({
//   params,
//   searchParams,
// }: NoteListProps): Promise<Metadata> {
//   const { slug } = await params;
//   const { page, query } = await searchParams;
//   const tag = slug?.[0];
//   const searchQuery = query ? query : "";

//   return {
//     title: searchQuery
//       ? `Results for "${searchQuery}" in ${tag ?? "all"} notes`
//       : `Notes in ${tag ?? "all"} category`,
//     description: searchQuery
//       ? `Browse notes matching "${searchQuery}" in the ${tag ?? "all"} category.`
//       : `Browse all notes in the ${tag ?? "all"} category.`,
//     openGraph: {
//       url: `https://08-zustand-kf5mmf8bz-marynas-projects-3f5c6324.vercel.app/notes/filter/${tag ?? "all"}${searchQuery ? '?query=' + encodeURIComponent(searchQuery) : ''}`,
// }`,
//       title: searchQuery
//       ? `Results for "${searchQuery}" in ${tag ?? "all"} notes`
//       : `Notes in ${tag ?? "all"} category`,
//       description: searchQuery
//       ? `Browse notes matching "${searchQuery}" in the ${tag ?? "all"} category.`
//       : `Browse all notes in the ${tag ?? "all"} category.`,
//       siteName: "Notes App",
//       images: [
//         {
//           url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
//           width: 600,
//           height: 300,
//           alt: "Notes App preview image",
//         },
//       ],
//     },
//   };
// }

// export async function generateMetadata({
//   params,
//   searchParams,
// }: NoteListProps): Promise<Metadata> {
//   const { slug } = await params;          
//   const { page, query } = await searchParams; 
//   const tag = slug?.[0];
//   const searchQuery = query ?? "";

//   const url = `https://08-zustand-kf5mmf8bz-marynas-projects-3f5c6324.vercel.app/notes/filter/${tag ?? "all"}${searchQuery ? '?query=' + encodeURIComponent(searchQuery) : ''}`;

//   const title = searchQuery
//     ? `Results for "${searchQuery}" in ${tag ?? "all"} notes`
//     : `Notes in ${tag ?? "all"} category`;

//   const description = searchQuery
//     ? `Browse notes matching "${searchQuery}" in the ${tag ?? "all"} category.`
//     : `Browse all notes in the ${tag ?? "all"} category.`;

//   return {
//     title,
//     description,
//     openGraph: {
//       url,
//       title,
//       description,
//       siteName: "Notes App",
//       images: [
//         {
//           url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
//           width: 600,
//           height: 300,
//           alt: "Notes App preview image",
//         },
//       ],
//     },
//   };
// }

export async function generateMetadata({
  params
}: NoteListProps): Promise<Metadata> {
  const { slug } = await params;          
  const tag = slug?.[0];

  // Build URL using only the tag
  const url = `https://08-zustand-kf5mmf8bz-marynas-projects-3f5c6324.vercel.app/notes/filter/${tag ?? "all"}`;

  // Titles and descriptions also depend only on the tag
  const title = `Notes in ${tag ?? "all"} category`;
  const description = `Browse all notes in the ${tag ?? "all"} category.`;

  return {
    title,
    description,
    openGraph: {
      url,
      title,
      description,
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

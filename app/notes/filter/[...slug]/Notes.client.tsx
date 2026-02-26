"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { fetchNotes } from "@/lib/api";
import css from "./notes.module.css";
// import { useMutation } from "@tanstack/react-query";
// import { deleteNote } from "@/lib/api";
// import { useQueryClient } from "@tanstack/react-query";
import Pagination from "@/components/Pagination/Pagination";
import { useState } from "react";
import SearchBox from "@/components/SearchBox/SearchBox";
import { useDebouncedCallback } from "use-debounce";
import NoteList from "@/components/NoteList/NoteList";
// import { useRouter } from "next/navigation";
import Link from "next/link";

interface NotesClientProps {
  tag: string;
}

export default function NotesClient({ tag }: NotesClientProps) {
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");

  const { data } = useQuery({
    queryKey: ["notes", page, query, tag],
    queryFn: () => fetchNotes(page, query, tag === 'all' ? undefined : tag),
    placeholderData: keepPreviousData,
    // refetchOnMount: false,
  });

  const notes = data?.notes || [];
  console.log(data);
  console.log(tag);
  const totalPages = data?.totalPages || 0;

  // const router = useRouter();

  const handleSearch = (newQuery: string) => {
    setQuery(newQuery);
    setPage(1);
    // if (newQuery) {
    //   router.push(`?query=${newQuery}`);
    // } else {
    //   router.push(window.location.pathname);
    // }
  };

  const debouncedSetQuery = useDebouncedCallback(handleSearch, 500);

  // const queryClient = useQueryClient();

  // const { mutate } = useMutation({
  //   mutationFn: deleteNote,
  //   onSuccess() {
  //     queryClient.invalidateQueries({ queryKey: ["notes"] });
  //   },
  //   onError(error) {
  //     console.log(error);
  //   },
  // });

  return (
    <div className={css.notesContainer}>
      <div className={css.toolbar}>
        <SearchBox onSearch={debouncedSetQuery} />
        {totalPages > 1 && (
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        )}
        <Link href="/notes/action/create">
          <button className={css.createButton}>Create note +</button>
        </Link>
      </div>
      {notes.length > 0 && <NoteList notes={notes} />}
      {notes.length === 0 && <p>No notes found.</p>}
    </div>
  );
}

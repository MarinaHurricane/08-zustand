"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { fetchNotes } from "@/lib/api";
import css from "./notes.module.css";
import Pagination from "@/components/Pagination/Pagination";
import { useState } from "react";
import SearchBox from "@/components/SearchBox/SearchBox";
import { useDebouncedCallback } from "use-debounce";
import NoteList from "@/components/NoteList/NoteList";
import Link from "next/link";

interface NotesClientProps {
  tag: string;
}

export default function NotesClient({ tag }: NotesClientProps) {
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");

  const { data } = useQuery({
    queryKey: ["notes", page, query, tag],
    queryFn: () => fetchNotes(page, query, tag === "all" ? undefined : tag),
    placeholderData: keepPreviousData,
  });

  const notes = data?.notes || [];
  console.log(data);
  console.log(tag);
  const totalPages = data?.totalPages || 0;

  const handleSearch = (newQuery: string) => {
    setQuery(newQuery);
    setPage(1);
  };

  const debouncedSetQuery = useDebouncedCallback(handleSearch, 500);

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

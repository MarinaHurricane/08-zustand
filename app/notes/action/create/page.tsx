import css from "./CreateNote.module.css";
import NoteForm from "@/components/NoteForm/NoteForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "New Note Form",
  description: "Form for creating a new note",
  openGraph: {
    url: "https://vercel.com/marynas-projects-3f5c6324/08-zustand",
    title: "New Note Form",
    description: "Form for creating a new note",
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

export default function createNote() {
  return (
    <main className={css.main}>
      <div className={css.container}>
        <h1 className={css.title}>Create note</h1>
        <NoteForm />
      </div>
    </main>
  );
}

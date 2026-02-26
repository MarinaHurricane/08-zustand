"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import css from "./NoteForm.module.css";
import { createNote } from "@/lib/api";
import * as Yup from "yup";
import { useRouter } from "next/navigation";
import { useNoteDraftStore } from "@/lib/stores/noteStore";
// import { Note } from "@/types/note";

// const NoteFormSchema = Yup.object().shape({
//   title: Yup.string()
//     .min(3, "Too short!")
//     .max(50, "Too long!")
//     .required("Title is required!"),
//   content: Yup.string().max(500, "Content can't be longer than 500 symbols..."),
//   tag: Yup.string()
//     .oneOf(["Todo", "Work", "Personal", "Meeting", "Shopping"])
//     .required(),
// });

// interface NoteFormValues {
//   title: string;
//   content: string;
//   tag: "Todo" | "Work" | "Personal" | "Meeting" | "Shopping";
// }

// const initialFormValues: NoteFormValues = {
//   title: "",
//   content: "",
//   tag: "Todo",
// };

// interface NoteFormProps {
//   onClose: () => void;
// }

export default function NoteForm() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { draft, setDraft, clearDraft } = useNoteDraftStore();
  const handleChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    setDraft({ ...draft, [event.target.name]: event.target.value });
  };

  const { mutate } = useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      clearDraft();
      router.push("/notes/filter/all");
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
    onError(error) {
      console.log(error);
    },
  });

  const handleCancel = () => router.push("/notes/filter/all");

  //   const handleSubmit = (formData: FormData) => {
  //   mutate( {
  //      title: formData.get("title") as string,
  //       content: formData.get("content") as string,
  //       tag: formData.get("tag") as string,
  //    });
  //  console.log();
  // };

  // const handleSubmit = (formData: FormData) => {
  //   const title = formData.get("title") as string;
  //   const content = formData.get("content") as string;
  //   const tag = formData.get("tag") as string;

  //   if (!title || title.trim().length < 3) {
  //     alert("Title must be at least 3 characters");
  //     return;
  //   }

  //   if (content.length > 500) {
  //     alert("Content must be less than 500 characters");
  //     return;
  //   }

  //   if (!tag) {
  //     alert("Please select a tag");
  //     return;
  //   }

  //   mutate({ title, content, tag });
  // };

  const handleSubmit = (formData: FormData) => {
    const title = (formData.get("title") as string)?.trim();
    const content = (formData.get("content") as string) || "";
    const tag = formData.get("tag") as string;

    const allowedTags = ["Todo", "Work", "Personal", "Meeting", "Shopping"];

    if (!title || title.length < 3 || title.length > 50) {
      alert("Title must be between 3 and 50 characters");
      return;
    }

    if (content.length > 500) {
      alert("Content can't be longer than 500 symbols...");
      return;
    }

    if (!tag || !allowedTags.includes(tag)) {
      alert("Invalid tag selected");
      return;
    }

    mutate({ title, content, tag });
  };

  return (
    <form className={css.form} action={handleSubmit}>
      <div className={css.formGroup}>
        <label htmlFor="title">Title</label>
        <input
          id="title"
          type="text"
          name="title"
          className={css.input}
          defaultValue={draft?.title}
          onChange={handleChange}
        />
        <span className={css.error} />
      </div>

      <div className={css.formGroup}>
        <label htmlFor="content">Content</label>
        <textarea
          id="content"
          name="content"
          rows={8}
          className={css.textarea}
          defaultValue={draft?.content}
          onChange={handleChange}
        />
        <span className={css.error} />
      </div>

      <div className={css.formGroup}>
        <label htmlFor="tag">Tag</label>
        <select
          id="tag"
          name="tag"
          className={css.select}
          value={draft?.tag || "Todo"}
          onChange={handleChange}
        >
          <option value="Todo">Todo</option>
          <option value="Work">Work</option>
          <option value="Personal">Personal</option>
          <option value="Meeting">Meeting</option>
          <option value="Shopping">Shopping</option>
        </select>
        <span className={css.error} />
      </div>

      <div className={css.actions}>
        <button
          type="button"
          className={css.cancelButton}
          onClick={handleCancel}
        >
          Cancel
        </button>
        <button type="submit" className={css.submitButton} disabled={false}>
          Create note
        </button>
      </div>
    </form>
  );
}

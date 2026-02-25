"use client";

import css from "./Modal.module.css";
import { useEffect } from "react";

import { createPortal } from "react-dom";

type Props = {
  children: React.ReactNode;
  onClose: () => void;
};

const Modal = ({ children, onClose }: Props) => {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Escape") {
        onClose();
      }
    };
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  return createPortal(
    <div
      className={css.backdrop}
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div className={css.modal} onClick={(e) => e.stopPropagation()}>
        {children}
        <button className={css.backBtn} onClick={onClose}>
          Close
        </button>
      </div>
    </div>,
    document.body,
  );
};

export default Modal;

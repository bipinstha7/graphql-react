import React from "react";

import "./styles.css";

export default function Modal(props) {
  const {
    title,
    canCancel,
    canConfirm,
    onCancel,
    onConfirm,
    confirmText,
    children,
  } = props;
  return (
    <div className="modal">
      <header className="modal__header">
        <h1>{title}</h1>
      </header>
      <section className="modal__content">{children}</section>
      <section className="modal__actions">
        {canCancel ? (
          <button className="btn" onClick={onCancel}>
            Cancel
          </button>
        ) : null}
        {canConfirm ? (
          <button className="btn" onClick={onConfirm}>
            {confirmText}
          </button>
        ) : null}
      </section>
    </div>
  );
}

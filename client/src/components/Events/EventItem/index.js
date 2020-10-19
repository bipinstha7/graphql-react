import React, { useState } from "react";

import "./styles.css";
import Modal from "components/Modal";
import Backdrop from "components/Backdrop";
import { getLocalStorage } from "utils/local-storage";

const showDate = date => {
  return new Date(+date).toLocaleDateString();
};

export default function EventItem({ event }) {
  const id = getLocalStorage()?.id;
  const { title, description, price, date, creator } = event;
  const [detailsModal, setDetailsModal] = useState(false);

  const showDetails = () => {
    setDetailsModal(modal => !modal);
  };

  const bookEvent = () => {};

  return (
    <>
      {detailsModal ? (
        <>
          <Backdrop />
          <Modal
            canCancel
            canConfirm
            onCancel={showDetails}
            onConfirm={bookEvent}
            confirmText="Book"
          >
            <h1>{title}</h1>
            <h2>
              Rs {price} - {showDate(date)}
            </h2>
            <p>{description}</p>
          </Modal>
        </>
      ) : null}
      <li className="event__list__item">
        <div>
          <h1>{title}</h1>
          <h2>
            Rs {price} - {showDate(date)}
          </h2>
        </div>
        <div>
          {creator._id} - {id}
          {creator._id === id ? (
            <button className="btn" onClick={showDetails}>
              View Details
            </button>
          ) : null}
          <p>{creator.email}</p>
        </div>
      </li>
    </>
  );
}

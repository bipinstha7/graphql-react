import React, { useState } from "react";
import { useHistory } from "react-router-dom";

import "./styles.css";
import Modal from "components/Modal";
import Backdrop from "components/Backdrop";
import { getLocalStorage } from "utils/local-storage";

const showDate = date => {
  return new Date(+date).toLocaleDateString();
};

export default function EventItem({ event }) {
  const localData = getLocalStorage() || {};
  const { id, token } = localData;
  const history = useHistory();
  const { title, description, price, date, creator } = event;
  const [detailsModal, setDetailsModal] = useState(false);
  const [error, setError] = useState("");

  const showDetails = () => {
    setDetailsModal(modal => !modal);
  };

  const bookEvent = async () => {
    const payload = {
      query: `
          mutation {
            bookEvent(eventId: "${event._id}") {
              _id
              createdAt
              updatedAt
            }
          }
        `,
    };

    try {
      let res = await fetch("http://localhost:5000/api/graphql/v1", {
        method: "POST",
        body: JSON.stringify(payload),
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      });

      res = await res.json();

      if (res.errors) {
        throw res.errors[0].message;
      }

      console.log({ res });

      history.push("/bookings");
    } catch (error) {
      console.log({ onSubmitError: error });
      setError(error);
    }
  };

  return (
    <>
      {detailsModal ? (
        <>
          <Backdrop />
          <Modal
            canCancel
            canConfirm={token}
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
          {creator._id !== id ? (
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

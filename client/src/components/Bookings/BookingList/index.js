import React from "react";

import "./styles.css";
import { getLocalStorage } from "utils/local-storage";

export default function BookingList({ state, setState }) {
  const { bookings } = state;
  const token = getLocalStorage()?.token;

  const cancelBooking = async bookingId => {
    const payload = {
      query: `
        mutation {
          cancelBooking(bookingId: "${bookingId}") {
            _id
            event {
              title
            }
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

      console.log({ res });

      if (res.errors) {
        throw res.errors[0];
      }

      const data = bookings.filter(booking => booking._id !== bookingId);
      setState({ ...state, bookings: data });
    } catch (error) {
      console.log({ onSubmitError: error });
    }
  };

  return (
    <ul className="bookings__list">
      {bookings.map(booking => (
        <li key={booking._id} className="bookings__item">
          <div className="bookings__item-data">
            {booking.event.title} -
            {new Date(+booking.createdAt).toLocaleDateString()}
          </div>
          <div className="bookings__item-actions">
            <button className="btn" onClick={() => cancelBooking(booking._id)}>
              Cancel
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}

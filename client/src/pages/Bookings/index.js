import React, { useEffect, useState } from "react";

import { getLocalStorage } from "utils/local-storage";

export default function Bookings() {
  const token = getLocalStorage()?.token;
  const [state, setState] = useState({
    isLoading: false,
    bookings: [],
  });
  const { isLoading, bookings } = state;

  useEffect(() => {
    let isMounted = true;

    async function fetchBookings() {
      const payload = {
        query: `
              query {
                bookings {
                  _id
                  createdAt
                  updatedAt
                  event {
                    _id
                    title
                    date
                  }
                }
              }
            `,
      };

      try {
        setState(state => ({ ...state, isLoading: true }));
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

        if (isMounted) {
          setState(state => ({
            ...state,
            isLoading: false,
            bookings: res.data.bookings,
          }));
        }
      } catch (error) {
        if (isMounted) {
          setState(state => ({ ...state, isLoading: false }));
        }
        console.log({ onSubmitError: error });
      }
    }

    fetchBookings();

    return () => (isMounted = false);
  }, [token]);

  if (isLoading) return "Loading...";

  return (
    <ul>
      {bookings.map(booking => (
        <li key={booking._id}>
          {booking.event.title} -
          {new Date(+booking.createdAt).toLocaleDateString()}
        </li>
      ))}
    </ul>
  );
}

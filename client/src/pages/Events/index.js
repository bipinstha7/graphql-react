import React, { useState, useEffect, useCallback } from "react";

import "./styles.css";
import Modal from "components/Modal";
import Backdrop from "components/Backdrop";
import EventList from "components/Events/EventList";
import { getLocalStorage } from "utils/local-storage";

export default function Events() {
  const token = getLocalStorage()?.token;
  const [state, setState] = useState({
    isLoading: false,
    modal: false,
    title: "",
    price: "",
    date: "",
    description: "",
    events: [],
    error: "",
  });
  const {
    modal,
    title,
    price,
    date,
    description,
    events,
    isLoading,
    error,
  } = state;

  const fetchEvents = useCallback(async () => {
    /**
     * we should use axios or similar kind of mudule to get the data
     * but I want to use fetch here for the simplicity or I guess I'm lazy enough
     * to type npm i axios/other_package :)
     */

    const payload = {
      query: `
            query {
              events {
                _id
                title
                price
                date
                description
                creator {
                  _id
                  email
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
        },
      });

      res = await res.json();

      console.log({ res });

      if (res.errors) {
        throw res.errors[0];
      }

      setState(state => ({
        ...state,
        isLoading: false,
        events: res.data.events,
      }));
    } catch (error) {
      setState(state => ({ ...state, isLoading: false }));
      console.log({ onSubmitError: error });
    }
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const showModal = () => {
    setState(state => ({ ...state, modal: !state.modal }));
  };

  const handleChange = e => {
    setState({ ...state, [e.target.name]: e.target.value });
  };

  const handleConfirm = async () => {
    if (!title || !price || !date || !description) return;

    /**
     * we should use axios or similar kind of mudule to get the data
     * but I want to use fetch here for the simplicity or I guess I'm lazy enough
     * to type npm i axios/other_package :)
     */

    const payload = {
      query: `
          mutation {
            createEvent(eventInput: {title:"${title}", price: ${+price}, date: "${date}", description: "${description}"}) {
              _id
              title
              price
              date
              description
              creator {
                _id
                email
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

      if (res.errors) {
        throw res.errors[0].message;
      }

      console.log({ res });

      showModal();
      // fetchEvents();
      setState(state => ({
        ...state,
        events: [...state.events, res.data.createEvent],
      }));
    } catch (error) {
      console.log({ onSubmitError: error });
      setState({ ...state, error });
    }
  };

  if (isLoading) return "Loading...";
  if (error) return error;

  return (
    <>
      {modal ? (
        <>
          <Backdrop />
          <Modal
            title="Add Event"
            canCancel
            canConfirm
            onCancel={showModal}
            onConfirm={handleConfirm}
            confirmText="Confirm"
          >
            <form>
              <div className="form-control">
                <label htmlFor="title">Title</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  onChange={handleChange}
                />
              </div>
              <div className="form-control">
                <label htmlFor="price">Price</label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  onChange={handleChange}
                />
              </div>
              <div className="form-control">
                <label htmlFor="date">Date</label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  onChange={handleChange}
                />
              </div>
              <div className="form-control">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  rows="4"
                  name="description"
                  onChange={handleChange}
                />
              </div>
            </form>
          </Modal>
        </>
      ) : null}
      {token ? (
        <div className="events-control">
          <p>Share your own events</p>
          <button className="btn" onClick={showModal}>
            Create Event
          </button>
        </div>
      ) : null}
      <EventList events={events} />
    </>
  );
}

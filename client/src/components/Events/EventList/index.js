import React from "react";

import "./styles.css";
import EventItem from "components/Events/EventItem";

export default function EventList({ events }) {
  return (
    <ul className="event__list">
      {events.map(event => (
        <EventItem event={event} key={event._id} />
      ))}
    </ul>
  );
}

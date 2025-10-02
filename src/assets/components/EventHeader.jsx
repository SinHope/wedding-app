import React from "react";

const EventHeader = ({ event }) => {
  const date = new Date(event.event_date);
  const options = { day: "2-digit", month: "long", year: "numeric" };
  const formattedDate = date.toLocaleDateString("en-GB", options);

  return (
    <div 
      className="event-header text-center py-4" 
      style={{
        backgroundImage: event.cover_photo 
          ? `url(${event.cover_photo})` 
          : "linear-gradient(135deg, #585756ff, #ffffffff)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        color: "#333",
      }}
    >
      <h1 className="fw-bold">{event.name}</h1>
      <h4>{formattedDate}</h4>
    </div>
  );
};

export default EventHeader;

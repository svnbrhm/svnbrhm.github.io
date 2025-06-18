import React from 'react';

interface EventDetailProps {
  event: {
    id: string;
    title: string;
    date: string;
    location: string;
    description?: string;
  };
}

const EventDetail: React.FC<EventDetailProps> = ({ event }) => {
  return (
    <div className="event-detail max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold">{event.title}</h1>
      <p className="text-gray-600 text-sm">{event.date} - {event.location}</p>
      {event.description && <p className="mt-4 text-gray-700">{event.description}</p>}
    </div>
  );
};

export default EventDetail;
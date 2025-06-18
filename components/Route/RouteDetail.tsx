import React from 'react';

interface RouteDetailProps {
  route: {
    id: string;
    title: string;
    city: string;
    distance: string;
    description?: string;
    image?: string;
  };
}

const RouteDetail: React.FC<RouteDetailProps> = ({ route }) => {
  return (
    <div className="route-detail max-w-4xl mx-auto p-6">
      {route.image && <img src={route.image} alt={route.title} className="w-full h-64 object-cover rounded" />}
      <h1 className="text-3xl font-bold mt-4">{route.title}</h1>
      <p className="text-gray-700 mt-2">{route.description}</p>
      <p className="mt-2 text-sm text-gray-500">{route.city} - {route.distance}</p>
    </div>
  );
};

export default RouteDetail;
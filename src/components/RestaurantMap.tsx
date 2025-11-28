import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import type { Restaurant } from '../types';

// Fix for default Leaflet icon in React
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

interface RestaurantMapProps {
  restaurants: Restaurant[];
  onToggleTried: (id: string, tried: boolean) => void;
}

export const RestaurantMap: React.FC<RestaurantMapProps> = ({ restaurants, onToggleTried }) => {
  // Filter restaurants that have coordinates
  const validRestaurants = restaurants.filter(r => r.latitude && r.longitude);

  // Calculate center (default to Bangkok if no restaurants)
  const defaultCenter: [number, number] = [13.7563, 100.5018];
  const center: [number, number] = validRestaurants.length > 0
    ? [validRestaurants[0].latitude!, validRestaurants[0].longitude!]
    : defaultCenter;

  return (
    <div className="h-[600px] w-full rounded-3xl overflow-hidden shadow-lg border border-slate-100 relative z-0">
      <MapContainer
        center={center}
        zoom={13}
        scrollWheelZoom={false}
        className="w-full h-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {validRestaurants.map(restaurant => (
          <Marker
            key={restaurant.id}
            position={[restaurant.latitude!, restaurant.longitude!]}
          >
            <Popup>
              <div className="p-1 max-w-xs">
                <h3 className="font-bold text-slate-800 text-base mb-1">{restaurant.name}</h3>
                <div className="flex items-center gap-2 mb-2">
                  {restaurant.rating && <span className="text-orange-500 font-bold text-xs">⭐ {restaurant.rating}</span>}
                  <span className="text-slate-500 text-xs">{restaurant.cuisine}</span>
                </div>
                <p className="text-slate-600 text-xs mb-3 line-clamp-2">{restaurant.description}</p>

                <div className="flex gap-2">
                  <button
                    onClick={() => onToggleTried(restaurant.id, !restaurant.isTried)}
                    className={`flex-1 px-3 py-1.5 rounded-lg text-xs font-bold transition ${restaurant.isTried
                        ? 'bg-green-100 text-green-600'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                  >
                    {restaurant.isTried ? 'Tried' : 'Mark Tried'}
                  </button>
                  {restaurant.url && (
                    <a
                      href={restaurant.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-lg bg-blue-50 text-blue-600 text-xs font-bold hover:bg-blue-100 transition"
                    >
                      Maps
                    </a>
                  )}
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

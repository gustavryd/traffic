import { useEffect, useState } from "react";
import type { TrafficSegment } from "~/routes/home";

interface TrafficMapProps {
  trafficData: TrafficSegment[];
  loading: boolean;
}

export function TrafficMap({ trafficData, loading }: TrafficMapProps) {
  const [isClient, setIsClient] = useState(false);
  const [MapComponents, setMapComponents] = useState<any>(null);

  useEffect(() => {
    setIsClient(true);
    
    // Dynamically import react-leaflet only on the client side
    import('react-leaflet').then((module) => {
      setMapComponents({
        MapContainer: module.MapContainer,
        TileLayer: module.TileLayer,
        Polyline: module.Polyline,
        Popup: module.Popup,
      });
    });

    // Import leaflet CSS
    import('leaflet/dist/leaflet.css');
  }, []);

  const getSpeedColor = (speed: number): string => {
    if (speed >= 25) return '#22c55e';
    if (speed >= 15) return '#eab308';
    if (speed >= 5) return '#f97316';
    return '#ef4444';
  };

  const getSpeedCategory = (speed: number): string => {
    if (speed >= 25) return 'Free Flow';
    if (speed >= 15) return 'Moderate';
    if (speed >= 5) return 'Congested';
    return 'Severe';
  };

  if (!isClient || !MapComponents) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-muted">
        <div className="text-center">
          <p className="text-lg font-semibold">Loading map...</p>
        </div>
      </div>
    );
  }

  if (loading && trafficData.length === 0) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-muted">
        <div className="text-center">
          <p className="text-lg font-semibold">Loading traffic data...</p>
          <p className="text-sm text-muted-foreground mt-2">
            Fetching from NYC Open Data
          </p>
        </div>
      </div>
    );
  }

  if (trafficData.length === 0) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-muted">
        <div className="text-center">
          <p className="text-lg font-semibold">No traffic data available</p>
          <p className="text-sm text-muted-foreground mt-2">
            Please try again later
          </p>
        </div>
      </div>
    );
  }

  const { MapContainer, TileLayer, Polyline, Popup } = MapComponents;

  return (
    <MapContainer
      center={[40.7580, -73.9855]}
      zoom={12}
      style={{ height: '100%', width: '100%' }}
      className="z-0"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {trafficData.map((segment) => (
        <Polyline
          key={segment.id}
          positions={segment.coordinates}
          pathOptions={{
            color: getSpeedColor(segment.speed),
            weight: 4,
            opacity: 0.8,
          }}
        >
          <Popup>
            <div className="text-sm">
              <p className="font-semibold">{segment.street}</p>
              <p className="text-muted-foreground mt-1">
                Speed: <span className="font-medium">{segment.speed.toFixed(1)} mph</span>
              </p>
              <p className="text-muted-foreground">
                Status: <span className="font-medium">{getSpeedCategory(segment.speed)}</span>
              </p>
              {segment.travelTime > 0 && (
                <p className="text-muted-foreground">
                  Travel Time: <span className="font-medium">{segment.travelTime.toFixed(0)}s</span>
                </p>
              )}
            </div>
          </Popup>
        </Polyline>
      ))}
    </MapContainer>
  );
}

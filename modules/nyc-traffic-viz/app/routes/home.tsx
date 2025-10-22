import type { Route } from "./+types/home";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { TrafficMap } from "~/components/TrafficMap";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "NYC Traffic Flow Visualization" },
    { name: "description", content: "Real-time traffic flow visualization for New York City streets" },
  ];
}

export interface TrafficSegment {
  id: string;
  street: string;
  fromStreet: string;
  toStreet: string;
  speed: number;
  travelTime: number;
  coordinates: [number, number][];
}

export default function Home() {
  const [trafficData, setTrafficData] = useState<TrafficSegment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  useEffect(() => {
    fetchTrafficData();
    // Refresh data every 5 minutes
    const interval = setInterval(fetchTrafficData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const fetchTrafficData = async () => {
    try {
      setLoading(true);
      // NYC Open Data - Real-Time Traffic Speed Data
      // Using the SODA API endpoint
      const response = await fetch(
        'https://data.cityofnewyork.us/resource/i4gi-tjb9.json?$limit=1000',
        {
          headers: {
            'Accept': 'application/json',
          }
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      // Transform the data
      const segments: TrafficSegment[] = data
        .filter((item: any) => item.speed && item.link_points)
        .map((item: any, index: number) => {
          // Parse the link_points string format: "lat,lon lat,lon lat,lon"
          let coordinates: [number, number][] = [];
          
          if (item.link_points) {
            try {
              // Split by spaces and parse each lat,lon pair
              const points = item.link_points.trim().split(' ');
              coordinates = points
                .map((point: string) => {
                  const [lat, lon] = point.split(',').map(parseFloat);
                  return [lat, lon] as [number, number];
                })
                .filter((coord: [number, number]) => {
                  // Filter out invalid coordinates
                  if (isNaN(coord[0]) || isNaN(coord[1])) return false;
                  
                  // NYC bounding box: roughly 40.4 to 41.0 latitude, -74.3 to -73.7 longitude
                  const isInNYC = 
                    coord[0] >= 40.4 && coord[0] <= 41.0 &&
                    coord[1] >= -74.3 && coord[1] <= -73.7;
                  
                  return isInNYC;
                });
            } catch (e) {
              console.error('Error parsing geometry:', e);
            }
          }

          return {
            id: item.link_id || `segment-${index}`,
            street: item.link_name || 'Unknown Street',
            fromStreet: item.owner || '',
            toStreet: item.transcom_id || '',
            speed: parseFloat(item.speed) || 0,
            travelTime: parseFloat(item.travel_time) || 0,
            coordinates,
          };
        })
        .filter((segment: TrafficSegment) => {
          // Filter out segments with invalid data
          if (segment.coordinates.length < 2) return false;
          
          // Check for unreasonably long segments (likely data errors)
          // Calculate rough distance between first and last point
          const start = segment.coordinates[0];
          const end = segment.coordinates[segment.coordinates.length - 1];
          const latDiff = Math.abs(end[0] - start[0]);
          const lonDiff = Math.abs(end[1] - start[1]);
          const roughDistance = Math.sqrt(latDiff * latDiff + lonDiff * lonDiff);
          
          // Filter out segments longer than ~0.5 degrees (roughly 35 miles)
          // These are likely data errors creating horizontal lines
          if (roughDistance > 0.5) return false;
          
          return true;
        });

      setTrafficData(segments);
      setLastUpdate(new Date());
      setError(null);
    } catch (err) {
      console.error('Error fetching traffic data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load traffic data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground">NYC Traffic Flow</h1>
              <p className="text-muted-foreground mt-1">
                Real-time street-level traffic data from NYC Open Data
              </p>
            </div>
            <div className="flex flex-col gap-2">
              {lastUpdate && (
                <p className="text-sm text-muted-foreground">
                  Last updated: {lastUpdate.toLocaleTimeString()}
                </p>
              )}
              <div className="flex gap-2">
                <Badge variant="secondary">
                  {trafficData.length} segments
                </Badge>
                {loading && <Badge variant="outline">Updating...</Badge>}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        {error && (
          <Card className="mb-4 border-destructive">
            <CardContent className="pt-6">
              <p className="text-destructive">Error: {error}</p>
              <p className="text-sm text-muted-foreground mt-2">
                Using NYC Real-Time Traffic Speed Data API
              </p>
            </CardContent>
          </Card>
        )}

        {/* Legend */}
        <Card className="mb-4">
          <CardHeader>
            <CardTitle className="text-lg">Traffic Speed Legend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded" style={{ backgroundColor: '#22c55e' }} />
                <span className="text-sm">Free Flow (25+ mph)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded" style={{ backgroundColor: '#eab308' }} />
                <span className="text-sm">Moderate (15-25 mph)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded" style={{ backgroundColor: '#f97316' }} />
                <span className="text-sm">Congested (5-15 mph)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded" style={{ backgroundColor: '#ef4444' }} />
                <span className="text-sm">Severe (&lt;5 mph)</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Map */}
        <Card>
          <CardContent className="p-0">
            <div className="relative w-full h-[600px] rounded-lg overflow-hidden">
              <TrafficMap trafficData={trafficData} loading={loading} />
            </div>
          </CardContent>
        </Card>

        {/* Data Source Info */}
        <Card className="mt-4">
          <CardHeader>
            <CardTitle className="text-lg">Data Source</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              This visualization uses the{' '}
              <a 
                href="https://data.cityofnewyork.us/Transportation/Real-Time-Traffic-Speed-Data/qkm5-nuaq"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline"
              >
                NYC Real-Time Traffic Speed Data
              </a>
              {' '}from NYC Open Data. Data is updated every 5 minutes.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

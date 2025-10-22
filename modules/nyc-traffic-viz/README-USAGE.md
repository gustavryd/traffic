# NYC Traffic Flow Visualization

A real-time traffic visualization application for New York City street-level traffic data.

## Access the Application

The application is running at: **http://localhost:51732**

## Features

- **Interactive Map**: Click on any street segment to see detailed traffic information
- **Color-Coded Traffic**: 
  - 🟢 Green: Free Flow (25+ mph)
  - 🟡 Yellow: Moderate (15-25 mph)  
  - 🟠 Orange: Congested (5-15 mph)
  - 🔴 Red: Severe (<5 mph)
- **Auto-Refresh**: Data updates automatically every 5 minutes
- **Real-Time Data**: Shows ~1000 NYC street segments with current traffic speeds

## Data Source

This application uses the [NYC Real-Time Traffic Speed Data](https://data.cityofnewyork.us/Transportation/Real-Time-Traffic-Speed-Data/qkm5-nuaq) from NYC Open Data.

The data includes:
- Current speed on major NYC streets
- Travel time estimates
- Location coordinates for map visualization
- Real-time updates from traffic sensors

## Troubleshooting

### No Data Showing
If you see "No traffic data available":
1. Check your internet connection (the app needs to access NYC Open Data API)
2. Wait a few seconds for initial data load
3. Check browser console for any error messages
4. The NYC Open Data API may be temporarily unavailable

### Map Not Loading
If the map doesn't appear:
1. Ensure JavaScript is enabled in your browser
2. Check browser console for errors
3. Try refreshing the page
4. The Leaflet map library loads dynamically - give it a few seconds

### CORS/Network Errors
The application makes direct API calls to `data.cityofnewyork.us`. If you see CORS errors:
- This is usually a temporary network/API issue
- The NYC Open Data API should allow cross-origin requests
- Try again in a few minutes

## Development

To view container logs:
```bash
polytope get-container-logs nyc-traffic-viz --limit 50
```

To restart the application:
```bash
polytope restart-container nyc-traffic-viz
```

## Technical Details

- **Frontend**: React Router v7, Bun runtime
- **Map**: Leaflet + React-Leaflet
- **Styling**: Tailwind CSS + shadcn/ui
- **Data**: NYC Open Data SODA API
- **Update Frequency**: Every 5 minutes
- **Data Limit**: 1000 most recent traffic segments

# OSINT Hub - AI-Based Intelligence Monitoring Dashboard

A modern, real-time OSINT (Open Source Intelligence) monitoring dashboard built with React, TypeScript, and Tailwind CSS. Monitor security threats, analyze sentiment trends, and manage critical alerts all in one unified interface.

## Features

### Dashboard
- **Real-time Metrics**: Monitor active alerts, feeds, keywords, and sentiment scores
- **Live Intelligence Feed**: Stream of OSINT data with sentiment analysis
- **Sentiment Analysis**: Visualize sentiment distribution over time
- **Activity Trends**: Track mentions, alerts, and sentiment trends

### Alerts Management
- **Severity Filtering**: Critical, High, Medium, Low severity levels
- **Status Tracking**: Active, Acknowledged, Resolved statuses
- **Alert Details**: Comprehensive alert information with triggering source

### Analytics
- **Keyword Analysis**: Track most mentioned keywords and trends
- **Frequency Charts**: Bar charts showing keyword frequency
- **Trend Indicators**: Up/Down/Stable trend visualization
- **Statistics**: Quick stats on top keywords and trending topics

### User Features
- **Authentication**: Secure login and signup with form validation
- **User Settings**: Notification preferences and display options
- **Dark Theme**: Professional dark mode optimized for security operations
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile

## Tech Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with custom dark theme
- **State Management**: Context API
- **Charts**: Recharts
- **HTTP Client**: Axios
- **Routing**: React Router v6
- **Real-time**: WebSocket support with polling fallback

## Project Structure

```
src/
├── components/
│   ├── layout/          # Sidebar, Navbar, Layout wrapper
│   ├── dashboard/       # Dashboard components (metrics, charts, feed)
│   └── common/          # Shared components (loading, notifications)
├── pages/               # Page components (Dashboard, Alerts, Analytics, etc.)
├── context/             # Context providers (Auth, Data)
├── services/            # API, WebSocket, Mock data
├── hooks/               # Custom hooks (useWebSocket)
├── types/               # TypeScript interfaces
├── main.tsx            # Entry point
└── index.css           # Global styles with Tailwind
```

## Getting Started

### Prerequisites
- Node.js 16+ 
- npm or pnpm

### Installation

```bash
# Install dependencies
npm install
# or
pnpm install
```

### Development

```bash
# Start dev server
npm run dev
# or
pnpm dev
```

The application will open at `http://localhost:3000`

### Build

```bash
# Build for production
npm run build
# or
pnpm build
```

## Demo Credentials

For testing purposes, use:
- **Email**: demo@example.com
- **Password**: demo123

## API Integration

The application comes with mock data for development. To integrate with a real backend:

1. Update the `API_ENDPOINTS` in `src/services/api.ts` with your backend URLs
2. Replace mock data calls in the `MockAPI` class with real API calls
3. Implement WebSocket connection in `src/services/websocket.ts` for real-time updates

### Expected API Endpoints

```
POST /auth/login              - User login
POST /auth/signup             - User registration
GET  /feeds                   - Get OSINT feeds
GET  /alerts                  - Get security alerts
GET  /metrics                 - Get dashboard metrics
GET  /keywords                - Get keyword frequency data
GET  /sentiment               - Get sentiment analysis data
GET  /trends                  - Get trend data
POST /alerts                  - Create new alert
PATCH /alerts/:id             - Update alert status
```

## Real-time Updates

The dashboard automatically refreshes data every 30 seconds. For true real-time updates:

1. Connect WebSocket in `src/services/websocket.ts`
2. Use the `useWebSocket` hook to subscribe to live updates
3. Updates will be streamed to subscribed components

## Customization

### Theme Colors

Edit `tailwind.config.js` to customize colors:
- `background` - Main background color
- `accent` - Primary accent color
- `success/warning/error` - Status colors

### Refresh Rate

Change the refresh interval in `src/context/DataContext.tsx`:
```typescript
const interval = setInterval(() => {
  refetchData()
}, 30000) // Change 30000 to desired milliseconds
```

## Performance Optimization

- **Lazy Loading**: Components are code-split by route
- **Memoization**: Charts and tables are memoized to prevent unnecessary re-renders
- **Efficient Styling**: Tailwind CSS with minimal bundle size
- **Mock Data**: Fast response times during development

## Security Considerations

- ✓ Protected routes for authenticated users only
- ✓ Token-based authentication with localStorage
- ✓ CORS-safe API calls
- ✓ Input validation on forms
- ⚠️ Note: In production, implement proper session management and HTTPS

## Troubleshooting

### Dev server not starting?
```bash
# Clear node_modules and reinstall
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

### Charts not rendering?
Make sure Recharts is installed: `pnpm list recharts`

### Styling issues?
Clear browser cache and rebuild: `pnpm build`

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## License

This project is private and proprietary.

## Support

For issues or feature requests, please contact the development team. 

# Japan Tour App

A mobile application that helps tourists find and navigate to the nearest train stations in Japan, with cultural insights and recommendations based on user nationality.

## Features

- Find the nearest train station based on current location
- View station details including:
  - Distance and directions
  - Opening hours
  - Rating and reviews
  - Cultural insights
- Personalized recommendations based on user type (Korean or Western tourist)
- Interactive map with current location and station markers
- Beautiful and intuitive user interface

## Prerequisites

- Node.js (v14 or later)
- npm or yarn
- Expo CLI
- Google Maps API key
- iOS Simulator (for iOS development)
- Android Studio and Android SDK (for Android development)

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/japan-tour-app.git
   cd japan-tour-app
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory and add your API keys:

   ```
   GOOGLE_MAPS_API_KEY=your_google_maps_api_key
   ```

4. Update the Google Maps API keys in `app.json`:
   - For iOS: Update the `ios.config.googleMapsApiKey`
   - For Android: Update the `android.config.googleMaps.apiKey`

## Running the App

1. Start the development server:

   ```bash
   npx expo start
   ```

2. Run on iOS:

   ```bash
   npx expo run:ios
   ```

3. Run on Android:
   ```bash
   npx expo run:android
   ```

## Project Structure

```
japan-tour-app/
├── app/
│   ├── assets/          # Images, fonts, and other static files
│   ├── components/      # Reusable React components
│   ├── hooks/          # Custom React hooks
│   ├── navigation/     # Navigation configuration
│   └── services/       # API and other services
├── .env                # Environment variables
├── app.json           # Expo configuration
├── babel.config.js    # Babel configuration
└── package.json       # Project dependencies
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Expo](https://expo.dev/)
- [React Native](https://reactnative.dev/)
- [React Navigation](https://reactnavigation.org/)
- [Google Maps Platform](https://cloud.google.com/maps-platform/)

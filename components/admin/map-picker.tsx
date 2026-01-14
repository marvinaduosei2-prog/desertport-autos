'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { MapPin, Search, Navigation } from 'lucide-react';

interface MapPickerProps {
  initialLat?: number;
  initialLng?: number;
  onLocationChange: (lat: number, lng: number, address: string) => void;
}

export function MapPicker({ initialLat = 25.2048, initialLng = 55.2708, onLocationChange }: MapPickerProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [marker, setMarker] = useState<google.maps.Marker | null>(null);
  const [searchBox, setSearchBox] = useState<google.maps.places.SearchBox | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentAddress, setCurrentAddress] = useState('');

  // Load Google Maps Script
  useEffect(() => {
    // Check if API key is provided
    if (!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY) {
      console.error('❌ Google Maps API key is missing!');
      console.log('📝 Add NEXT_PUBLIC_GOOGLE_MAPS_API_KEY to your .env.local file');
      setIsLoaded(false);
      return;
    }

    if (typeof window !== 'undefined' && !window.google) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = () => setIsLoaded(true);
      script.onerror = () => {
        console.error('❌ Failed to load Google Maps');
        setIsLoaded(false);
      };
      document.head.appendChild(script);
    } else if (window.google) {
      setIsLoaded(true);
    }
  }, []);

  // Reverse Geocode to get address from coordinates
  const reverseGeocode = useCallback((lat: number, lng: number) => {
    if (!window.google) return;

    console.log('🔍 Getting address for:', { lat, lng });

    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ location: { lat, lng } }, (results, status) => {
      if (status === 'OK' && results && results.length > 0) {
        console.log('📍 All results:', results);
        
        // Use the first result which is usually the most specific
        const address = results[0].formatted_address;
        
        console.log('✅ Address:', address);
        setCurrentAddress(address);
        onLocationChange(lat, lng, address);
      } else {
        console.error('❌ Geocoding failed:', status);
      }
    });
  }, [onLocationChange]);

  // Initialize Map
  useEffect(() => {
    if (!isLoaded || !mapRef.current || map) return;

    const initialPosition = { lat: initialLat, lng: initialLng };

    const newMap = new google.maps.Map(mapRef.current, {
      center: initialPosition,
      zoom: 13,
      mapTypeControl: true,
      streetViewControl: true,
      fullscreenControl: true,
      zoomControl: true,
    });

    setMap(newMap);

    // Create marker
    const newMarker = new google.maps.Marker({
      position: initialPosition,
      map: newMap,
      draggable: true,
      animation: google.maps.Animation.DROP,
      title: 'Your Location',
    });

    setMarker(newMarker);

    // Get initial address
    reverseGeocode(initialLat, initialLng);

    // Handle marker drag
    newMarker.addListener('dragend', () => {
      const position = newMarker.getPosition();
      if (position) {
        const lat = position.lat();
        const lng = position.lng();
        reverseGeocode(lat, lng);
      }
    });

    // Handle map click
    newMap.addListener('click', (e: google.maps.MapMouseEvent) => {
      if (e.latLng) {
        const lat = e.latLng.lat();
        const lng = e.latLng.lng();
        newMarker.setPosition(e.latLng);
        newMap.panTo(e.latLng);
        reverseGeocode(lat, lng);
      }
    });
  }, [isLoaded, map, initialLat, initialLng, reverseGeocode]);

  // Initialize Search Box
  useEffect(() => {
    if (!isLoaded || !searchInputRef.current || searchBox || !map) return;

    const newSearchBox = new google.maps.places.SearchBox(searchInputRef.current);
    setSearchBox(newSearchBox);

    // Bias search results to map's viewport
    map.addListener('bounds_changed', () => {
      newSearchBox.setBounds(map.getBounds() as google.maps.LatLngBounds);
    });

    // Listen for place selection
    newSearchBox.addListener('places_changed', () => {
      const places = newSearchBox.getPlaces();
      if (!places || places.length === 0) return;

      const place = places[0];
      if (!place.geometry || !place.geometry.location) return;

      console.log('📍 Place selected from search:', place);

      const lat = place.geometry.location.lat();
      const lng = place.geometry.location.lng();

      // Update marker position
      if (marker) {
        marker.setPosition(place.geometry.location);
      }

      // Pan map to new location
      map.panTo(place.geometry.location);
      map.setZoom(15);

      // Build best address from place data
      let address = '';
      
      if (place.name && place.formatted_address) {
        // If we have a named place (e.g., "Burj Khalifa")
        // Check if the name is already in the formatted address
        if (place.formatted_address.includes(place.name)) {
          address = place.formatted_address;
        } else {
          // Combine name with city/country info
          const components = place.address_components || [];
          const city = components.find(c => c.types.includes('locality'))?.long_name || '';
          const country = components.find(c => c.types.includes('country'))?.long_name || '';
          
          const parts = [place.name];
          if (city) parts.push(city);
          if (country) parts.push(country);
          
          address = parts.join(', ');
        }
      } else {
        address = place.formatted_address || place.name || '';
      }

      console.log('✅ Final address:', address);
      setCurrentAddress(address);
      onLocationChange(lat, lng, address);
    });
  }, [isLoaded, map, marker, searchBox, onLocationChange]);

  // Get current location
  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('❌ Geolocation is not supported by your browser.\n\nPlease use a modern browser like Chrome, Firefox, Safari, or Edge.');
      return;
    }

    // Show loading indicator
    const button = document.querySelector('[data-location-btn]') as HTMLButtonElement;
    if (button) {
      button.disabled = true;
      button.innerHTML = '<svg class="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> Getting location...';
    }

    console.log('🔍 Requesting geolocation...');
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        console.log('✅ Location obtained:', position.coords);
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        const newPosition = { lat, lng };

        if (marker) {
          marker.setPosition(newPosition);
        }
        if (map) {
          map.panTo(newPosition);
          map.setZoom(15);
        }

        reverseGeocode(lat, lng);

        // Reset button
        if (button) {
          button.disabled = false;
          button.innerHTML = '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"></path></svg> My Location';
        }
      },
      (error) => {
        console.error('❌ Geolocation error:', {
          code: error.code,
          message: error.message,
          PERMISSION_DENIED: error.PERMISSION_DENIED,
          POSITION_UNAVAILABLE: error.POSITION_UNAVAILABLE,
          TIMEOUT: error.TIMEOUT
        });

        // Reset button
        if (button) {
          button.disabled = false;
          button.innerHTML = '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"></path></svg> My Location';
        }

        let errorMessage = '❌ Unable to get your location\n\n';
        let solution = '✅ No worries! You can still:\n';
        solution += '• Search for your address in the box above\n';
        solution += '• Click anywhere on the map to set location\n';
        solution += '• Drag the marker to adjust position';

        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage += '🔒 Browser blocked location access\n\n';
            errorMessage += '📝 Quick Fix:\n';
            errorMessage += '1. Look for a location icon in your address bar\n';
            errorMessage += '2. Click it and allow location access\n';
            errorMessage += '3. Refresh the page\n\n';
            break;

          case error.POSITION_UNAVAILABLE:
            errorMessage += '📍 Could not determine location\n\n';
            errorMessage += 'This can happen if:\n';
            errorMessage += '• WiFi is off (helps locate you)\n';
            errorMessage += '• You\'re using a VPN\n';
            errorMessage += '• Location services need a moment\n\n';
            break;

          case error.TIMEOUT:
            errorMessage += '⏱️ Location request timed out\n\n';
            errorMessage += 'Taking too long to get location.\n';
            errorMessage += 'You can try again in a moment.\n\n';
            break;

          default:
            errorMessage += '❓ Unexpected error occurred\n\n';
        }

        alert(errorMessage + solution);
      },
      {
        enableHighAccuracy: false, // Changed to false for better compatibility
        timeout: 15000, // Increased to 15 seconds
        maximumAge: 300000 // Accept cached location up to 5 minutes old
      }
    );
  };

  if (!isLoaded) {
    // Check if API key is missing
    if (!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY) {
      return (
        <div className="w-full p-8 bg-red-50 border-2 border-red-200 rounded-xl">
          <h3 className="text-xl font-bold text-red-900 mb-4">⚠️ Google Maps API Key Missing</h3>
          <p className="text-red-700 mb-4">
            To use the interactive map picker, you need to add your Google Maps API key.
          </p>
          <div className="bg-white p-4 rounded-lg border border-red-200 mb-4">
            <p className="text-sm font-bold text-gray-900 mb-2">Quick Fix:</p>
            <ol className="text-sm text-gray-700 space-y-2 list-decimal list-inside">
              <li>Open or create <code className="bg-gray-100 px-2 py-1 rounded">.env.local</code> file in your project root</li>
              <li>Add this line:
                <pre className="bg-gray-900 text-lime-400 p-3 rounded mt-2 text-xs overflow-x-auto">
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_actual_api_key_here
                </pre>
              </li>
              <li>Restart your dev server: <code className="bg-gray-100 px-2 py-1 rounded">npm run dev</code></li>
            </ol>
          </div>
          <p className="text-sm text-red-600">
            📖 See <strong>GOOGLE_MAPS_SETUP.md</strong> for detailed instructions on getting an API key.
          </p>
        </div>
      );
    }

    return (
      <div className="w-full h-[500px] bg-gray-100 rounded-xl flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-lime-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-semibold">Loading map...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search Box */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          ref={searchInputRef}
          type="text"
          placeholder="Search for a location..."
          className="w-full pl-12 pr-32 py-4 bg-white border-2 border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:border-lime-600 focus:outline-none transition-all"
        />
        <button
          onClick={handleGetCurrentLocation}
          data-location-btn
          className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 bg-lime-600 hover:bg-lime-500 disabled:bg-gray-400 disabled:cursor-not-allowed text-black font-semibold rounded-lg transition flex items-center gap-2"
        >
          <Navigation className="w-4 h-4" />
          My Location
        </button>
      </div>

      {/* Map Container */}
      <div
        ref={mapRef}
        className="w-full h-[500px] rounded-xl overflow-hidden border-2 border-gray-300 shadow-lg"
      />

      {/* Current Address Display */}
      {currentAddress && (
        <div className="flex items-start gap-3 p-4 bg-lime-50 border-2 border-lime-200 rounded-xl">
          <MapPin className="w-5 h-5 text-lime-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-bold text-gray-700 mb-1">Selected Location:</p>
            <p className="text-sm text-gray-600">{currentAddress}</p>
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="p-4 bg-blue-50 border-2 border-blue-200 rounded-xl">
        <h4 className="font-bold text-blue-900 mb-2 flex items-center gap-2">
          <span>💡</span> How to set your location:
        </h4>
        <ul className="text-sm text-blue-800 space-y-2">
          <li className="flex items-start gap-2">
            <span className="font-bold text-blue-600">1.</span>
            <div>
              <strong className="text-blue-900">Search (Recommended):</strong>
              <span className="block text-blue-700 mt-0.5">Type your address in the search box above - easiest method!</span>
            </div>
          </li>
          <li className="flex items-start gap-2">
            <span className="font-bold text-blue-600">2.</span>
            <div>
              <strong className="text-blue-900">Click on Map:</strong>
              <span className="block text-blue-700 mt-0.5">Click anywhere on the map to place a marker</span>
            </div>
          </li>
          <li className="flex items-start gap-2">
            <span className="font-bold text-blue-600">3.</span>
            <div>
              <strong className="text-blue-900">Drag to Adjust:</strong>
              <span className="block text-blue-700 mt-0.5">Drag the marker for precise positioning</span>
            </div>
          </li>
          <li className="flex items-start gap-2">
            <span className="font-bold text-blue-600">4.</span>
            <div>
              <strong className="text-blue-900">My Location (Optional):</strong>
              <span className="block text-blue-700 mt-0.5">Uses your device's GPS - requires browser permission</span>
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
}


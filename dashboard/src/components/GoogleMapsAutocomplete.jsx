import React, { useRef, useEffect, useState, useCallback } from "react";

function GoogleMapsAutocomplete({ onPlaceSelect }) {
  const autocompleteInput = useRef(null);
  const libInjectionRequired = useRef(!Boolean(window.google));
  const libLoading = useRef(false);
  const [autocomplete, setAutocomplete] = useState();
  console.log(process.env.REACT_APP_GOOGLEMAPS_APIKEY);
  const handlePlaceSelect = useCallback(() => {
    const selectedPlace = autocomplete.getPlace();
    if (selectedPlace) {
      onPlaceSelect(selectedPlace);
    }
  }, [onPlaceSelect, autocomplete]);

  useEffect(() => {
    const initAutocomplete = () => {
      setAutocomplete(
        new window.google.maps.places.Autocomplete(autocompleteInput.current)
      );
    };

    // Check if the Google Maps script has already been loaded
    if (libInjectionRequired.current) {
      if (libLoading.current === true) return;
      libLoading.current = true;
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLEMAPS_APIKEY}&libraries=places`;
      script.async = true;
      script.defer = true;

      // Use a callback function to ensure proper initialization
      script.onload = () => {
        initAutocomplete();
      };

      document.head.appendChild(script);
    } else {
      initAutocomplete();
    }
  }, []);

  useEffect(() => {
    let listener;
    if (!autocomplete) return;
    listener = autocomplete.addListener("place_changed", handlePlaceSelect);

    return () => {
      if (!listener) return;
      window.google.maps.event.removeListener(listener);
    };
  }, [autocomplete, handlePlaceSelect]);

  return (
    <div>
      <input
        ref={autocompleteInput}
        type="text"
        placeholder="Enter a location"
      />
    </div>
  );
}
export default GoogleMapsAutocomplete;

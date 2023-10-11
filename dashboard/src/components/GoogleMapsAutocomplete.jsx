import React, { useRef, useEffect, useState, useCallback } from "react";

function GoogleMapsAutocomplete({ onPlaceSelect }) {
  const autocompleteInput = useRef(null);
  const libInjectionRequired = useRef(!Boolean(window.google));
  const libLoading = useRef(false);
  const [autocomplete, setAutocomplete] = useState();

  const handlePlaceSelect = useCallback(() => {
    if (autocomplete) {
      const selectedPlace = autocomplete.getPlace();
      if (selectedPlace) {
        onPlaceSelect(selectedPlace);
      }
    }
  }, [onPlaceSelect, autocomplete]);

  useEffect(() => {
    const initAutocomplete = () => {
      if (window.google && window.google.maps && window.google.maps.places) {
        setAutocomplete(
          new window.google.maps.places.Autocomplete(autocompleteInput.current)
        );
      }
    };

    if (libInjectionRequired.current) {
      if (libLoading.current === true) return;
      libLoading.current = true;
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLEMAPS_APIKEY}&libraries=places`;
      script.async = true;
      script.defer = true;

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
    if (autocomplete) {
      listener = autocomplete.addListener("place_changed", handlePlaceSelect);

      return () => {
        if (listener) {
          window.google.maps.event.removeListener(listener);
        }
      };
    }
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

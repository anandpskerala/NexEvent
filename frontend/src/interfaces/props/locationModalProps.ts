export interface Location {
  name: string;
  formatted: string;
  lat: number;
  lng: number;
  components: {
    city?: string;
    state?: string;
    country?: string;
  };
}

export interface GeoResult {
  components: {
    city?: string;
    town?: string;
    village?: string;
    state?: string;
    country?: string;
  };
  formatted: string;
  geometry: {
    lat: number;
    lng: number;
  };
}

export interface LocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLocationSelect: (location: Location) => void;
  currentLocation?: Location;
}
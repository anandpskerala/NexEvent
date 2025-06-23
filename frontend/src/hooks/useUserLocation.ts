import { useEffect, useState } from "react";
import type { UserLocationResult } from "../interfaces/props/modalProps";
import type { UserPosition } from "../interfaces/entities/Organizer";

export const useUserLocation = (): UserLocationResult => {
    const [location, setLocation] = useState<UserPosition>({
        lat: 0,
        lng: 0
    });

    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!navigator.geolocation) {
            setError('Geolocation is not supported by your browser');
            setLoading(false);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                setLocation({
                    lat: latitude,
                    lng: longitude
                })
                setLoading(false);
            },
            (err) => {
                console.log(err);
                setError('Permission denied or error retrieving location');
                setLoading(false);
            }
        )
    }, []);

    return {loading, location, error};
}
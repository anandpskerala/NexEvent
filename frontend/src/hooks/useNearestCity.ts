import { useEffect, useState } from 'react';
import axios from 'axios';
import type { UseNearestCityResult } from '../interfaces/props/modalProps';
import config from '../config/config';
import type { NearestCity } from '../interfaces/entities/organizer';

export const useNearestCity = (): UseNearestCityResult => {
    const [city, setCity] = useState<NearestCity>({
        city: '',
        district: '',
        state: '',
        country: ''
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

                try {
                    const response = await axios.get(
                        `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${config.map.gecodeApi}`
                    );

                    const components = response.data.results[0]?.components;
                    const nearestCity: NearestCity = {
                        city: components.county,
                        district: components.state_district,
                        state: components.state,
                        country:  components.country,
                    }

                    if (nearestCity) {
                        setCity(nearestCity);
                    } else {
                        setError('Could not determine nearest city');
                    }
                } catch (err) {
                    console.log(err);
                    setError('Failed to fetch city from API');
                } finally {
                    setLoading(false);
                }
            },
            (err) => {
                console.log(err);
                setError('Permission denied or error retrieving location');
                setLoading(false);
            }
        );
    }, []);

    return { city, loading, error };
};

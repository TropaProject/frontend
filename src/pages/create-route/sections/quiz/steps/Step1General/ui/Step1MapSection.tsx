// pages/create-route/sections/quiz/steps/Step1General/Step1MapSection.tsx
import BaseSearchInput from '@/shared/components/ui/inputs/BaseSearchInput';
import MapScooterIcon from '@/pages/create-route/sections/quiz/steps/Step1General/assets/visual/MapScooterIcon';
import RouteMap from '@/entities/route/ui/RouteMap';
import { useInteractiveMap } from '@/features/yandex-map/hooks/useInteractiveMap';
import { SearchSuggestions } from '@/features/yandex-map/ui/SearchSuggestions';
import { FormError } from '@/shared/lib/feedback/FormError';
import { useCreateRouteStore } from '@/features/create-route/model/store';
import { CITY_BOUNDS, CITY_CENTERS } from '@/features/create-route/lib/constants';
import { useEffect, useMemo } from 'react';

export const Step1MapSection = () => {
    const { updateFormData, formData } = useCreateRouteStore();
    const selectedCityId = formData.cityId;
    const bounds = selectedCityId ? CITY_BOUNDS[selectedCityId] : null;

    const cityCenter = useMemo(() => {
        return selectedCityId ? CITY_CENTERS[selectedCityId] : CITY_CENTERS.moscow;
    }, [selectedCityId]);

    const {
        containerRef,
        isMapLoaded,
        error: mapError,
        searchResults,
        isSearching,
        errorMessage,
        address,
        searchAddress,
        selectSearchResult,
        enable,
        centerOn,
    } = useInteractiveMap({
        initialCenter: formData.coordinates ?? cityCenter,
        cityBounds: bounds,
        onCoordinatesChange: (coords) => {
            updateFormData({ coordinates: coords });
        },
    });

    useEffect(() => {
        if (selectedCityId) {
            enable(true);
            centerOn(cityCenter);
        }
    }, [selectedCityId])

    const handleQueryChange = (query: string) => {
        searchAddress(query);
    };

    const handleSearch = () => {
        if (searchResults.length > 0) {
            selectSearchResult(searchResults[0]);
        }
    };

    return (
        <div className="w-full flex flex-col gap-3 desktop:gap-6 px-2.5 desktop:px-10">
            <div className="relative">
                <BaseSearchInput
                    placeholder="Расскажи откуда начнём новый маршрут"
                    value={address}
                    onSearch={handleSearch}
                    onQueryChange={handleQueryChange}
                />
                <SearchSuggestions
                    results={searchResults}
                    isLoading={isSearching}
                    onSelect={selectSearchResult}
                />
            </div>

            {errorMessage && (
                <FormError message={errorMessage} />
            )}

            <MapScooterIcon className="desktop:flex hidden" />
            <RouteMap
                containerRef={containerRef}
                isMapLoaded={isMapLoaded}
                error={mapError}
            />
        </div>
    );
};
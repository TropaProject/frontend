// features/create-route/hooks/useCreateRoutePage.ts
import { useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useCreateRouteStore } from "@/features/create-route/model/store";
import { useFormData, useGenerateDescription, useGenerateRoute } from "@/features/create-route/hooks/useCreateRouteQueries";
import { mapFormToDescriptionRequest, mapFormToRouteRequest } from "@/features/create-route/lib/mapFormToApi";

export const useCreateRoutePage = () => {
    const navigate = useNavigate();
    const {
        currentStep,
        formData,
        aiDescription,
        descriptionError,
        generatedRouteId,
        isCreated,
        setAiDescription,
        setDescriptionError,
        setGeneratedRouteId,
        setIsCreated,
        reset,
        clearStorage,
    } = useCreateRouteStore();

    const { data: formDataApi, isLoading, isError, error, refetch } = useFormData();
    const generateDescription = useGenerateDescription();
    const generateRoute = useGenerateRoute();

    const isDescriptionRequested = useRef(false);
    const hasRedirected = useRef(false);

    useEffect(() => {
        if (!isCreated && !generatedRouteId) {
            reset();
        }
        return () => {
            if (hasRedirected.current) {
                clearStorage();
            }
        };
    }, []);

    useEffect(() => {
        setAiDescription(null);
        setDescriptionError(null);
        setGeneratedRouteId(null);
        setIsCreated(false);
        isDescriptionRequested.current = false;
        hasRedirected.current = false;
    }, [setAiDescription, setDescriptionError, setGeneratedRouteId, setIsCreated]);

    const isLoadingScreenVisible = generateRoute.isPending;

    useEffect(() => {
        if (isLoadingScreenVisible) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [isLoadingScreenVisible]);

    useEffect(() => {
        if (
            currentStep === 4 &&
            !aiDescription &&
            !descriptionError &&
            formData.coordinates &&
            !isDescriptionRequested.current
        ) {
            isDescriptionRequested.current = true;
            const req = mapFormToDescriptionRequest(formData, formData.coordinates);
            generateDescription.mutate(req, {
                onSuccess: (res) => {
                    setAiDescription(res.route_description);
                    setDescriptionError(null);
                },
                onError: (err: Error) => {
                    setDescriptionError(err.message || "Ошибка при генерации описания");
                },
            });
        }
    }, [currentStep, aiDescription, descriptionError, formData, generateDescription, setAiDescription, setDescriptionError]);

    const handleCreateRoute = useCallback(() => {
        if (!formData.coordinates || !aiDescription) return;

        const req = mapFormToRouteRequest(formData, formData.coordinates, aiDescription);
        generateRoute.mutate(req, {
            onSuccess: (res) => {
                if (res.data?.route_id) {
                    setGeneratedRouteId(res.data.route_id);
                    setIsCreated(true);
                }
            },
        });
    }, [formData, aiDescription, generateRoute, setGeneratedRouteId, setIsCreated]);

    useEffect(() => {
        if (generatedRouteId && !hasRedirected.current) {
            hasRedirected.current = true;
            navigate(`/route/${generatedRouteId}`);
        }
    }, [generatedRouteId, navigate]);

    return {
        currentStep,
        formDataApi,
        isLoading,
        isError,
        error,
        refetch,
        aiDescription,
        isLoadingScreenVisible,
        handleCreateRoute,
    };
};
// features/create-route/model/store.ts
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

export interface RouteFormData {
    cityId: string | null;
    timeOfDay: string | null;
    duration: number;
    radius: number;
    budget: number;
    mood: string | null;
    interests: string[];
    coordinates: { lat: number; lng: number } | null;
    comment: string;
}

interface CreateRouteState {
    currentStep: number;
    totalSteps: number;
    formData: RouteFormData;
    aiDescription: string | null;
    descriptionError: string | null;
    generatedRouteId: string | null;
    isCreated: boolean;

    setStep: (step: number) => void;
    nextStep: () => void;
    prevStep: () => void;
    updateFormData: (data: Partial<RouteFormData>) => void;
    setAiDescription: (text: string | null) => void;
    setDescriptionError: (error: string | null) => void;
    setGeneratedRouteId: (id: string | null) => void;
    setIsCreated: (flag: boolean) => void;
    toggleInterest: (interestId: string) => void;
    reset: () => void;
    clearStorage: () => void;

    isStepValid: (step: number) => boolean;
}

const initialFormData: RouteFormData = {
    cityId: null,
    timeOfDay: null,
    duration: 2,
    radius: 2,
    budget: 2,
    mood: null,
    interests: [],
    coordinates: null,
    comment: '',
};

export const useCreateRouteStore = create<CreateRouteState>()(
    devtools(
        persist(
            (set, get) => ({
                currentStep: 1,
                totalSteps: 4,
                formData: initialFormData,
                aiDescription: null,
                descriptionError: null,
                generatedRouteId: null,
                isCreated: false,

                setStep: (step) => set({ currentStep: step }),
                nextStep: () => set((state) => ({
                    currentStep: Math.min(state.currentStep + 1, 5),
                })),
                prevStep: () => set((state) => ({
                    currentStep: Math.max(state.currentStep - 1, 1),
                })),

                updateFormData: (data) => set((state) => ({
                    formData: { ...state.formData, ...data },
                })),

                setAiDescription: (text) => set({ aiDescription: text }),
                setDescriptionError: (error) => set({ descriptionError: error }),
                setGeneratedRouteId: (id) => set({ generatedRouteId: id }),
                setIsCreated: (flag) => set({ isCreated: flag }),

                toggleInterest: (interestId) => set((state) => ({
                    formData: {
                        ...state.formData,
                        interests: state.formData.interests.includes(interestId)
                            ? state.formData.interests.filter((id) => id !== interestId)
                            : [...state.formData.interests, interestId],
                    },
                })),

                reset: () => set({
                    currentStep: 1,
                    formData: initialFormData,
                    aiDescription: null,
                    descriptionError: null,
                    generatedRouteId: null,
                    isCreated: false,
                }),

                clearStorage: () => {
                    localStorage.removeItem('create-route-storage');
                    set({
                        currentStep: 1,
                        formData: initialFormData,
                        aiDescription: null,
                        descriptionError: null,
                        generatedRouteId: null,
                        isCreated: false,
                    });
                },

                isStepValid: (step) => {
                    const formData = get().formData;
                    switch (step) {
                        case 1:
                            return !!formData.cityId && !!formData.coordinates;
                        case 2:
                            return !!formData.timeOfDay;
                        case 3:
                            return formData.interests.length > 0 && !!formData.mood;
                        case 4:
                            return true;
                        default:
                            return false;
                    }
                },
            }),
            {
                name: 'create-route-storage',
                partialize: (state) => {
                    const { isCreated, ...rest } = state;
                    return rest;
                },
            }
        )
    )
);
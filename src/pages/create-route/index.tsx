// pages/create-route/index.tsx
import PageWrapper from "@/shared/components/wrappers/PageWrapper";
import { QueryStateWrapper } from "@/shared/lib/feedback/feedback/QueryStateWrapper";
import LoadingScreen from "@/pages/route/ui/LoadingScreen";
import { CreateRouteHero } from "@/pages/create-route/sections/hero";
import { CreateRouteQuiz } from "@/pages/create-route/sections/quiz";
import { useCreateRoutePage } from "@/features/create-route/hooks/useCreateRoutePage";

const CreateRoutePage = () => {
    const {
        currentStep,
        formDataApi,
        isLoading,
        isError,
        error,
        refetch,
        aiDescription,
        isLoadingScreenVisible,
        handleCreateRoute,
    } = useCreateRoutePage();

    return (
        <PageWrapper className="-mb-33 desktop:-mb-72 overflow-hidden">
            <LoadingScreen isLoading={isLoadingScreenVisible} />

            <QueryStateWrapper
                loading={{ isLoading, config: { message: "Загрузка формы..." } }}
                error={{
                    isError,
                    raw: error,
                    config: {
                        fallbackMessage: "Не удалось загрузить данные",
                        actionLabel: "Повторить",
                        onClick: () => refetch(),
                    },
                }}
                empty={{ isEmpty: !formDataApi, config: { message: "Нет доступных городов" } }}
            >
                {formDataApi && (
                    <>
                        <CreateRouteHero currentStep={currentStep} totalSteps={4} className="mb-10" />
                        <CreateRouteQuiz
                            currentStep={currentStep}
                            formData={formDataApi}
                            hasDescription={!!aiDescription}
                            onCreateRoute={handleCreateRoute}
                        />
                    </>
                )}
            </QueryStateWrapper>
        </PageWrapper>
    );
};

export default CreateRoutePage;
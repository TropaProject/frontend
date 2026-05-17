// shared/lib/feedback/QueryStateWrapper/QueryStateWrapper.tsx
import { Loader } from "@/shared/lib/feedback/Loader/Loader";
import { EmptyState } from "@/shared/lib/feedback/EmptyState/EmptyState";
import type { ReactNode } from "react";
import clsx from "clsx";

interface LoadingConfig {
    message?: string;
}

interface ErrorConfig {
    raw?: unknown;
    fallbackMessage?: string;
    actionLabel?: string;
    actionTo?: string;
    onClick?: () => void;
}

interface EmptyConfig {
    message?: string;
    actionLabel?: string;
    actionTo?: string;
    onClick?: () => void;
}

interface QueryStateWrapperProps {
    loading: {
        isLoading: boolean;
        config?: LoadingConfig;
    };
    error: {
        isError: boolean;
        raw?: unknown;
        config?: ErrorConfig;
    };
    empty: {
        isEmpty: boolean;
        config?: EmptyConfig;
    };
    children: ReactNode;
    className?: string;
}

interface ServerError {
    response?: {
        data?: {
            message?: string;
        };
    };
}

const extractErrorMessage = (raw: unknown, fallback: string): string => {
    if (!raw) return fallback;
    const serverError = raw as ServerError;
    return serverError?.response?.data?.message || fallback;
};

export const QueryStateWrapper = ({
    loading,
    error,
    empty,
    children,
    className,
}: QueryStateWrapperProps) => {

    if (loading.isLoading) {
        return <Loader message={loading.config?.message ?? "Загрузка..."} className={clsx('min-h-[50vh]', className)} />;
    }

    if (error.isError) {
        const message = extractErrorMessage(error.raw, error.config?.fallbackMessage ?? "Произошла ошибка");
        return (
            <div className={`flex items-center justify-center min-h-[50vh] w-full ${className}`}>
                <EmptyState
                    message={message}
                    actionLabel={error.config?.actionLabel ?? "Повторить"}
                    actionTo={error.config?.actionTo}
                    onClick={error.config?.onClick}
                    className=" w-full"
                />
            </div>
        );
    }

    if (empty.isEmpty) {
        return (
            <div className={`flex items-center justify-center min-h-[50vh] w-full ${className}`}>
                <EmptyState
                    message={empty.config?.message ?? "Здесь пока ничего нет"}
                    actionLabel={empty.config?.actionLabel ?? "Повторить"}
                    actionTo={empty.config?.actionTo}
                    onClick={empty.config?.onClick}
                    className=" w-full"
                />
            </div>
        );
    }

    return <>{children}</>;
};
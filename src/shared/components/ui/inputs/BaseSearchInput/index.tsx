// shared/components/ui/inputs/BaseSearchInput/index.tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import clsx from 'clsx';
import SearchInputButtonBg from '@/shared/components/ui/inputs/BaseSearchInput/assets/backgrounds/SearchInputButtonBg';
import SearchInputButtonIcon from '@/shared/components/ui/inputs/BaseSearchInput/assets/icons/SearchInputButtonIcon';
import BaseButton from '@/shared/components/ui/buttons/BaseButton';
import SearchInputBorder from '@/shared/components/ui/inputs/BaseSearchInput/assets/borders/SearchInputBorder';
import { BorderWrapper } from '@/shared/components/wrappers/BorderWrapper';
import { useScreenSize } from '@/shared/hooks/useScreenSize';
import { useEffect, useRef } from 'react';

const searchSchema = z.object({
    search: z.string().min(2, { message: "Минимум 2 символа" }).max(150, { message: "Слишком длинный запрос" }),
});

type SearchFormValues = z.infer<typeof searchSchema>;

interface BaseSearchInputProps {
    onSearch: (value: string) => void;
    onQueryChange?: (value: string) => void;
    value?: string;
    placeholder?: string;
    className?: string;
}

const BaseSearchInput = ({ onSearch, onQueryChange, value, placeholder = "Поиск...", className }: BaseSearchInputProps) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
    } = useForm<SearchFormValues>({
        resolver: zodResolver(searchSchema),
        defaultValues: { search: "" },
    });

    const isProgrammaticUpdate = useRef(false);
    const prevExternalValue = useRef(value);

    useEffect(() => {
        if (value !== undefined && value !== prevExternalValue.current) {
            prevExternalValue.current = value;
            isProgrammaticUpdate.current = true;
            setValue("search", value, { shouldValidate: false, shouldDirty: false });
        }
    }, [value, setValue]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (isProgrammaticUpdate.current) {
            isProgrammaticUpdate.current = false;
            return;
        }
        onQueryChange?.(e.target.value);
    };

    const onSubmit = (data: SearchFormValues) => {
        onSearch(data.search);
    };

    const { isDesktop } = useScreenSize();

    const { onChange: rhfOnChange, ...restRegister } = register('search');

    return (
        <form onSubmit={handleSubmit(onSubmit)} className={clsx("flex items-start gap-1 w-full desktop:gap-5", className)}>
            <div className="relative flex-1 group">
                <div className="relative h-12.5 flex items-center px-5 desktop:px-8 pb-1">
                    <BorderWrapper
                        borderComponent={SearchInputBorder}
                        className={clsx(errors.search ? "text-primary" : "text-secondary")}
                    />
                    <input
                        {...restRegister}
                        type="text"
                        placeholder={placeholder}
                        autoComplete="off"
                        onChange={(e) => {
                            rhfOnChange(e);
                            handleInputChange(e);
                        }}
                        className="relative z-10 w-full bg-transparent outline-none border-none text-body-xs desktop:text-body-sm leading-[1.1]! text-text placeholder:text-secondary"
                    />
                </div>
                {errors.search && (
                    <span className="absolute -top-5 left-2 text-[10px] text-red-500 font-body">
                        {errors.search.message}
                    </span>
                )}
            </div>
            <BaseButton
                type="submit"
                variant="primary"
                className="w-12.5 h-12.5 p-0 flex items-center justify-center desktop:w-full desktop:min-w-34!"
                customBg={!isDesktop ? <SearchInputButtonBg className="absolute inset-0 w-full h-full text-primary" /> : undefined}
            >
                <SearchInputButtonIcon className="w-5 h-5 z-20 desktop:hidden" />
                <span className="hidden desktop:block">Поиск</span>
            </BaseButton>
        </form>
    );
};

export default BaseSearchInput;
// features/yandex-map/ui/SearchSuggestions/SearchSuggestions.tsx
import { motion, AnimatePresence } from 'framer-motion';
import { Loader } from '@/shared/lib/feedback/Loader/Loader';
import { EmptyState } from '@/shared/lib/feedback/EmptyState';

interface SearchResult {
    coordinates: { lat: number; lng: number };
    address: string;
}

interface SearchSuggestionsProps {
    results: SearchResult[];
    isLoading: boolean;
    onSelect: (result: SearchResult) => void;
    className?: string;
}

export const SearchSuggestions = ({
    results,
    isLoading,
    onSelect,
    className = '',
}: SearchSuggestionsProps) => {
    const show = results.length > 0 || isLoading;

    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.2 }}
                    className={`absolute top-full left-0 right-0 z-50 mt-1 bg-background rounded-2xl shadow-lg overflow-hidden ${className}`}
                >
                    <div className="absolute inset-0 border-2 border-secondary rounded-2xl pointer-events-none" />
                    <div className="relative z-10">
                        {isLoading ? (
                            <div className="py-4">
                                <Loader message="Поиск адресов..." />
                            </div>
                        ) : results.length === 0 ? (
                            <EmptyState message='Ничего не найдено' />
                        ) : (
                            <ul className="py-1">
                                {results.map((result, index) => (
                                    <li key={index}>
                                        <button
                                            type="button"
                                            className="w-full text-left px-5 py-3 text-body-sm text-text hover:bg-secondary/5 transition-colors"
                                            onClick={() => onSelect(result)}
                                        >
                                            {result.address}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
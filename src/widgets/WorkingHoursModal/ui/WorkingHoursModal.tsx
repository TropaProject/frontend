// widgets/WorkingHoursModal/ui/WorkingHoursModal.tsx
import { BaseModal } from '@/shared/components/ui/modals/BaseModal/BaseModal';
import type { WorkingHoursDay } from '@/entities/place/model/types';

interface WorkingHoursModalProps {
    isOpen: boolean;
    onClose: () => void;
    schedule: WorkingHoursDay[];
    placeName: string;
}

export const WorkingHoursModal = ({ isOpen, onClose, schedule, placeName }: WorkingHoursModalProps) => {
    return (
        <BaseModal isOpen={isOpen} onClose={onClose}>
            <div className="flex flex-col gap-6 w-full relative">
                <h2 className="text-heading-lg! text-primary">{placeName}</h2>

                <ul className="flex flex-col gap-1">
                    {schedule.map((day) => (
                        <li
                            key={day.day}
                            className="flex flex-row justify-between items-center border-secondary/20 last:border-none py-1 border-b"
                        >
                            <span className="text-body-base capitalize text-text">
                                {day.day}
                            </span>
                            <span className="text-heading-sm text-primary ">
                                {day.hours === "closed" || day.hours === "закрыто" ? "Закрыто" : day.hours}
                            </span>
                        </li>
                    ))}
                </ul>
            </div>
        </BaseModal>
    );
};
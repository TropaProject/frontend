import { SettingsForm, SettingsPasswordForm } from "@/pages/user/settings/ui/forms";
import PenIcon from "@/shared/assets/icons/PenIcon";
import { UserAvatar } from "@/shared/components/ui/avatar/UserAvatar";
import { Button } from "@headlessui/react";

const UserSettingsPage = () => {

    return (
        <div className="flex flex-col sm:mx-auto sm:max-w-3/4 tablet:max-w-none tablet:items-start gap-10 w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h1 className="text-heading-2xl! text-secondary">
                Внеси изменения <br className="xs:hidden" />
                в профиль
            </h1>

            <div className="flex flex-col tablet:mx-0 w-full desktop:flex-row desktop:justify-between gap-8">
                <div className="flex flex-col gap-1">

                    <h2 className="text-primary text-heading-md mb-4">Фото профиля</h2>

                    <div className="flex flex-row gap-2 items-center desktop:flex-col">
                        <UserAvatar strokeColor="text-secondary" size="xl" className="pb-1" />

                        <Button className='inline-flex items-center gap-1 text-secondary text-body-lg'>
                            <span>Изменить</span>
                            <PenIcon />
                        </Button>
                    </div>
                </div>
                <SettingsForm className="flex flex-col gap-1 desktop:min-w-77" />
                <SettingsPasswordForm className="flex flex-col gap-1 desktop:min-w-77" />
            </div>
        </div>
    );
};

export default UserSettingsPage;
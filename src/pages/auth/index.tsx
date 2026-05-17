import { Link } from "react-router-dom"

import BaseButton from "@/shared/components/ui/buttons/BaseButton"
import { AuthLayout } from "@/pages/auth/ui/AuthLayout"

const AuthPage = () => {
    return (
        <AuthLayout>
            <div className="flex flex-col w-full items-center relative pb-36 desktop:mb-16">
                <div className="flex flex-col desktop:flex-row desktop:gap-4 gap-1 items-center z-50">
                    <BaseButton
                        className="min-w-25 desktop:min-w-33.5"
                        as={Link}
                        to='/auth/login'
                    >
                        Войти
                    </BaseButton>
                    <BaseButton
                        className="min-w-34 desktop:min-w-45"
                        variant="secondary"
                        as={Link}
                        to='/auth/register'
                    >
                        Зарегистрироваться
                    </BaseButton>
                </div>
            </div>
        </AuthLayout>
    )
}

export default AuthPage
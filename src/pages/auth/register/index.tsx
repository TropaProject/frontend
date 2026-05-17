import { RegisterForm } from "@/features/auth";
import { AuthLayout } from "@/pages/auth/ui/AuthLayout";

const RegisterPage = () => {
    return (
        <AuthLayout subtitle="Регистрация">
            <div className="flex flex-col w-full pb-24 mb-20 sm:mb-0">
                <RegisterForm />
            </div>
        </AuthLayout>
    );
};

export default RegisterPage
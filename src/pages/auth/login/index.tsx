import { AuthLayout } from "@/pages/auth/ui/AuthLayout";
import { LoginForm } from "@/features/auth";

const LoginPage = () => {
    return (
        <AuthLayout subtitle="Вход">
            <div className="flex flex-col w-full pb-24 mb-20 sm:mb-0">
                <LoginForm />
            </div>
        </AuthLayout>
    );
};
export default LoginPage
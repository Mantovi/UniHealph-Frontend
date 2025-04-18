import { FC } from "react";

type AuthFormWrapperProps = {
    children: React.ReactNode;
    title: string;
}

const AuthFormWrapper: FC<AuthFormWrapperProps> = ({ children, title }) => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
            <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md">
                <h2 className="text-2xl font-semibold mb-6 text-center">{title}</h2>
                {children}
            </div>
        </div>
    )
}

export default AuthFormWrapper;
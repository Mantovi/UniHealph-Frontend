import { useAuth } from "@/hooks/useAuth";
import { Navigate, Outlet } from "react-router-dom";

type Props = { allowedRoles: Array<'ADMIN' | 'UNIVERSITY' | 'STUDENT'>};
export const ProtectedRoutes = ({allowedRoles}: Props) => {
    const {user} = useAuth();

    if (!user || !user.role) return <Navigate to="/login" />

    return allowedRoles.includes(user.role) ? <Outlet /> : <Navigate to="/" />
}

export default ProtectedRoutes;
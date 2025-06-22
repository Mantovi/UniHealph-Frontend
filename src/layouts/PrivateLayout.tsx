import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import Header from '../components/layout/Header';

export default function PrivateLayout() {
  const { token } = useAuthStore();

  if (!token) {
    return <Navigate to="/login" />;
  }

  return (
    <>
      <Header />
      <main className="pt-4">
        <Outlet />
      </main>
    </>
  );
}
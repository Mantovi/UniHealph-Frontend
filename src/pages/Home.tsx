import { useNavigate } from "react-router-dom";
import Logo from "@/assets/Logo com fundo.jpg"; // ajuste o caminho caso necessário
import { Button } from "@/components/ui/button";

const Home = () => {
  const navigate = useNavigate();

  return (
    <main className="min-h-screen bg-gradient-to-br from-emerald-100 via-blue-50 to-white flex flex-col items-center justify-center px-4">
      <section className="w-full max-w-lg mx-auto bg-white/90 rounded-3xl shadow-2xl border border-blue-100 flex flex-col items-center gap-6 p-8">
        <img
          src={Logo}
          alt="Logo Uni-Healph"
          className="h-16 md:h-24 mb-2 object-contain drop-shadow-lg"
        />
        <h1 className="text-3xl md:text-4xl font-bold text-emerald-700 text-center drop-shadow">
          Bem-vindo ao Uni-Healph
        </h1>
        <p className="text-lg md:text-xl text-blue-900 text-center max-w-md">
          Plataforma universitária para compras e aluguéis.
          Mais praticidade e economia para estudantes e universidades.
        </p>
        <p className="text-lg md:text-xl text-blue-900 text-center max-w-md">
          Tudo o que você precisa, em um só lugar.
        </p>

        <Button
          size="lg"
          className="w-full md:w-2/3 mt-2 bg-emerald-600 hover:bg-emerald-700 text-white text-lg rounded-xl font-bold shadow-lg transition"
          onClick={() => navigate('/login')}
        >
          Entrar no Sistema
        </Button>
      </section>
      <footer className="mt-10 text-sm text-blue-900/70">
        Uni-Healph &copy; {new Date().getFullYear()} - Todos os direitos reservados
      </footer>
    </main>
  );
};

export default Home;
import { Card, CardContent } from "@/components/ui/card";

const About = () => {
  return (
    <div className="max-w-3xl mx-auto py-8 px-4 space-y-8">
      <h1 className="text-3xl font-bold text-sky-800 text-center mb-2">
        Sobre o Uni+Healph
      </h1>
      <Card>
        <CardContent className="py-6 px-4 flex flex-col gap-4">
          <p>
            <span className="font-semibold text-sky-700">Uni+Healph</span> é uma plataforma desenvolvida especialmente para atender estudantes universitários, gestores e clínicas da área da saúde. Nosso objetivo é facilitar o acesso a materiais, produtos, informações e soluções, promovendo praticidade, economia e segurança.
          </p>
          <h2 className="text-xl font-bold mt-2 mb-1 text-sky-700">O que oferecemos?</h2>
          <ul className="list-disc pl-6 space-y-1 text-gray-700">
            <li>
              <strong>E-commerce:</strong> Compra e aluguel de produtos selecionados para estudantes da saúde, com opções de filtros inteligentes, marcas e categorias especializadas.
            </li>
            <li>
              <strong>Gestão para universidades e clínicas:</strong> Planos e administração de permissões para aquisição e distribuição de materiais a alunos autorizados.
            </li>
            <li>
              <strong>Programa de pontos:</strong> Ganhe e utilize pontos em suas compras e aluguéis.
            </li>
            <li>
              <strong>Transparência e segurança:</strong> Todo o sistema foi desenvolvido com as melhores práticas de segurança e transparência, usando autenticação JWT, perfis de acesso e histórico de operações.
            </li>
            <li>
              <strong>Experiência intuitiva:</strong> Plataforma moderna, responsiva, pensada para ser fácil de usar em qualquer dispositivo.
            </li>
          </ul>
          <h2 className="text-xl font-bold mt-4 mb-1 text-sky-700">Nosso propósito</h2>
          <p>
            O Uni+Healph nasceu da necessidade de conectar alunos, instituições e fornecedores do setor de saúde, promovendo acesso democrático a insumos, equipamentos e soluções, sempre com foco na experiência do estudante universitário brasileiro.
          </p>
          <p>
            Nosso compromisso é com a <strong>acessibilidade</strong>, <strong>qualidade</strong> e <strong>inclusão</strong>, apoiando a permanência estudantil e a evolução acadêmica.
          </p>
          <div className="text-center mt-4">
            <span className="text-sky-700 font-medium">
              Dúvidas, sugestões ou parcerias? Entre em contato pelo nosso formulário na página <a href="/contact" className="underline text-sky-800">Contato</a>.
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default About;
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import { Card, CardContent } from "@/components/ui/card";

const Contact = () => {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error("Preencha todos os campos!");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setForm({ name: "", email: "", message: "" });
      toast.success("Mensagem enviada com sucesso! Em breve entraremos em contato.");
    }, 900);
  };

  return (
    <div className="max-w-2xl mx-auto py-8 px-4 space-y-8">
      <h1 className="text-3xl font-bold text-sky-800 text-center mb-4">Contato</h1>
      <Card>
        <CardContent className="py-6 px-4">
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="name" className="font-semibold text-sky-700">
                Nome
              </label>
              <Input
                id="name"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Seu nome"
                autoComplete="name"
                className="mt-1"
              />
            </div>
            <div>
              <label htmlFor="email" className="font-semibold text-sky-700">
                E-mail
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Seu e-mail"
                autoComplete="email"
                className="mt-1"
              />
            </div>
            <div>
              <label htmlFor="message" className="font-semibold text-sky-700">
                Mensagem
              </label>
              <Textarea
                id="message"
                name="message"
                value={form.message}
                onChange={handleChange}
                rows={5}
                placeholder="Como podemos ajudar?"
                className="mt-1"
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Enviando..." : "Enviar"}
            </Button>
          </form>
          <div className="text-center text-sm text-gray-500 mt-5">
            Ou envie um e-mail para <a href="mailto:contato@uni+healph.com.br" className="text-sky-700 underline">contato@uni+healph.com.br</a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Contact;
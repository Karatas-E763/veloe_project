"use client";

import { useState } from "react";

export default function AdminLogin({
  onSuccess,
}: {
  onSuccess: () => void;
}) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) {
        setError("Usuário ou senha inválidos.");
        return;
      }

      onSuccess();
    } catch {
      setError("Erro ao entrar. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f5f7fa] px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-[0_8px_32px_rgba(29,27,132,0.1)]">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-veloe-navy">
            Painel Admin
          </h1>
          <p className="mt-2 text-sm text-veloe-navy/60">
            Entre com suas credenciais para acessar
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="username"
              className="mb-1.5 block text-sm font-semibold text-veloe-navy"
            >
              Usuário
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              required
              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-veloe-navy outline-none transition-colors focus:border-veloe-cyan"
              placeholder="Digite seu usuário"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-1.5 block text-sm font-semibold text-veloe-navy"
            >
              Senha
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-veloe-navy outline-none transition-colors focus:border-veloe-cyan"
              placeholder="Digite sua senha"
            />
          </div>

          {error && (
            <p className="text-center text-sm text-red-500">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading || !username || !password}
            className={`w-full rounded-full py-3.5 text-sm font-bold transition-all ${
              loading || !username || !password
                ? "cursor-not-allowed bg-[#e1e1eb] text-gray-400"
                : "bg-veloe-navy text-white shadow-[0_4px_16px_rgba(29,27,132,0.3)] hover:bg-veloe-navy-dark"
            }`}
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>

        <a
          href="/"
          className="mt-6 block text-center text-sm font-medium text-veloe-navy/50 transition-colors hover:text-veloe-navy"
        >
          Voltar ao site
        </a>
      </div>
    </div>
  );
}

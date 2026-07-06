"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import type { Registration } from "@/lib/types";
import AdminLogin from "@/components/admin/AdminLogin";
import {
  unlockSuccessSound,
  warmSuccessSound,
  playAdminNotificationSound,
} from "@/lib/successSound";

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<Registration | null>(null);
  const [search, setSearch] = useState("");
  const [newIds, setNewIds] = useState<Set<string>>(() => new Set());
  const knownIdsRef = useRef<Set<string>>(new Set());
  const isInitialLoadRef = useRef(true);

  const checkSession = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/login", { cache: "no-store" });
      const data = (await res.json()) as { authenticated?: boolean };
      setAuthenticated(Boolean(data.authenticated));
    } catch {
      setAuthenticated(false);
    }
  }, []);

  const loadData = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const res = await fetch("/api/registrations", { cache: "no-store" });
      if (res.status === 401) {
        setAuthenticated(false);
        setRegistrations([]);
        return;
      }
      if (!res.ok) {
        setRegistrations([]);
        return;
      }
      const data = (await res.json()) as Registration[] | { error?: string };
      const newData = Array.isArray(data) ? data : [];

      if (!isInitialLoadRef.current) {
        const added = newData.filter((r) => !knownIdsRef.current.has(r.id));
        if (added.length > 0) {
          setNewIds((prev) => {
            const next = new Set(prev);
            added.forEach((r) => next.add(r.id));
            return next;
          });
          playAdminNotificationSound();
        }
      } else {
        isInitialLoadRef.current = false;
      }

      knownIdsRef.current = new Set(newData.map((r) => r.id));
      setRegistrations(newData);
    } catch {
      setRegistrations([]);
    } finally {
      if (!silent) setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkSession();
  }, [checkSession]);

  useEffect(() => {
    if (authenticated) {
      loadData();
    }
  }, [authenticated, loadData]);

  useEffect(() => {
    if (!authenticated) return;

    const warm = () => {
      unlockSuccessSound();
      warmSuccessSound();
    };
    window.addEventListener("pointerdown", warm, { once: true });

    const interval = setInterval(() => {
      void loadData(true);
    }, 5000);

    return () => {
      window.removeEventListener("pointerdown", warm);
      clearInterval(interval);
    };
  }, [authenticated, loadData]);

  const handleLoginSuccess = () => {
    unlockSuccessSound();
    warmSuccessSound();
    setAuthenticated(true);
  };

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    setAuthenticated(false);
    setRegistrations([]);
    setSelected(null);
    setNewIds(new Set());
    knownIdsRef.current = new Set();
    isInitialLoadRef.current = true;
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/registrations/${id}`, { method: "DELETE" });
      if (!res.ok) return;

      setRegistrations((prev) => prev.filter((r) => r.id !== id));
      setSelected((current) => (current?.id === id ? null : current));
    } catch {
      // keep list unchanged on failure
    }
  };

  const filtered = registrations.filter((r) => {
    const q = search.toLowerCase();
    return (
      r.fullName.toLowerCase().includes(q) ||
      r.cpf.includes(q) ||
      r.email.toLowerCase().includes(q) ||
      r.licensePlate.toLowerCase().includes(q)
    );
  });

  if (authenticated === null) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f5f7fa]">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-veloe-cyan border-t-transparent" />
      </div>
    );
  }

  if (!authenticated) {
    return <AdminLogin onSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="min-h-screen bg-[#f5f7fa]">
      <header className="bg-veloe-navy px-6 py-5">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-white sm:text-2xl">
              Painel Admin — Veloe
            </h1>
            <p className="mt-1 text-sm text-white/70">
              Gerencie os cadastros recebidos
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-full border border-white/20 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-white/10"
            >
              Sair
            </button>
            <a
              href="/"
              className="rounded-full border border-white/20 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-white/10"
            >
              Voltar ao site
            </a>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-white px-4 py-3 shadow-sm">
              <p className="text-xs text-veloe-navy/50">Total de cadastros</p>
              <p className="text-2xl font-bold text-veloe-navy">
                {registrations.length}
              </p>
            </div>
            <div className="rounded-xl bg-white px-4 py-3 shadow-sm">
              <p className="text-xs text-veloe-navy/50">Hoje</p>
              <p className="text-2xl font-bold text-veloe-cyan">
                {
                  registrations.filter(
                    (r) =>
                      new Date(r.createdAt).toDateString() ===
                      new Date().toDateString()
                  ).length
                }
              </p>
            </div>
          </div>

          <input
            type="search"
            placeholder="Buscar por nome, CPF, e-mail ou placa..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-veloe-navy outline-none focus:border-veloe-cyan sm:max-w-md"
          />
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-veloe-cyan border-t-transparent" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-2xl bg-white py-16 text-center shadow-sm">
            <p className="text-veloe-navy/60">Nenhum cadastro encontrado.</p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px] text-left text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-[#f8f9fc]">
                    <th className="px-4 py-3 font-semibold text-veloe-navy">Nome</th>
                    <th className="px-4 py-3 font-semibold text-veloe-navy">CPF</th>
                    <th className="px-4 py-3 font-semibold text-veloe-navy">E-mail</th>
                    <th className="px-4 py-3 font-semibold text-veloe-navy">Telefone</th>
                    <th className="px-4 py-3 font-semibold text-veloe-navy">Placa</th>
                    <th className="px-4 py-3 font-semibold text-veloe-navy">Banco</th>
                    <th className="px-4 py-3 font-semibold text-veloe-navy">Dispositivo</th>
                    <th className="px-4 py-3 font-semibold text-veloe-navy">Data</th>
                    <th className="px-4 py-3 font-semibold text-veloe-navy">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((r) => (
                    <tr
                      key={r.id}
                      className="border-b border-gray-50 transition-colors hover:bg-veloe-cyan/5"
                    >
                      <td className="px-4 py-3 font-medium text-veloe-navy">
                        <span className="flex items-center gap-2">
                          {newIds.has(r.id) && (
                            <span
                              className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-green-500 text-white shadow-[0_0_0_2px_rgba(34,197,94,0.25)]"
                              title="Novo cadastro"
                              aria-label="Novo cadastro"
                            >
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                                <path
                                  d="M12 2a7 7 0 00-7 7v3.1l-1.4 2.8A1 1 0 005.6 16h12.8a1 1 0 00.9-1.5L18 12.1V9a7 7 0 00-7-7zM10 20a2 2 0 004 0"
                                  stroke="currentColor"
                                  strokeWidth="1.8"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            </span>
                          )}
                          {r.fullName}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-veloe-navy/70">{r.cpf}</td>
                      <td className="px-4 py-3 text-veloe-navy/70">{r.email}</td>
                      <td className="px-4 py-3 text-veloe-navy/70">{r.phone}</td>
                      <td className="px-4 py-3 font-mono text-veloe-navy/70">
                        {r.licensePlate}
                      </td>
                      <td className="px-4 py-3 text-veloe-navy/70">
                        {r.bank || "—"}
                      </td>
                      <td
                        className={`px-4 py-3 text-center text-xs font-semibold text-white ${
                          r.deviceType === "iphone" ? "bg-green-500" : "bg-blue-500"
                        }`}
                      >
                        {r.deviceType === "iphone" ? "iPhone" : "Android"}
                      </td>
                      <td className="px-4 py-3 text-veloe-navy/50">
                        {new Date(r.createdAt).toLocaleDateString("pt-BR")}
                      </td>
                      <td className="px-4 py-3">
                        <button
                          type="button"
                          onClick={() => {
                            setSelected(r);
                            setNewIds((prev) => {
                              const next = new Set(prev);
                              next.delete(r.id);
                              return next;
                            });
                          }}
                          className="mr-2 rounded-lg bg-veloe-navy/10 px-3 py-1.5 text-xs font-semibold text-veloe-navy transition-colors hover:bg-veloe-navy/20"
                        >
                          Ver
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(r.id)}
                          className="rounded-lg bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600 transition-colors hover:bg-red-100"
                        >
                          Excluir
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() => setSelected(null)}
        >
          <div
            className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between">
              <h2 className="text-lg font-bold text-veloe-navy">
                Detalhes do cadastro
              </h2>
              <button
                type="button"
                onClick={() => setSelected(null)}
                className="text-veloe-navy/40 hover:text-veloe-navy"
              >
                ✕
              </button>
            </div>

            <dl className="mt-4 space-y-3 text-sm">
              <DetailRow label="Nome" value={selected.fullName} />
              <DetailRow label="CPF" value={selected.cpf} />
              <DetailRow label="E-mail" value={selected.email} />
              <DetailRow label="Telefone" value={selected.phone} />
              <DetailRow
                label="Dispositivo"
                value={selected.deviceType === "iphone" ? "iPhone" : "Android"}
              />
              <DetailRow
                label="Marketing"
                value={selected.marketingOptIn ? "Sim" : "Não"}
              />
              <DetailRow
                label="Entrega em casa"
                value={selected.deliveryChoice === "yes" ? "Sim" : "Não"}
              />
              <DetailRow
                label="Adesivos"
                value={String(selected.stickerCount)}
              />
              <DetailRow label="Banco" value={selected.bank || "—"} />
              <DetailRow label="Placa" value={selected.licensePlate} />
              <DetailRow label="Veículo" value={selected.vehicleType} />
              <DetailRow
                label="Cadastrado em"
                value={new Date(selected.createdAt).toLocaleString("pt-BR")}
              />
            </dl>

            <button
              type="button"
              onClick={() => handleDelete(selected.id)}
              className="mt-6 w-full rounded-full bg-red-50 py-3 text-sm font-bold text-red-600 transition-colors hover:bg-red-100"
            >
              Excluir cadastro
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 border-b border-gray-50 pb-2">
      <dt className="text-veloe-navy/50">{label}</dt>
      <dd className="text-right font-medium text-veloe-navy">{value}</dd>
    </div>
  );
}

"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import type { Registration } from "@/lib/types";
import AdminLogin from "@/components/admin/AdminLogin";
import {
  playNotificationSound,
  unlockSuccessSound,
  warmSuccessSound,
} from "@/lib/successSound";

const POLL_INTERVAL_MS = 4000;

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<Registration | null>(null);
  const [search, setSearch] = useState("");
  const [newSubscriberIds, setNewSubscriberIds] = useState<Set<string>>(
    () => new Set()
  );
  const knownIdsRef = useRef<Set<string> | null>(null);

  const checkSession = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/login", { cache: "no-store" });
      const data = (await res.json()) as { authenticated?: boolean };
      setAuthenticated(Boolean(data.authenticated));
    } catch {
      setAuthenticated(false);
    }
  }, []);

  const fetchRegistrations = useCallback(async (): Promise<
    Registration[] | null
  > => {
    try {
      const res = await fetch("/api/registrations", { cache: "no-store" });
      if (res.status === 401) {
        setAuthenticated(false);
        setRegistrations([]);
        return null;
      }
      if (!res.ok) return null;

      const data = (await res.json()) as Registration[] | { error?: string };
      return Array.isArray(data) ? data : [];
    } catch {
      return null;
    }
  }, []);

  const applyRegistrations = useCallback(
    (data: Registration[], isInitial: boolean) => {
      if (isInitial || knownIdsRef.current === null) {
        knownIdsRef.current = new Set(data.map((r) => r.id));
        setRegistrations(data);
        return;
      }

      const freshIds: string[] = [];
      const known = knownIdsRef.current;

      for (const registration of data) {
        if (!known.has(registration.id)) {
          freshIds.push(registration.id);
          known.add(registration.id);
        }
      }

      setRegistrations(data);

      if (freshIds.length > 0) {
        setNewSubscriberIds((prev) => {
          const next = new Set(prev);
          freshIds.forEach((id) => next.add(id));
          return next;
        });
        playNotificationSound();
      }
    },
    []
  );

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchRegistrations();
      if (data === null) return;
      applyRegistrations(data, true);
    } finally {
      setLoading(false);
    }
  }, [applyRegistrations, fetchRegistrations]);

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

    warmSuccessSound();
    unlockSuccessSound();

    const unlock = () => {
      unlockSuccessSound();
      window.removeEventListener("pointerdown", unlock);
    };
    window.addEventListener("pointerdown", unlock, { once: true });

    const poll = async () => {
      const data = await fetchRegistrations();
      if (data !== null) {
        applyRegistrations(data, false);
      }
    };

    const intervalId = window.setInterval(poll, POLL_INTERVAL_MS);
    return () => {
      window.clearInterval(intervalId);
      window.removeEventListener("pointerdown", unlock);
    };
  }, [authenticated, applyRegistrations, fetchRegistrations]);

  const handleLoginSuccess = () => {
    unlockSuccessSound();
    setAuthenticated(true);
  };

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    setAuthenticated(false);
    setRegistrations([]);
    setSelected(null);
    setNewSubscriberIds(new Set());
    knownIdsRef.current = null;
  };

  const handleView = (registration: Registration) => {
    setSelected(registration);
    setNewSubscriberIds((prev) => {
      if (!prev.has(registration.id)) return prev;
      const next = new Set(prev);
      next.delete(registration.id);
      return next;
    });
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/registrations/${id}`, { method: "DELETE" });
      if (!res.ok) return;

      setRegistrations((prev) => prev.filter((r) => r.id !== id));
      setSelected((current) => (current?.id === id ? null : current));
      setNewSubscriberIds((prev) => {
        if (!prev.has(id)) return prev;
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
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
                      className={`border-b border-gray-50 transition-colors hover:bg-veloe-cyan/5 ${
                        newSubscriberIds.has(r.id) ? "bg-green-50/60" : ""
                      }`}
                    >
                      <td className="px-4 py-3 font-medium text-veloe-navy">
                        <span className="flex items-center gap-2">
                          {newSubscriberIds.has(r.id) && (
                            <span
                              className="relative flex h-5 w-5 shrink-0 items-center justify-center"
                              title="Novo cadastro"
                            >
                              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
                              <span className="relative flex h-5 w-5 items-center justify-center rounded-full bg-green-500 text-white">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                                  <path
                                    d="M12 3a6 6 0 00-6 6v2.1l-1.4 1.4a1 1 0 00-.3.7V18a2 2 0 002 2h11a2 2 0 002-2v-4.8a1 1 0 00-.3-.7L18 11.1V9a6 6 0 00-6-6z"
                                    stroke="currentColor"
                                    strokeWidth="1.8"
                                    strokeLinejoin="round"
                                  />
                                </svg>
                              </span>
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
                          onClick={() => handleView(r)}
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

import { get, list, put } from "@vercel/blob";
import { promises as fs } from "fs";
import path from "path";
import type { Registration } from "./types";

const BLOB_PATH = "registrations.json";
const LOCAL_DATA_FILE = path.join(process.cwd(), "data", "registrations.json");

function isVercelEnv(): boolean {
  return Boolean(process.env.VERCEL);
}

function shouldUseBlobStorage(): boolean {
  return (
    isVercelEnv() ||
    Boolean(process.env.BLOB_READ_WRITE_TOKEN) ||
    Boolean(process.env.VERCEL_OIDC_TOKEN)
  );
}

async function ensureLocalDataFile(): Promise<void> {
  await fs.mkdir(path.dirname(LOCAL_DATA_FILE), { recursive: true });
  try {
    await fs.access(LOCAL_DATA_FILE);
  } catch {
    await fs.writeFile(LOCAL_DATA_FILE, "[]", "utf-8");
  }
}

async function readFromBlob(): Promise<Registration[]> {
  try {
    const result = await get(BLOB_PATH, { access: "public" });
    if (!result || result.statusCode !== 200) return [];

    const text = await new Response(result.stream).text();
    if (!text.trim()) return [];

    const parsed = JSON.parse(text) as unknown;
    return Array.isArray(parsed) ? (parsed as Registration[]) : [];
  } catch {
    const { blobs } = await list({ prefix: BLOB_PATH });
    const blob = blobs.find((item) => item.pathname === BLOB_PATH);
    if (!blob) return [];

    const response = await fetch(`${blob.downloadUrl}?v=${Date.now()}`, {
      cache: "no-store",
    });
    if (!response.ok) return [];

    const parsed = (await response.json()) as unknown;
    return Array.isArray(parsed) ? (parsed as Registration[]) : [];
  }
}

async function readFromLocal(): Promise<Registration[]> {
  await ensureLocalDataFile();
  const raw = await fs.readFile(LOCAL_DATA_FILE, "utf-8");
  if (!raw.trim()) return [];

  const parsed = JSON.parse(raw) as unknown;
  return Array.isArray(parsed) ? (parsed as Registration[]) : [];
}

async function writeToBlob(registrations: Registration[]): Promise<void> {
  await put(BLOB_PATH, JSON.stringify(registrations, null, 2), {
    access: "public",
    contentType: "application/json",
    addRandomSuffix: false,
    allowOverwrite: true,
  });
}

async function writeToLocal(registrations: Registration[]): Promise<void> {
  await ensureLocalDataFile();
  await fs.writeFile(
    LOCAL_DATA_FILE,
    JSON.stringify(registrations, null, 2),
    "utf-8"
  );
}

async function readRegistrations(): Promise<Registration[]> {
  if (shouldUseBlobStorage()) {
    return readFromBlob();
  }
  return readFromLocal();
}

async function writeRegistrations(registrations: Registration[]): Promise<void> {
  if (shouldUseBlobStorage()) {
    await writeToBlob(registrations);
    return;
  }
  await writeToLocal(registrations);
}

export async function getRegistrations(): Promise<Registration[]> {
  return readRegistrations();
}

export async function saveRegistration(
  registration: Registration
): Promise<Registration> {
  const registrations = await readRegistrations();
  const index = registrations.findIndex((item) => item.id === registration.id);

  if (index >= 0) {
    registrations[index] = registration;
  } else {
    registrations.unshift(registration);
  }

  await writeRegistrations(registrations);
  return registration;
}

export async function deleteRegistration(id: string): Promise<boolean> {
  const registrations = await readRegistrations();
  const filtered = registrations.filter((item) => item.id !== id);

  if (filtered.length === registrations.length) return false;

  await writeRegistrations(filtered);
  return true;
}

export async function getRegistrationById(
  id: string
): Promise<Registration | null> {
  const registrations = await readRegistrations();
  return registrations.find((item) => item.id === id) ?? null;
}

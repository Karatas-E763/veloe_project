import { get, list, put } from "@vercel/blob";
import { promises as fs } from "fs";
import path from "path";
import type { Registration } from "./types";

const BLOB_PATH = "registrations.json";
const BLOB_ACCESS = "private" as const;
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

function getBlobAuthOptions() {
  const options: { token?: string; storeId?: string } = {};

  if (process.env.BLOB_READ_WRITE_TOKEN) {
    options.token = process.env.BLOB_READ_WRITE_TOKEN;
  }

  if (process.env.BLOB_STORE_ID) {
    options.storeId = process.env.BLOB_STORE_ID;
  }

  return options;
}

async function ensureLocalDataFile(): Promise<void> {
  await fs.mkdir(path.dirname(LOCAL_DATA_FILE), { recursive: true });
  try {
    await fs.access(LOCAL_DATA_FILE);
  } catch {
    await fs.writeFile(LOCAL_DATA_FILE, "[]", "utf-8");
  }
}

async function resolveBlobUrl(): Promise<string | null> {
  const auth = getBlobAuthOptions();
  const { blobs } = await list({ prefix: BLOB_PATH, ...auth });
  return blobs.find((blob) => blob.pathname === BLOB_PATH)?.url ?? null;
}

async function readFromBlob(): Promise<Registration[]> {
  const auth = getBlobAuthOptions();
  const blobUrl = await resolveBlobUrl();

  const result = blobUrl
    ? await get(blobUrl, { access: BLOB_ACCESS, ...auth })
    : await get(BLOB_PATH, { access: BLOB_ACCESS, ...auth });

  if (!result || result.statusCode !== 200 || !result.stream) {
    return [];
  }

  const raw = await new Response(result.stream).text();
  if (!raw.trim()) return [];

  const parsed = JSON.parse(raw) as unknown;
  return Array.isArray(parsed) ? (parsed as Registration[]) : [];
}

async function readFromLocal(): Promise<Registration[]> {
  await ensureLocalDataFile();
  const raw = await fs.readFile(LOCAL_DATA_FILE, "utf-8");
  if (!raw.trim()) return [];

  const parsed = JSON.parse(raw) as unknown;
  return Array.isArray(parsed) ? (parsed as Registration[]) : [];
}

async function writeToBlob(registrations: Registration[]): Promise<void> {
  const auth = getBlobAuthOptions();

  await put(BLOB_PATH, JSON.stringify(registrations, null, 2), {
    access: BLOB_ACCESS,
    contentType: "application/json",
    addRandomSuffix: false,
    allowOverwrite: true,
    ...auth,
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

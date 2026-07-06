import { get, put } from "@vercel/blob";
import type { Registration } from "./types";

const BLOB_PATH = "registrations.json";
const BLOB_ACCESS = "private" as const;

async function readRegistrations(): Promise<Registration[]> {
  try {
    const result = await get(BLOB_PATH, { access: BLOB_ACCESS });
    if (!result?.stream) return [];

    const raw = await new Response(result.stream).text();
    if (!raw.trim()) return [];

    return JSON.parse(raw) as Registration[];
  } catch {
    return [];
  }
}

async function writeRegistrations(registrations: Registration[]): Promise<void> {
  await put(BLOB_PATH, JSON.stringify(registrations, null, 2), {
    access: BLOB_ACCESS,
    contentType: "application/json",
    addRandomSuffix: false,
    allowOverwrite: true,
  });
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

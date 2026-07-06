import { promises as fs } from "fs";
import path from "path";
import type { Registration } from "./types";

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "registrations.json");

async function ensureDataFile(): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  try {
    await fs.access(DATA_FILE);
  } catch {
    await fs.writeFile(DATA_FILE, "[]", "utf-8");
  }
}

export async function getRegistrations(): Promise<Registration[]> {
  await ensureDataFile();
  const raw = await fs.readFile(DATA_FILE, "utf-8");
  return JSON.parse(raw) as Registration[];
}

export async function saveRegistration(
  registration: Registration
): Promise<Registration> {
  const registrations = await getRegistrations();
  const index = registrations.findIndex((item) => item.id === registration.id);

  if (index >= 0) {
    registrations[index] = registration;
  } else {
    registrations.unshift(registration);
  }

  await fs.writeFile(DATA_FILE, JSON.stringify(registrations, null, 2), "utf-8");
  return registration;
}

export async function deleteRegistration(id: string): Promise<boolean> {
  const registrations = await getRegistrations();
  const filtered = registrations.filter((item) => item.id !== id);

  if (filtered.length === registrations.length) return false;

  await fs.writeFile(DATA_FILE, JSON.stringify(filtered, null, 2), "utf-8");
  return true;
}

export async function getRegistrationById(
  id: string
): Promise<Registration | null> {
  const registrations = await getRegistrations();
  return registrations.find((item) => item.id === id) ?? null;
}

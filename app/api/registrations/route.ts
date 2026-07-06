import { NextResponse } from "next/server";
import { requireAdminAuth } from "@/lib/admin-guard";
import { getRegistrations, saveRegistration } from "@/lib/storage";
import type { Registration } from "@/lib/types";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  const authError = await requireAdminAuth();
  if (authError) return authError;

  try {
    const registrations = await getRegistrations();
    return NextResponse.json(registrations, {
      headers: { "Cache-Control": "no-store, max-age=0" },
    });
  } catch (error) {
    console.error("GET /api/registrations failed:", error);
    return NextResponse.json(
      { error: "Failed to load registrations" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Partial<Registration>;
    const now = new Date().toISOString();

    const registration: Registration = {
      id: body.id ?? crypto.randomUUID(),
      createdAt: body.createdAt ?? now,
      updatedAt: now,
      fullName: body.fullName ?? "",
      cpf: body.cpf ?? "",
      birthDate: body.birthDate ?? "",
      email: body.email ?? "",
      phone: body.phone ?? "",
      deviceType: body.deviceType ?? "iphone",
      marketingOptIn: body.marketingOptIn ?? false,
      deliveryChoice: body.deliveryChoice ?? "yes",
      stickerCount: body.stickerCount ?? 1,
      bank: body.bank ?? "",
      licensePlate: body.licensePlate ?? "",
      vehicleType: body.vehicleType ?? "CARRO",
      homeTab: body.homeTab ?? "pessoa-fisica",
    };

    const saved = await saveRegistration(registration);
    return NextResponse.json(saved, { status: 201 });
  } catch (error) {
    console.error("POST /api/registrations failed:", error);
    return NextResponse.json(
      { error: "Failed to save registration" },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";
import { getRegistrations, saveRegistration } from "@/lib/storage";
import type { Registration } from "@/lib/types";

export async function GET() {
  try {
    const registrations = await getRegistrations();
    return NextResponse.json(registrations);
  } catch {
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
      licensePlate: body.licensePlate ?? "",
      vehicleType: body.vehicleType ?? "CARRO",
      homeTab: body.homeTab ?? "pessoa-fisica",
    };

    const saved = await saveRegistration(registration);
    return NextResponse.json(saved, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Failed to save registration" },
      { status: 500 }
    );
  }
}

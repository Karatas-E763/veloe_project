import { NextResponse } from "next/server";
import { deleteRegistration, getRegistrationById } from "@/lib/storage";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const registration = await getRegistrationById(id);

    if (!registration) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json(registration);
  } catch {
    return NextResponse.json(
      { error: "Failed to load registration" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const deleted = await deleteRegistration(id);

    if (!deleted) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Failed to delete registration" },
      { status: 500 }
    );
  }
}

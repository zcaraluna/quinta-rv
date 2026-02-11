import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { bookings } from "@/lib/schema";
import { format } from "date-fns";
import { and, inArray, isNull } from "drizzle-orm";

export async function GET() {
  // Solo reservas activas con estado Reservado o Pagado
  const exported = await db
    .select()
    .from(bookings)
    .where(
      and(
        isNull(bookings.deletedAt),
        inArray(bookings.status, ["RESERVED", "CONFIRMED"] as const),
      ),
    );

  const header = [
    "ID",
    "Nombre",
    "Telefono",
    "FechaYTurno",
    "Estado",
  ];

  const rows = exported.map((b) => {
    const fecha = b.bookingDate ? format(b.bookingDate, "dd/MM/yyyy") : "";
    const turno = b.slot === "DAY" ? "Día" : "Noche";
    const estado =
      b.status === "RESERVED"
        ? "Reservado"
        : b.status === "CONFIRMED"
        ? "Pagado"
        : b.status;

    return [
      b.id,
      b.guestName,
      b.guestWhatsapp,
      `${fecha} - ${turno}`,
      estado,
    ];
  });

  const csvBody = [header, ...rows]
    .map((cols) =>
      cols
        .map((value) => {
          const v = value ?? "";
          const s = String(v).replace(/"/g, '""');
          return `"${s}"`;
        })
        .join(","),
    )
    .join("\r\n");

  // Añadimos BOM UTF-8 para que Excel en Windows reconozca correctamente acentos y ñ
  const csvWithBom = "\uFEFF" + csvBody;

  return new NextResponse(csvWithBom, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="reservas.csv"`,
    },
  });
}


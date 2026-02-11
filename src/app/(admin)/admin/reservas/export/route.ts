import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { bookings } from "@/lib/schema";
import { format } from "date-fns";

export async function GET() {
  const allBookings = await db.select().from(bookings);

  const header = [
    "ID",
    "Nombre",
    "Email",
    "Whatsapp",
    "FechaReserva",
    "Turno",
    "PromoPareja",
    "PrecioTotal",
    "Estado",
    "CreadoEn",
    "ExpiraEn",
  ];

  const rows = allBookings.map((b) => [
    b.id,
    b.guestName,
    b.guestEmail,
    b.guestWhatsapp,
    b.bookingDate ? format(b.bookingDate, "yyyy-MM-dd") : "",
    b.slot,
    b.isCouplePromo,
    b.totalPrice,
    b.status,
    b.createdAt ? format(b.createdAt, "yyyy-MM-dd HH:mm") : "",
    b.expiresAt ? format(b.expiresAt, "yyyy-MM-dd HH:mm") : "",
  ]);

  const csvContent = [header, ...rows]
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

  return new NextResponse(csvContent, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="reservas.csv"`,
    },
  });
}


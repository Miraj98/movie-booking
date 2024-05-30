import db from "@/db/client";
import { show_seats } from "@/db/schema";
import { and, eq, gte, inArray, or } from "drizzle-orm";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(_req: NextRequest, ctx: { params: { show_id: string } }) {
	const showId = parseInt(ctx.params.show_id);
	const seats = await db.query.show_seats.findMany({
		where: (s, ops) => ops.eq(s.showId, showId)
	})

	return NextResponse.json(seats.map(s => ({ seat: s.seat, status: s.status, id: s.id, showId: s.showId })));
}

export async function PATCH(req: NextRequest, ctx: { params: { show_id: string } }) {
	const userId = headers().get("x-user-id");
	if (!userId) {
		return NextResponse.json({ message: "Not authorized" }, { status: 401 });
	}

	const showId = parseInt(ctx.params.show_id);
	const payload = await req.json()
	if (!payload.action || (payload.action !== 'select' && payload.action !== 'book')) {
		return NextResponse.json({ message: "Invalid 'action' field value" }, { status: 400 });
	}

	const date = new Date();
	date.setMinutes(date.getMinutes() - 10)

	switch (payload.action) {
		case 'select':
			return await db.transaction(async tx => {
				const seatsToHold = await tx.query.show_seats.findMany({
					where: (s, ops) => ops.and(
						ops.eq(s.showId, showId),
						ops.inArray(s.seat, payload.seats),
						ops.ne(s.status, "booked"),
					)
				});
				if (seatsToHold.length !== payload.seats.length) {
					return NextResponse.json({ message: "Not all seats are available at the moment" }, { status: 400 })
				}

				for (const s of seatsToHold) {
					if (
						s.status == 'on-hold' &&
						s.holdBy !== userId &&
						s.holdAt!.getTime() > date.getTime()
					) {
						return NextResponse.json({ message: "Not all seats are available at the moment" }, { status: 400 })
					}
				}
				await tx
					.update(show_seats)
					.set({ status: 'on-hold', holdBy: userId, holdAt: new Date() })
					.where(
						and(
							eq(show_seats.showId, showId),
							inArray(show_seats.seat, payload.seats)
						)
					)

				return NextResponse.json({ success: true, action: 'select', seats: payload.seats })
			})
		case 'book':
			return await db.transaction(async tx => {
				const seatsToBook = await tx.query.show_seats.findMany({
					where: (s, ops) => ops.and(
						ops.eq(s.showId, showId),
						ops.eq(s.holdBy, userId),
						ops.inArray(s.seat, payload.seats),
						ops.eq(s.status, "on-hold"),
					)
				});
				if (seatsToBook.length !== payload.seats.length) {
					tx.rollback()
					return NextResponse.json({ message: "Not all seats are available at the moment" }, { status: 400 })
				}

				for (const s of seatsToBook) {
					if (s.holdAt!.getTime() < date.getTime()) {
						return NextResponse.json({ message: "Timed out, try selecting the seats again" }, { status: 400 })
					}
				}
				await tx
					.update(show_seats)
					.set({ status: 'booked', holdBy: userId, holdAt: new Date() })
					.where(
						and(
							eq(show_seats.showId, showId),
							inArray(show_seats.seat, payload.seats)
						)
					)

				return NextResponse.json({ success: true, action: 'book', seats: payload.seats })
			})
	}
}

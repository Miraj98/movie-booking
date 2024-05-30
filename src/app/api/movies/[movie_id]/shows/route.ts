import db from "@/db/client";
import { sql } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, ctx: { params: { movie_id: string } }) {
	const city = req.nextUrl.searchParams.get("city");
	if (!city) {
		return NextResponse.json({ message: "Need to pass a valid 'city' as query parameter" });
	}

	const cinemas = await db.query.cinemas.findMany({
		where: (c, ops) => ops.eq(c.city, city),
		with: {
			movieShows: {
				where: (ms, ops) => ops.eq(ms.movieId, parseInt(ctx.params.movie_id)),
				columns: {
					showTime: true,
					id: true,
				},
				orderBy: (ms) => ms.showTime
			},
		}
	})

	return NextResponse.json(cinemas.filter(c => c.movieShows.length > 0))

}

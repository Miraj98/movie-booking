import db from "@/db/client";
import { movies } from "@/db/schema";
import { sql } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
	const city = req.nextUrl.searchParams.get("city");
	if (!city) {
		return NextResponse.json(await db.select().from(movies))
	}
	const cinemas = await db.query.cinemas.findMany({
		where: (c, ops) => ops.eq(c.city, city),
		with: {
			movieShows: {
				columns: {
					id: true,
					movieId: true
				},
				with: {
					movie: true
				}
			}
		},
	})

	const res: any[] = [];
	const added = new Set<number>()

	cinemas.forEach(c => {
		c.movieShows.forEach(show => {
			if (!added.has(show.movieId!)) {
				res.push(show.movie)
				added.add(show.movieId!)
			}
		})
	})

	return NextResponse.json(res);
}

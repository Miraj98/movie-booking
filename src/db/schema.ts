import { relations } from "drizzle-orm";
import { text, integer, sqliteTable } from "drizzle-orm/sqlite-core";

export const cinemas = sqliteTable("cinemas", {
	id: integer("id").primaryKey({ autoIncrement: true }),
	city: text("city"),
	name: text("name"),
})


export const movies = sqliteTable("movies", {
	id: integer("id").primaryKey({ autoIncrement: true }),
	name: text("name"),
	posterUrl: text("poster_url"),
})

export const movie_shows = sqliteTable("movie_shows", {
	id: integer("id").primaryKey({ autoIncrement: true }),
	movieId: integer("movie_id").references(() => movies.id),
	cinemaId: integer("cinema_id").references(() => cinemas.id),
	showTime: integer("show_time"),
})

export const show_seats = sqliteTable("show_seats", {
	id: integer("id").primaryKey({ autoIncrement: true }),
	status: text("status", { enum: ["available", "on-hold", "booked"] }).default("available"),
	holdAt: integer("hold_at", { mode: 'timestamp' }),
	holdBy: text('hold_by'),
	showId: integer("show_id").references(() => movie_shows.id),
	seat: text("seat")
})

export const movieShowsRelations = relations(movie_shows, ({ one }) => ({
	movie: one(movies, {
		fields: [movie_shows.movieId],
		references: [movies.id]
	}),
	cinema: one(cinemas, {
		fields: [movie_shows.cinemaId],
		references: [cinemas.id]
	}),
}))

export const cinemaRelations = relations(cinemas, ({ many }) => ({
	movieShows: many(movie_shows)
}))

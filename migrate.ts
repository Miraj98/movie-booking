import { migrate } from 'drizzle-orm/libsql/migrator';
import db, { client } from './src/db/client';
import movieData from "./movie-data.json";
import cinemaData from "./cinemas-data.json";
import movieShowsData from "./movieshows-data.json";
import { cinemas, movie_shows, movies, show_seats } from '@/db/schema';


async function main() {
	try {
		await migrate(db, { migrationsFolder: './drizzle' });
		// await db.delete(movies)
		// await db.delete(cinemas)
		// await db.delete(movie_shows)
		//
		await db.insert(movies).values(movieData.map(d => ({ name: d.movie, posterUrl: d.image })))
		await db.insert(cinemas).values(cinemaData)
		await db.insert(movie_shows).values(movieShowsData)
		const allShows = await db.query.movie_shows.findMany();
		for (const s of allShows) {
			const seatsStatus = new Array(48).fill(0).map((_, i) => ({ seat: `${i}`, holdBy: null, holdAt: null, showId: s.id }))
			await db.insert(show_seats).values(seatsStatus)
		}
	} catch (err) {
		console.error(err);
	} finally {
		// Don't forget to close the connection, otherwise the script will hang
		client.close();
		process.exit(0);
	}
}

main();


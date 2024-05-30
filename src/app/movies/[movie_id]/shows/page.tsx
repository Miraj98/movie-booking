"use client"

import Link from "next/link"
import { useEffect, useState } from "react"

export default function MovieShows(props: { params: { movie_id: string }, searchParams: { city: string } }) {
	const [data, setData] = useState<Array<{ id: number, movieShows: any[], name: string }>>([])
	useEffect(() => {
		fetch(`/api/movies/${props.params.movie_id}/shows?city=${props.searchParams.city}`)
			.then(v => v.json())
			.then(d => setData(d))
	}, [])
	console.log(data)
	return (
		<main className="flex flex-1 h-screen px-[10.78vw] bg-white">
			<section className="flex flex-col flex-1 h-full  pt-12">
				<div className="flex w-full justify-between items-center border-b-gray-200 border-b pb-4 mb-4">
					<h1 className="font-bold text-4xl">Show timings</h1>
				</div>
				<ul>
					{data.map((val, i) => (
						<li key={`${i}`}>
							<Link
								className="hover:underline text-xl font-medium"
								href={`/movies/shows/${val.id}`}
							>
								{val.name}
							</Link>
							<div className="flex flex-1 flex-wrap gap-4 mt-2">
								{val.movieShows.map(s => (
									<div
										key={`${s.id}`}
										className="hover:bg-gray-200 hover:cursor-pointer px-2 py-1 rounded-md border"
									>
										{timeString(s.showTime)}
									</div>
								))}
							</div>
						</li>
					))}
				</ul>
			</section>
		</main>
	)
}

function timeString(timeNum: number): string {
	let hours = `${timeNum / 100}`
	let minutes = `${timeNum % 100}`
	if (hours.length === 1) hours = '0' + hours
	if (minutes.length === 1) minutes = '0' + minutes
	return `${hours}:${minutes}`
}

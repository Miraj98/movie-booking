"use client"

import Link from "next/link"
import { useEffect, useState } from "react"

export default function MoviesList() {
	const [city, setCity] = useState<string>("Mumbai")
	const [data, setData] = useState<Array<{ name: string, id: number }>>([])

	useEffect(() => {
		fetch(`/api/movies?city=${city}`)
			.then(res => res.json())
			.then(d => setData(d))
	}, [city])

	return (
		<main className="flex flex-1 h-screen px-[10.78vw] bg-white">
			<section className="flex flex-col flex-1 h-full  pt-12">
				<div className="flex w-full justify-between items-center border-b-gray-200 border-b pb-4 mb-4">
					<h1 className="font-bold text-4xl">Movies</h1>
					<select
						value={city}
						onChange={e => setCity(e.target.value)}
						className="hover:cursor-pointer" name="city" id="city-selector">
						<option value="Mumbai">Mumbai</option>
						<option value="Bangalore">Bangalore</option>
					</select>
				</div>
				<table>
					<tbody>
						{data.map((val, i) => (
							<tr key={`${i}`}>
								<td>{i + 1}.</td>
								<td>
									<Link className="hover:underline" href={`/movies/${val.id}/shows?city=${city}`}>{val.name}</Link>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</section>
		</main>
	)
}

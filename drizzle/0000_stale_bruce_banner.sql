CREATE TABLE `cinemas` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`city` text,
	`name` text
);
--> statement-breakpoint
CREATE TABLE `movie_shows` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`movie_id` integer,
	`cinema_id` integer,
	`show_time` integer,
	FOREIGN KEY (`movie_id`) REFERENCES `movies`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`cinema_id`) REFERENCES `cinemas`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `movies` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text,
	`poster_url` text
);
--> statement-breakpoint
CREATE TABLE `show_seats` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`status` text DEFAULT 'available',
	`hold_at` integer,
	`hold_by` text,
	`show_id` integer,
	`seat` text,
	FOREIGN KEY (`show_id`) REFERENCES `movie_shows`(`id`) ON UPDATE no action ON DELETE no action
);

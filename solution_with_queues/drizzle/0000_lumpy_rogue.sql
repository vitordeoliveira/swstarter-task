CREATE TABLE `request_timings` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`url` text NOT NULL,
	`method` text DEFAULT 'GET' NOT NULL,
	`duration` integer NOT NULL,
	`status_code` integer,
	`timestamp` integer NOT NULL
);

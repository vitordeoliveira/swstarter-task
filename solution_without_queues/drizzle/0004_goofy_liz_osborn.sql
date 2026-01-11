CREATE TABLE `search_queries` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`query` text NOT NULL,
	`search_type` text NOT NULL,
	`timestamp` integer NOT NULL
);

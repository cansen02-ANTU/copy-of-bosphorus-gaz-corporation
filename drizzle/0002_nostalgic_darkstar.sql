CREATE TABLE `gallery_albums` (
	`id` int AUTO_INCREMENT NOT NULL,
	`slug` varchar(191) NOT NULL,
	`title` varchar(500) NOT NULL,
	`description` text,
	`coverUrl` text,
	`sortOrder` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `gallery_albums_id` PRIMARY KEY(`id`),
	CONSTRAINT `gallery_albums_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `gallery_photos` (
	`id` int AUTO_INCREMENT NOT NULL,
	`albumId` int NOT NULL,
	`imageUrl` text NOT NULL,
	`imageKey` varchar(500),
	`caption` varchar(500),
	`sortOrder` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `gallery_photos_id` PRIMARY KEY(`id`)
);

CREATE TABLE `gallery_images` (
	`id` int AUTO_INCREMENT NOT NULL,
	`caption` varchar(500) NOT NULL,
	`imageUrl` text NOT NULL,
	`imageKey` varchar(500),
	`sortOrder` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `gallery_images_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `news_articles` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(500) NOT NULL,
	`excerpt` text NOT NULL,
	`content` text,
	`imageUrl` text,
	`imageKey` varchar(500),
	`publishedAt` bigint NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `news_articles_id` PRIMARY KEY(`id`)
);

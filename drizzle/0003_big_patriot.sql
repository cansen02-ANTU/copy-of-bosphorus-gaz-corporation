CREATE TABLE `gas_requests` (
	`id` int AUTO_INCREMENT NOT NULL,
	`companyName` varchar(500) NOT NULL,
	`contactPerson` varchar(300) NOT NULL,
	`email` varchar(320) NOT NULL,
	`phone` varchar(100) NOT NULL,
	`facilityAddress` text NOT NULL,
	`facilityProvince` varchar(200) NOT NULL,
	`annualConsumption` varchar(50) NOT NULL,
	`usagePurpose` varchar(50),
	`monthlyUsage` text,
	`personnelName` varchar(300),
	`personnelPosition` varchar(300),
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `gas_requests_id` PRIMARY KEY(`id`)
);

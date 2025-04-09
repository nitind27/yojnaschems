-- CreateTable
CREATE TABLE `tbl_supervisor` (
    `sup_id` INTEGER NOT NULL AUTO_INCREMENT,
    `sup_contact` VARCHAR(255) NOT NULL,
    `sup_password` VARCHAR(255) NOT NULL,

    UNIQUE INDEX `tbl_supervisor_sup_contact_key`(`sup_contact`),
    PRIMARY KEY (`sup_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tbl_members` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `mobile_no` VARCHAR(20) NOT NULL,
    `address` VARCHAR(255) NOT NULL,
    `qr_id` VARCHAR(255) NOT NULL,
    `status` VARCHAR(50) NOT NULL,
    `ins_date_time` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `verify_date_time` DATETIME(3) NULL,

    UNIQUE INDEX `tbl_members_qr_id_key`(`qr_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

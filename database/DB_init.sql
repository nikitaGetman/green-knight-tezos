-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------
DROP SCHEMA IF EXISTS `mydb` ;

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `mydb` DEFAULT CHARACTER SET utf8 ;
USE `mydb` ;

-- -----------------------------------------------------
-- Table `mydb`.`secure_access`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`secure_access` (
  `id` VARCHAR(6) NOT NULL,
  `title` VARCHAR(100) NULL,
  `tokenId` INT NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC) VISIBLE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mydb`.`links`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`links` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `type` VARCHAR(45) NOT NULL,
  `tokenId` INT NOT NULL,
  `minBalance` INT UNSIGNED NULL,
  `link` VARCHAR(300) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC) VISIBLE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mydb`.`sa_to_links_map`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`sa_to_links_map` (
  `sa_id` VARCHAR(6) NOT NULL,
  `link_id` INT NOT NULL,
  INDEX `sa_id_idx` (`sa_id` ASC) VISIBLE,
  INDEX `link_id_idx` (`link_id` ASC) VISIBLE,
  CONSTRAINT `sa_id`
    FOREIGN KEY (`sa_id`)
    REFERENCES `mydb`.`secure_access` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `link_id`
    FOREIGN KEY (`link_id`)
    REFERENCES `mydb`.`links` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;

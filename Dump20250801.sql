-- MySQL dump 10.13  Distrib 8.0.41, for Win64 (x86_64)
--
-- Host: 10.99.63.224    Database: db_tool
-- ------------------------------------------------------
-- Server version	8.0.42-0ubuntu0.24.04.2

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `SequelizeMeta`
--

DROP TABLE IF EXISTS `SequelizeMeta`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `SequelizeMeta` (
  `name` varchar(255) COLLATE utf8mb3_unicode_ci NOT NULL,
  PRIMARY KEY (`name`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `SequelizeMeta`
--

LOCK TABLES `SequelizeMeta` WRITE;
/*!40000 ALTER TABLE `SequelizeMeta` DISABLE KEYS */;
INSERT INTO `SequelizeMeta` VALUES ('20220812090023-create_table_customers.js'),('20220812090034-create_table_projects.js'),('20220816021327-create_table_position.js'),('20220819020937-create_table_user_project.js'),('20220819021620-create_table_resource.js'),('20220829080644-add_and_drop_positionId_to_resource_table.js'),('20220831020755-update_column_userId_to_user_project_table.js'),('20220908150832-create_table_users.js'),('20220920093034-create_table_line.js'),('20220921022646-add_line_id_into_users_table.js'),('20220921074024-add_column_note_to_table_resource.js'),('20220923024012-change_status_project_table.js'),('20220923083529-create_table_logworks.js'),('20220926-add_budget_to_projects_table.js'),('20220926-create_table_resource_summaries_table.js'),('20220927-add_field_to_projects_table.js'),('20220927091455-create_table_payment_tracking.js'),('20220928-create_table_project_situations.js'),('20221003012825-change_field_currencyId_project_table.js'),('20221003012904-add_and_change_project_table.js'),('20221006091051-add_unique_code_project_table.js'),('20221007-update_table_resource_summaries.js'),('20221010-add_column_date_to_project_situation_table.js'),('20221011083001-add_column_pm_project_table.js'),('20221108043333-add_index_to_resource_table.js'),('20221111070538-change_type_field_resource_summary.js'),('20221129012029-create_table_days_off.js'),('20221214021336-update-type-amount-payment-table.js'),('20221214035401-update-character-set-payment-table.js'),('20221216100210-update-actual-effort-logwork-table.js'),('20221223101550-add_field_status_user_table.js'),('20221229063927-update_character_set_resource_table.js'),('20221229064913-update_character_set_logwork_table.js'),('20221229080835-update_character_set_project_situation_table.js'),('20230104070028-add-field-userId-projectId-resources-table.js'),('20230110-create_table_bot_setting.js'),('20230116014453-create-table-team-logs.js'),('20230117011951-create_table_contract_type.js'),('20230117012152-create_table_daily_report_activities.js'),('20230117012258-create_table_job_rank.js'),('20230117012315-create_table_project_rank.js'),('20230131022346-update_table_customer.js'),('20230131075600-create_order_field_for_masterdata.js'),('20230202014443-change_column_type_bot_setting.js'),('20230202020526-add_column_type_master_data.js'),('20230203083602-add_column_date_edit_table_days_off.js'),('20230206035011-add_column_flag_table_project_situation.js'),('20230206080600-update_column_type_table_project_to_nullable.js'),('20230206083316-update_collation_table_line_annd_position.js'),('20230207041028-change_type_note_table_project_situation.js'),('20230209080057-add_column_jobRankId_user_table.js'),('20230213041243-add_column_projectRank_resource_table.js'),('20230215033328-create_table_department.js'),('20230215040405-add_column_departmentId_user_table.js'),('20230220093839-add_column_departmnentId_project_table.js'),('20230222011841-create_permisson_table.js'),('20230222012728-create_role_table.js'),('20230301024318-add_colunm_into_permisson_role_table.js'),('20230301041133-add_colunm_user_table.js'),('20230919080436-add_column_flag_protected_into_positions_table.js'),('20230920014221-add_column_flag_protected_into_lines_table.js'),('20230920031218-add_column_flag_protected_into_role_table.js'),('20230925040425-add_column_flag_protected_into_department_table.js'),('20231002025645-create_project_situation_history_table.js'),('20231004065455-update_column_status_in_payment_trackings_table.js'),('20231011014608-create_user_salaries_table.js'),('20231011064612-add_column_amount_vnd_into_payment_tracking_table.js'),('20231013075535-add_column_salary_onsite_note_into_users_table.js'),('20231017041711-update_column_note_preject_situation_history_table.js'),('20231020030500-add_column_id_google_into_users.js'),('20231025012840-update_column_date_in_payment_tracking_table.js'),('20231031023008-create_setting_other_cost_table.js'),('20231031035941-create_other_cost_table.js');
/*!40000 ALTER TABLE `SequelizeMeta` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `bot_setting`
--

DROP TABLE IF EXISTS `bot_setting`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `bot_setting` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `projectName` varchar(255) NOT NULL,
  `projectId` int NOT NULL,
  `channelId` varchar(255) DEFAULT NULL,
  `groupId` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bot_setting`
--

LOCK TABLES `bot_setting` WRITE;
/*!40000 ALTER TABLE `bot_setting` DISABLE KEYS */;
INSERT INTO `bot_setting` VALUES (1,'[Internal] DM tool',1,NULL,NULL,'2025-07-31 09:21:18','2025-07-31 09:21:18');
/*!40000 ALTER TABLE `bot_setting` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `contract_type`
--

DROP TABLE IF EXISTS `contract_type`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `contract_type` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `order` double(8,4) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `contract_type`
--

LOCK TABLES `contract_type` WRITE;
/*!40000 ALTER TABLE `contract_type` DISABLE KEYS */;
INSERT INTO `contract_type` VALUES (1,'Labo',0.0000,'2025-07-31 08:21:47','2025-07-31 08:21:47',NULL),(2,'Fixprice',1.0000,'2025-07-31 08:21:47','2025-07-31 08:21:47',NULL),(3,'Hibrid',2.0000,'2025-07-31 08:21:47','2025-07-31 08:21:47',NULL);
/*!40000 ALTER TABLE `contract_type` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `customers`
--

DROP TABLE IF EXISTS `customers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `customers` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `email` varchar(255) DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `note` text,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL,
  `firstContactDate` datetime NOT NULL DEFAULT '2025-07-29 04:17:53',
  `status` enum('Active','Inactive') NOT NULL,
  `contactPoint` text,
  `contactInfo` text,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `customers`
--

LOCK TABLES `customers` WRITE;
/*!40000 ALTER TABLE `customers` DISABLE KEYS */;
INSERT INTO `customers` VALUES (1,'Cons Department',NULL,NULL,NULL,'2025-07-31 08:33:37','2025-07-31 08:33:37',NULL,'2025-07-01 08:33:09','Active',NULL,NULL);
/*!40000 ALTER TABLE `customers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `daily_report_activities`
--

DROP TABLE IF EXISTS `daily_report_activities`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `daily_report_activities` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `order` double(8,4) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `daily_report_activities`
--

LOCK TABLES `daily_report_activities` WRITE;
/*!40000 ALTER TABLE `daily_report_activities` DISABLE KEYS */;
/*!40000 ALTER TABLE `daily_report_activities` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `day-offs`
--

DROP TABLE IF EXISTS `day-offs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `day-offs` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `date` datetime NOT NULL,
  `note` text COLLATE utf8mb4_unicode_ci,
  `idSame` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `edit` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `date` (`date`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `day-offs`
--

LOCK TABLES `day-offs` WRITE;
/*!40000 ALTER TABLE `day-offs` DISABLE KEYS */;
INSERT INTO `day-offs` VALUES (13,'2025-09-02 00:00:00','Ngày quốc khánh Việt Nam','2025-09-02-2025-09-07','2025-09-02-2025-09-07','2025-07-31 08:18:05','2025-07-31 08:18:05'),(14,'2025-09-03 00:00:00','Ngày quốc khánh Việt Nam','2025-09-02-2025-09-07','2025-09-02-2025-09-07','2025-07-31 08:18:05','2025-07-31 08:18:05'),(15,'2025-09-04 00:00:00','Ngày quốc khánh Việt Nam','2025-09-02-2025-09-07','2025-09-02-2025-09-07','2025-07-31 08:18:05','2025-07-31 08:18:05'),(16,'2025-09-05 00:00:00','Ngày quốc khánh Việt Nam','2025-09-02-2025-09-07','2025-09-02-2025-09-07','2025-07-31 08:18:05','2025-07-31 08:18:05'),(17,'2025-09-06 00:00:00','Ngày quốc khánh Việt Nam','2025-09-02-2025-09-07','2025-09-02-2025-09-07','2025-07-31 08:18:05','2025-07-31 08:18:05'),(18,'2025-09-07 00:00:00','Ngày quốc khánh Việt Nam','2025-09-02-2025-09-07','2025-09-02-2025-09-07','2025-07-31 08:18:05','2025-07-31 08:18:05');
/*!40000 ALTER TABLE `day-offs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `department`
--

DROP TABLE IF EXISTS `department`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `department` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `flag_protected` tinyint NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `department`
--

LOCK TABLES `department` WRITE;
/*!40000 ALTER TABLE `department` DISABLE KEYS */;
INSERT INTO `department` VALUES (1,'Omi',1,'2025-07-31 02:00:42','2025-07-31 02:00:42',NULL),(2,'Finance',0,'2025-07-31 02:00:42','2025-07-31 02:00:42',NULL),(3,'IT',0,'2025-07-31 02:00:42','2025-07-31 02:00:42',NULL);
/*!40000 ALTER TABLE `department` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `job_rank`
--

DROP TABLE IF EXISTS `job_rank`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `job_rank` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `order` double(8,4) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `job_rank`
--

LOCK TABLES `job_rank` WRITE;
/*!40000 ALTER TABLE `job_rank` DISABLE KEYS */;
/*!40000 ALTER TABLE `job_rank` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `lines`
--

DROP TABLE IF EXISTS `lines`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `lines` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `order` double(8,4) DEFAULT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `flag_protected` tinyint NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `lines`
--

LOCK TABLES `lines` WRITE;
/*!40000 ALTER TABLE `lines` DISABLE KEYS */;
INSERT INTO `lines` VALUES (1,'AI',0.0000,NULL,0,'2025-07-31 08:21:20','2025-07-31 08:21:20',NULL),(2,'Cons JP',1.0000,NULL,0,'2025-07-31 08:21:20','2025-07-31 08:21:20',NULL),(3,'BRSE Hàn',2.0000,NULL,0,'2025-07-31 08:21:20','2025-07-31 08:21:20',NULL);
/*!40000 ALTER TABLE `lines` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `log_works`
--

DROP TABLE IF EXISTS `log_works`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `log_works` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `userProjectId` bigint NOT NULL,
  `reportDate` datetime DEFAULT NULL,
  `activity` enum('Management','Trans & Comm','Investigate','DevOps','Coding','Test','Review CD','Review TC','Report','Other') DEFAULT NULL,
  `dailyReportActivitiesId` int DEFAULT NULL,
  `taskId` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `actualEffort` double(4,2) DEFAULT NULL,
  `note` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `log_works`
--

LOCK TABLES `log_works` WRITE;
/*!40000 ALTER TABLE `log_works` DISABLE KEYS */;
/*!40000 ALTER TABLE `log_works` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `other_cost`
--

DROP TABLE IF EXISTS `other_cost`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `other_cost` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `settingOtherCostId` bigint NOT NULL,
  `departmentId` bigint NOT NULL,
  `amount` double NOT NULL,
  `year` int NOT NULL,
  `month` int NOT NULL,
  `note` text,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL,
  `date` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `other_cost`
--

LOCK TABLES `other_cost` WRITE;
/*!40000 ALTER TABLE `other_cost` DISABLE KEYS */;
/*!40000 ALTER TABLE `other_cost` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `payment_trackings`
--

DROP TABLE IF EXISTS `payment_trackings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `payment_trackings` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `title` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `effort` double(14,4) NOT NULL,
  `amount` double(17,2) NOT NULL,
  `amountVND` bigint DEFAULT NULL,
  `paydate` datetime DEFAULT NULL,
  `status` enum('New','Pending','Paid','Cancelled','Processing') NOT NULL,
  `note` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `projectId` bigint NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payment_trackings`
--

LOCK TABLES `payment_trackings` WRITE;
/*!40000 ALTER TABLE `payment_trackings` DISABLE KEYS */;
/*!40000 ALTER TABLE `payment_trackings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `permisson`
--

DROP TABLE IF EXISTS `permisson`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `permisson` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `path` varchar(255) DEFAULT NULL,
  `method` varchar(255) DEFAULT NULL,
  `action` enum('exc','block','only') NOT NULL,
  `roleId` bigint DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=153 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `permisson`
--

LOCK TABLES `permisson` WRITE;
/*!40000 ALTER TABLE `permisson` DISABLE KEYS */;
INSERT INTO `permisson` VALUES (1,'Add Resource Project','/api/v1/resources','post','exc',1,'2025-07-31 08:24:22','2025-07-31 08:24:22',NULL),(2,'Update Resource Project','/api/v1/resources/:userId/project/:projectId','put','exc',1,'2025-07-31 08:24:22','2025-07-31 08:24:22',NULL),(3,'List Project Resources Project','/api/v1/resources/list-project','get','exc',1,'2025-07-31 08:24:22','2025-07-31 08:24:22',NULL),(4,'Delete All Resources Member','/api/v1/projects/:projectId/user/:userId','delete','exc',1,'2025-07-31 08:24:22','2025-07-31 08:24:22',NULL),(5,'Delete Resources Project','/api/v1/resources/:userId/project/:projectId','delete','exc',1,'2025-07-31 08:24:22','2025-07-31 08:24:22',NULL),(6,'List User','/api/v1/resources/list-user','get','exc',1,'2025-07-31 08:24:22','2025-07-31 08:24:22',NULL),(7,'List Resources','/api/v1/resources/users','get','exc',1,'2025-07-31 08:24:22','2025-07-31 08:24:22',NULL),(8,'List Resources','/api/v1/resources/projects','get','exc',1,'2025-07-31 08:24:22','2025-07-31 08:24:22',NULL),(9,'Add Resource Member','/api/v1/resources/member','post','exc',1,'2025-07-31 08:24:22','2025-07-31 08:24:22',NULL),(10,'List Project Resources Member','/api/v1/resources/list-project','get','exc',1,'2025-07-31 08:24:22','2025-07-31 08:24:22',NULL),(11,'Update Resource Member','/api/v1/resources/:userId/member/:projectId','put','exc',1,'2025-07-31 08:24:22','2025-07-31 08:24:22',NULL),(12,'List User','/api/v1/resources/list-user','get','exc',1,'2025-07-31 08:24:22','2025-07-31 08:24:22',NULL),(13,'Delete Resources Member','/api/v1/resources/:userId/member/:projectId','delete','exc',1,'2025-07-31 08:24:22','2025-07-31 08:24:22',NULL),(14,'Get User Resource Summary','/api/v1/resources/user-summary','get','exc',1,'2025-07-31 08:24:22','2025-07-31 08:24:22',NULL),(15,'Get User Resource Detail','/api/v1/resources/user-summary/:id','get','exc',1,'2025-07-31 08:24:22','2025-07-31 08:24:22',NULL),(16,'List Resources User','/api/v1/resources/users/summary','get','exc',1,'2025-07-31 08:24:22','2025-07-31 08:24:22',NULL),(17,'Delete All Resources Member','/api/v1/resources/:projectId/user/:userId','delete','exc',1,'2025-07-31 08:24:22','2025-07-31 08:24:22',NULL),(18,'Send Project To Team','/api/v1/resources/send-project-to-team','post','exc',1,'2025-07-31 08:24:22','2025-07-31 08:24:22',NULL),(19,'List Project','/api/v1/projects','get','exc',1,'2025-07-31 08:24:22','2025-07-31 08:24:22',NULL),(20,'Add Project','/api/v1/projects','post','exc',1,'2025-07-31 08:24:22','2025-07-31 08:24:22',NULL),(21,'List Customer','/api/v1/projects/customer','get','exc',1,'2025-07-31 08:24:22','2025-07-31 08:24:22',NULL),(22,'Detail Project Information','/api/v1/projects/information-project','get','exc',1,'2025-07-31 08:24:22','2025-07-31 08:24:22',NULL),(23,'Detail Project','/api/v1/projects/:id','get','exc',1,'2025-07-31 08:24:22','2025-07-31 08:24:22',NULL),(24,'Edit Project','/api/v1/projects/:id','put','exc',1,'2025-07-31 08:24:22','2025-07-31 08:24:22',NULL),(25,'Project Resource Allocation','/api/v1/projects/resource-summaries','get','exc',1,'2025-07-31 08:24:22','2025-07-31 08:24:22',NULL),(26,'Edit Committed','/api/v1/resource-summaries/edit_committed','post','exc',1,'2025-07-31 08:24:22','2025-07-31 08:24:22',NULL),(27,'Project Situations List','/api/v1/project-situations','get','exc',1,'2025-07-31 08:24:22','2025-07-31 08:24:22',NULL),(28,'Add Project Situation','/api/v1/projects/create_project_situation','post','exc',1,'2025-07-31 08:24:22','2025-07-31 08:24:22',NULL),(29,'Edit_Project_Situation','/api/v1/projects/edit_project_situation','post','exc',1,'2025-07-31 08:24:22','2025-07-31 08:24:22',NULL),(30,'Delete Project Situations','/api/v1/projects/delete_project_situation','post','exc',1,'2025-07-31 08:24:22','2025-07-31 08:24:22',NULL),(31,'Get Project Resource','/api/v1/projects/resources','get','exc',1,'2025-07-31 08:24:22','2025-07-31 08:24:22',NULL),(32,'List_Log_Work','/api/v1/projects/:id/log-works','get','exc',1,'2025-07-31 08:24:22','2025-07-31 08:24:22',NULL),(33,'Add Log Work','/api/v1/projects/:id/log-works','post','exc',1,'2025-07-31 08:24:22','2025-07-31 08:24:22',NULL),(34,'Update Log Work','/api/v1/projects/log-works/:id','put','exc',1,'2025-07-31 08:24:22','2025-07-31 08:24:22',NULL),(35,'Detail Log Work','/api/v1/projects/log-works/:id','get','exc',1,'2025-07-31 08:24:22','2025-07-31 08:24:22',NULL),(36,'Delete Log Work','/api/v1/projects/log-works/:id','delete','exc',1,'2025-07-31 08:24:22','2025-07-31 08:24:22',NULL),(37,'List Payment By ProjectId','/api/v1/payment_tracking/:projectId','get','exc',1,'2025-07-31 08:24:22','2025-07-31 08:24:22',NULL),(38,'List Payment Tracking','/api/v1/payment_tracking/list','get','exc',1,'2025-07-31 08:24:22','2025-07-31 08:24:22',NULL),(39,'Add Payment','/api/v1/projects/payment','post','exc',1,'2025-07-31 08:24:22','2025-07-31 08:24:22',NULL),(40,'Add Payment','/api/v1/payment_tracking','post','exc',1,'2025-07-31 08:24:22','2025-07-31 08:24:22',NULL),(41,'Get filter Payment Summary','/api/v1/payment_tracking/summary','get','exc',1,'2025-07-31 08:24:22','2025-07-31 08:24:22',NULL),(42,'Delete Payment','/api/v1/projects/payment/:id','delete','exc',1,'2025-07-31 08:24:22','2025-07-31 08:24:22',NULL),(43,'Edit Payment','/api/v1/projects/payment/:id','put','exc',1,'2025-07-31 08:24:22','2025-07-31 08:24:22',NULL),(44,'Edit Payment','/api/v1/payment_tracking/:id','put','exc',1,'2025-07-31 08:24:22','2025-07-31 08:24:22',NULL),(45,'Delete Payment','/api/v1/payment_tracking/:id','delete','exc',1,'2025-07-31 08:24:22','2025-07-31 08:24:22',NULL),(46,'Get filter Project Situation','/api/v1/project-situations/filter-group','get','exc',1,'2025-07-31 08:24:22','2025-07-31 08:24:22',NULL),(47,'Add Project Situation','/api/v1/project-situations/create_project_situation','post','exc',1,'2025-07-31 08:24:22','2025-07-31 08:24:22',NULL),(48,'Edit Project Situation','/api/v1/project-situations/edit_project_situation','post','exc',1,'2025-07-31 08:24:22','2025-07-31 08:24:22',NULL),(49,'Delete Project Situation','/api/v1/project-situations/delete_project_situation','post','exc',1,'2025-07-31 08:24:22','2025-07-31 08:24:22',NULL),(50,'List Member','/api/v1/users/division','get','exc',1,'2025-07-31 08:24:22','2025-07-31 08:24:22',NULL),(51,'Create Member','/api/v1/users','post','exc',1,'2025-07-31 08:24:22','2025-07-31 08:24:22',NULL),(52,'Edit Member','/api/v1/users/:id','put','exc',1,'2025-07-31 08:24:22','2025-07-31 08:24:22',NULL),(53,'Edit Member By Email','/api/v1/users/update/:email','get','exc',1,'2025-07-31 08:24:22','2025-07-31 08:24:22',NULL),(54,'List Customer','/api/v1/customers','get','exc',1,'2025-07-31 08:24:22','2025-07-31 08:24:22',NULL),(55,'Create Customer','/api/v1/customers','post','exc',1,'2025-07-31 08:24:22','2025-07-31 08:24:22',NULL),(56,'Edit Customer','/api/v1/customers/:id','put','exc',1,'2025-07-31 08:24:22','2025-07-31 08:24:22',NULL),(57,'Delete Customer','/api/v1/customers/:id','delete','exc',1,'2025-07-31 08:24:22','2025-07-31 08:24:22',NULL),(58,'Customer Detail','api/v1/customers/:customerId/projects','get','exc',1,'2025-07-31 08:24:22','2025-07-31 08:24:22',NULL),(59,'List Days Off','/api/v1/days-off','get','exc',1,'2025-07-31 08:24:22','2025-07-31 08:24:22',NULL),(60,'Create Days Off','/api/v1/days-off','post','exc',1,'2025-07-31 08:24:22','2025-07-31 08:24:22',NULL),(61,'Update Days Off','/api/v1/days-off/:id','put','exc',1,'2025-07-31 08:24:22','2025-07-31 08:24:22',NULL),(62,'Update Resources','/api/v1/resources/update-rs-daysoff','get','exc',1,'2025-07-31 08:24:22','2025-07-31 08:24:22',NULL),(63,'Delete Days Off','/api/v1/days-off/:id','delete','exc',1,'2025-07-31 08:24:22','2025-07-31 08:24:22',NULL),(64,'Get Department','/api/v1/master-data/department','get','exc',1,'2025-07-31 08:24:22','2025-07-31 08:24:22',NULL),(65,'Create Department','/api/v1/master-data/department','post','exc',1,'2025-07-31 08:24:22','2025-07-31 08:24:22',NULL),(66,'Update Department','/api/v1/master-data/department/:id','put','exc',1,'2025-07-31 08:24:22','2025-07-31 08:24:22',NULL),(67,'Get Permission By Role','/api/v1/role/:id/permission','get','exc',1,'2025-07-31 08:24:22','2025-07-31 08:24:22',NULL),(68,'Delete Department','/api/v1/master-data/department/:id','delete','exc',1,'2025-07-31 08:24:22','2025-07-31 08:24:22',NULL),(69,'Get Role','/api/v1/role','get','exc',1,'2025-07-31 08:24:22','2025-07-31 08:24:22',NULL),(70,'Get Master Data','/api/v1/master-data/list-master-data/:type','get','exc',1,'2025-07-31 08:24:22','2025-07-31 08:24:22',NULL),(71,'Handle Master Data','/api/v1/master-data/handle-master-data','post','exc',1,'2025-07-31 08:24:22','2025-07-31 08:24:22',NULL),(72,'Create Permission','/api/v1/role','post','exc',1,'2025-07-31 08:24:22','2025-07-31 08:24:22',NULL),(73,'Get Routes','/api/v1/role/routes','get','exc',1,'2025-07-31 08:24:22','2025-07-31 08:24:22',NULL),(74,'Summary Master Data','/api/v1/master-data/master-data-summary','get','exc',1,'2025-07-31 08:24:22','2025-07-31 08:24:22',NULL),(75,'Update Permission','/api/v1/role/:id','put','exc',1,'2025-07-31 08:24:22','2025-07-31 08:24:22',NULL),(76,'Delete Permission','/api/v1/role/:id','delete','exc',1,'2025-07-31 08:24:22','2025-07-31 08:24:22',NULL),(77,'Add Resource Project','/api/v1/resources','post','exc',3,'2025-07-31 09:07:31','2025-07-31 09:07:31',NULL),(78,'Update Resource Project','/api/v1/resources/:userId/project/:projectId','put','exc',3,'2025-07-31 09:07:31','2025-07-31 09:07:31',NULL),(79,'List Project Resources Project','/api/v1/resources/list-project','get','exc',3,'2025-07-31 09:07:31','2025-07-31 09:07:31',NULL),(80,'Delete All Resources Member','/api/v1/projects/:projectId/user/:userId','delete','exc',3,'2025-07-31 09:07:31','2025-07-31 09:07:31',NULL),(81,'List User','/api/v1/resources/list-user','get','exc',3,'2025-07-31 09:07:31','2025-07-31 09:07:31',NULL),(82,'Delete Resources Project','/api/v1/resources/:userId/project/:projectId','delete','exc',3,'2025-07-31 09:07:31','2025-07-31 09:07:31',NULL),(83,'List Resources','/api/v1/resources/users','get','block',3,'2025-07-31 09:07:31','2025-07-31 09:07:31',NULL),(84,'Update Resource Member','/api/v1/resources/:userId/member/:projectId','put','block',3,'2025-07-31 09:07:31','2025-07-31 09:07:31',NULL),(85,'Get User Resource Summary','/api/v1/resources/user-summary','get','block',3,'2025-07-31 09:07:31','2025-07-31 09:07:31',NULL),(86,'List Resources','/api/v1/resources/projects','get','exc',3,'2025-07-31 09:07:31','2025-07-31 09:07:31',NULL),(87,'Add Resource Member','/api/v1/resources/member','post','block',3,'2025-07-31 09:07:31','2025-07-31 09:07:31',NULL),(88,'List Project Resources Member','/api/v1/resources/list-project','get','exc',3,'2025-07-31 09:07:31','2025-07-31 09:07:31',NULL),(89,'List User','/api/v1/resources/list-user','get','exc',3,'2025-07-31 09:07:31','2025-07-31 09:07:31',NULL),(90,'Delete Resources Member','/api/v1/resources/:userId/member/:projectId','delete','block',3,'2025-07-31 09:07:31','2025-07-31 09:07:31',NULL),(91,'List Resources User','/api/v1/resources/users/summary','get','block',3,'2025-07-31 09:07:31','2025-07-31 09:07:31',NULL),(92,'Get User Resource Detail','/api/v1/resources/user-summary/:id','get','block',3,'2025-07-31 09:07:31','2025-07-31 09:07:31',NULL),(93,'Delete All Resources Member','/api/v1/resources/:projectId/user/:userId','delete','block',3,'2025-07-31 09:07:31','2025-07-31 09:07:31',NULL),(94,'Send Project To Team','/api/v1/resources/send-project-to-team','post','block',3,'2025-07-31 09:07:31','2025-07-31 09:07:31',NULL),(95,'Add Project','/api/v1/projects','post','exc',3,'2025-07-31 09:07:31','2025-07-31 09:07:31',NULL),(96,'List Project','/api/v1/projects','get','exc',3,'2025-07-31 09:07:31','2025-07-31 09:07:31',NULL),(97,'List Customer','/api/v1/projects/customer','get','exc',3,'2025-07-31 09:07:31','2025-07-31 09:07:31',NULL),(98,'Detail Project Information','/api/v1/projects/information-project','get','exc',3,'2025-07-31 09:07:31','2025-07-31 09:07:31',NULL),(99,'Detail Project','/api/v1/projects/:id','get','exc',3,'2025-07-31 09:07:31','2025-07-31 09:07:31',NULL),(100,'Edit Project','/api/v1/projects/:id','put','exc',3,'2025-07-31 09:07:31','2025-07-31 09:07:31',NULL),(101,'Project Resource Allocation','/api/v1/projects/resource-summaries','get','exc',3,'2025-07-31 09:07:31','2025-07-31 09:07:31',NULL),(102,'Edit Committed','/api/v1/resource-summaries/edit_committed','post','exc',3,'2025-07-31 09:07:31','2025-07-31 09:07:31',NULL),(103,'Add Project Situation','/api/v1/projects/create_project_situation','post','exc',3,'2025-07-31 09:07:31','2025-07-31 09:07:31',NULL),(104,'Project Situations List','/api/v1/project-situations','get','exc',3,'2025-07-31 09:07:31','2025-07-31 09:07:31',NULL),(105,'Delete Project Situations','/api/v1/projects/delete_project_situation','post','exc',3,'2025-07-31 09:07:31','2025-07-31 09:07:31',NULL),(106,'Get Project Resource','/api/v1/projects/resources','get','exc',3,'2025-07-31 09:07:31','2025-07-31 09:07:31',NULL),(107,'Edit_Project_Situation','/api/v1/projects/edit_project_situation','post','exc',3,'2025-07-31 09:07:31','2025-07-31 09:07:31',NULL),(108,'List_Log_Work','/api/v1/projects/:id/log-works','get','exc',3,'2025-07-31 09:07:31','2025-07-31 09:07:31',NULL),(109,'Add Log Work','/api/v1/projects/:id/log-works','post','exc',3,'2025-07-31 09:07:31','2025-07-31 09:07:31',NULL),(110,'Delete Log Work','/api/v1/projects/log-works/:id','delete','block',3,'2025-07-31 09:07:31','2025-07-31 09:07:31',NULL),(111,'Detail Log Work','/api/v1/projects/log-works/:id','get','block',3,'2025-07-31 09:07:31','2025-07-31 09:07:31',NULL),(112,'Update Log Work','/api/v1/projects/log-works/:id','put','exc',3,'2025-07-31 09:07:31','2025-07-31 09:07:31',NULL),(113,'List Payment By ProjectId','/api/v1/payment_tracking/:projectId','get','block',3,'2025-07-31 09:07:31','2025-07-31 09:07:31',NULL),(114,'List Payment Tracking','/api/v1/payment_tracking/list','get','block',3,'2025-07-31 09:07:31','2025-07-31 09:07:31',NULL),(115,'Add Payment','/api/v1/projects/payment','post','block',3,'2025-07-31 09:07:31','2025-07-31 09:07:31',NULL),(116,'Edit Payment','/api/v1/projects/payment/:id','put','block',3,'2025-07-31 09:07:31','2025-07-31 09:07:31',NULL),(117,'Delete Payment','/api/v1/projects/payment/:id','delete','block',3,'2025-07-31 09:07:31','2025-07-31 09:07:31',NULL),(118,'Get filter Payment Summary','/api/v1/payment_tracking/summary','get','block',3,'2025-07-31 09:07:31','2025-07-31 09:07:31',NULL),(119,'Add Payment','/api/v1/payment_tracking','post','block',3,'2025-07-31 09:07:31','2025-07-31 09:07:31',NULL),(120,'Edit Payment','/api/v1/payment_tracking/:id','put','block',3,'2025-07-31 09:07:31','2025-07-31 09:07:31',NULL),(121,'Delete Payment','/api/v1/payment_tracking/:id','delete','block',3,'2025-07-31 09:07:31','2025-07-31 09:07:31',NULL),(122,'Get filter Project Situation','/api/v1/project-situations/filter-group','get','exc',3,'2025-07-31 09:07:31','2025-07-31 09:07:31',NULL),(123,'Add Project Situation','/api/v1/project-situations/create_project_situation','post','exc',3,'2025-07-31 09:07:31','2025-07-31 09:07:31',NULL),(124,'Edit Project Situation','/api/v1/project-situations/edit_project_situation','post','exc',3,'2025-07-31 09:07:31','2025-07-31 09:07:31',NULL),(125,'Delete Project Situation','/api/v1/project-situations/delete_project_situation','post','exc',3,'2025-07-31 09:07:31','2025-07-31 09:07:31',NULL),(126,'List Member','/api/v1/users/division','get','block',3,'2025-07-31 09:07:31','2025-07-31 09:07:31',NULL),(127,'Edit Member','/api/v1/users/:id','put','block',3,'2025-07-31 09:07:31','2025-07-31 09:07:31',NULL),(128,'Create Member','/api/v1/users','post','block',3,'2025-07-31 09:07:31','2025-07-31 09:07:31',NULL),(129,'Edit Member By Email','/api/v1/users/update/:email','get','block',3,'2025-07-31 09:07:31','2025-07-31 09:07:31',NULL),(130,'List Customer','/api/v1/customers','get','block',3,'2025-07-31 09:07:31','2025-07-31 09:07:31',NULL),(131,'Create Customer','/api/v1/customers','post','block',3,'2025-07-31 09:07:31','2025-07-31 09:07:31',NULL),(132,'Edit Customer','/api/v1/customers/:id','put','block',3,'2025-07-31 09:07:31','2025-07-31 09:07:31',NULL),(133,'Delete Customer','/api/v1/customers/:id','delete','block',3,'2025-07-31 09:07:31','2025-07-31 09:07:31',NULL),(134,'Customer Detail','api/v1/customers/:customerId/projects','get','block',3,'2025-07-31 09:07:31','2025-07-31 09:07:31',NULL),(135,'List Days Off','/api/v1/days-off','get','block',3,'2025-07-31 09:07:31','2025-07-31 09:07:31',NULL),(136,'Create Days Off','/api/v1/days-off','post','block',3,'2025-07-31 09:07:31','2025-07-31 09:07:31',NULL),(137,'Update Days Off','/api/v1/days-off/:id','put','block',3,'2025-07-31 09:07:31','2025-07-31 09:07:31',NULL),(138,'Delete Days Off','/api/v1/days-off/:id','delete','block',3,'2025-07-31 09:07:31','2025-07-31 09:07:31',NULL),(139,'Update Resources','/api/v1/resources/update-rs-daysoff','get','block',3,'2025-07-31 09:07:31','2025-07-31 09:07:31',NULL),(140,'Get Department','/api/v1/master-data/department','get','block',3,'2025-07-31 09:07:31','2025-07-31 09:07:31',NULL),(141,'Create Department','/api/v1/master-data/department','post','block',3,'2025-07-31 09:07:31','2025-07-31 09:07:31',NULL),(142,'Get Master Data','/api/v1/master-data/list-master-data/:type','get','block',3,'2025-07-31 09:07:31','2025-07-31 09:07:31',NULL),(143,'Delete Department','/api/v1/master-data/department/:id','delete','block',3,'2025-07-31 09:07:31','2025-07-31 09:07:31',NULL),(144,'Update Department','/api/v1/master-data/department/:id','put','block',3,'2025-07-31 09:07:31','2025-07-31 09:07:31',NULL),(145,'Summary Master Data','/api/v1/master-data/master-data-summary','get','block',3,'2025-07-31 09:07:31','2025-07-31 09:07:31',NULL),(146,'Handle Master Data','/api/v1/master-data/handle-master-data','post','block',3,'2025-07-31 09:07:31','2025-07-31 09:07:31',NULL),(147,'Get Routes','/api/v1/role/routes','get','block',3,'2025-07-31 09:07:31','2025-07-31 09:07:31',NULL),(148,'Update Permission','/api/v1/role/:id','put','block',3,'2025-07-31 09:07:31','2025-07-31 09:07:31',NULL),(149,'Get Permission By Role','/api/v1/role/:id/permission','get','block',3,'2025-07-31 09:07:31','2025-07-31 09:07:31',NULL),(150,'Get Role','/api/v1/role','get','block',3,'2025-07-31 09:07:31','2025-07-31 09:07:31',NULL),(151,'Create Permission','/api/v1/role','post','block',3,'2025-07-31 09:07:31','2025-07-31 09:07:31',NULL),(152,'Delete Permission','/api/v1/role/:id','delete','block',3,'2025-07-31 09:07:31','2025-07-31 09:07:31',NULL);
/*!40000 ALTER TABLE `permisson` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `positions`
--

DROP TABLE IF EXISTS `positions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `positions` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `order` double(8,4) DEFAULT NULL,
  `code` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `flag_protected` tinyint NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `positions`
--

LOCK TABLES `positions` WRITE;
/*!40000 ALTER TABLE `positions` DISABLE KEYS */;
INSERT INTO `positions` VALUES (1,'Quản lý dự án',0.0000,'PM',0,'2025-07-31 08:20:42','2025-07-31 08:20:42',NULL),(2,'DEV Frontend',1.0000,'DEV FE',0,'2025-07-31 08:20:42','2025-07-31 08:20:42',NULL);
/*!40000 ALTER TABLE `positions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `project_rank`
--

DROP TABLE IF EXISTS `project_rank`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `project_rank` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `order` double(8,4) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `project_rank`
--

LOCK TABLES `project_rank` WRITE;
/*!40000 ALTER TABLE `project_rank` DISABLE KEYS */;
INSERT INTO `project_rank` VALUES (1,'Level 1',0.0000,'2025-07-31 08:22:16','2025-07-31 08:22:16',NULL),(2,'Level 2',1.0000,'2025-07-31 08:22:16','2025-07-31 08:22:16',NULL),(3,'Level 3',2.0000,'2025-07-31 08:22:16','2025-07-31 08:22:16',NULL);
/*!40000 ALTER TABLE `project_rank` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `project_situation_histories`
--

DROP TABLE IF EXISTS `project_situation_histories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `project_situation_histories` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `projectSituationId` bigint NOT NULL,
  `submitterId` varchar(255) NOT NULL,
  `projectId` bigint NOT NULL,
  `note` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `date` date DEFAULT NULL,
  `flag` int DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `project_situation_histories`
--

LOCK TABLES `project_situation_histories` WRITE;
/*!40000 ALTER TABLE `project_situation_histories` DISABLE KEYS */;
/*!40000 ALTER TABLE `project_situation_histories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `project_situations`
--

DROP TABLE IF EXISTS `project_situations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `project_situations` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `submitterId` varchar(255) NOT NULL,
  `projectId` bigint NOT NULL,
  `note` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `date` date DEFAULT NULL,
  `flag` int DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `project_situations`
--

LOCK TABLES `project_situations` WRITE;
/*!40000 ALTER TABLE `project_situations` DISABLE KEYS */;
/*!40000 ALTER TABLE `project_situations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `projects`
--

DROP TABLE IF EXISTS `projects`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `projects` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `customerId` bigint DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `code` varchar(255) NOT NULL,
  `pm` text,
  `type` enum('Labo','Fixed') DEFAULT NULL,
  `contractTypeId` int DEFAULT NULL,
  `departmentId` int DEFAULT NULL,
  `startDate` datetime NOT NULL,
  `endDate` datetime NOT NULL,
  `currency` enum('JPY','USD','VND') NOT NULL,
  `endDateActual` datetime DEFAULT NULL,
  `startDateActual` datetime DEFAULT NULL,
  `status` enum('Bidding','Open','Running','Closed','Closing') NOT NULL,
  `internalPrice` double(8,2) DEFAULT NULL,
  `externalPrice` double(8,2) DEFAULT NULL,
  `billable` double(8,2) DEFAULT NULL,
  `budget` double(8,2) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL,
  `am` text,
  PRIMARY KEY (`id`),
  UNIQUE KEY `projects_code` (`code`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `projects`
--

LOCK TABLES `projects` WRITE;
/*!40000 ALTER TABLE `projects` DISABLE KEYS */;
INSERT INTO `projects` VALUES (1,1,'[Internal] DM tool','Labo - Cons Department - [Internal] DM tool - Hiệp','[\"hieptv\"]',NULL,1,1,'2025-07-01 00:00:00','2025-12-31 00:00:00','JPY',NULL,NULL,'Running',NULL,NULL,NULL,NULL,'2025-07-31 08:34:15','2025-07-31 09:38:11',NULL,'Hiệp'),(2,1,'[Internal] Notification Tool','Labo - Cons Department - [Internal] Notification Tool - Hải','[\"haida\"]',NULL,1,1,'2025-08-01 00:00:00','2025-09-30 00:00:00','JPY',NULL,NULL,'Running',NULL,NULL,NULL,NULL,'2025-08-01 01:35:53','2025-08-01 01:36:43',NULL,'Hải');
/*!40000 ALTER TABLE `projects` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `resource_summaries`
--

DROP TABLE IF EXISTS `resource_summaries`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `resource_summaries` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `projectId` bigint NOT NULL,
  `committerId` varchar(255) DEFAULT NULL,
  `year` int NOT NULL,
  `month` int NOT NULL,
  `committed` double(6,2) NOT NULL,
  `allocated` double(8,4) NOT NULL,
  `temporaryAdded` double(8,4) NOT NULL,
  `actual` double(8,4) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `resource_summaries`
--

LOCK TABLES `resource_summaries` WRITE;
/*!40000 ALTER TABLE `resource_summaries` DISABLE KEYS */;
INSERT INTO `resource_summaries` VALUES (1,1,NULL,2025,7,0.00,0.1725,0.4025,0.0000,'2025-07-31 08:34:15','2025-07-31 09:38:12'),(2,1,NULL,2025,8,0.00,0.1575,0.3675,0.0000,'2025-07-31 08:34:15','2025-07-31 09:38:12'),(3,1,NULL,2025,9,0.00,0.1350,0.3150,0.0000,'2025-07-31 08:34:15','2025-07-31 09:38:12'),(4,1,NULL,2025,10,0.00,0.1725,0.4025,0.0000,'2025-07-31 08:34:15','2025-07-31 09:38:12'),(5,1,NULL,2025,11,0.00,0.1500,0.3500,0.0000,'2025-07-31 08:34:15','2025-07-31 09:38:12'),(6,1,NULL,2025,12,0.00,0.1725,0.4025,0.0000,'2025-07-31 08:34:15','2025-07-31 09:38:12'),(7,2,NULL,2025,8,0.00,0.5250,0.0000,0.0000,'2025-08-01 01:35:53','2025-08-01 01:36:43'),(8,2,NULL,2025,9,0.00,0.4500,0.0000,0.0000,'2025-08-01 01:35:53','2025-08-01 01:36:43');
/*!40000 ALTER TABLE `resource_summaries` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `resources`
--

DROP TABLE IF EXISTS `resources`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `resources` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `userProjectId` bigint NOT NULL,
  `userId` varchar(255) DEFAULT NULL,
  `projectId` bigint DEFAULT NULL,
  `positionId` bigint NOT NULL,
  `projectRankId` int DEFAULT NULL,
  `date` datetime NOT NULL,
  `acPercent` int NOT NULL,
  `tcPercent` int DEFAULT NULL,
  `note` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `checkDayoff` int DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `index_resources` (`userProjectId`,`positionId`,`date`,`acPercent`,`tcPercent`,`createdAt`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=308 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `resources`
--

LOCK TABLES `resources` WRITE;
/*!40000 ALTER TABLE `resources` DISABLE KEYS */;
INSERT INTO `resources` VALUES (1,1,NULL,NULL,1,1,'2025-07-01 00:00:00',5,20,'',NULL,'2025-07-31 09:38:10','2025-07-31 09:38:10',NULL),(2,1,NULL,NULL,1,1,'2025-07-02 00:00:00',5,20,'',NULL,'2025-07-31 09:38:10','2025-07-31 09:38:10',NULL),(3,1,NULL,NULL,1,1,'2025-07-03 00:00:00',5,20,'',NULL,'2025-07-31 09:38:10','2025-07-31 09:38:10',NULL),(4,1,NULL,NULL,1,1,'2025-07-04 00:00:00',5,20,'',NULL,'2025-07-31 09:38:10','2025-07-31 09:38:10',NULL),(5,1,NULL,NULL,1,1,'2025-07-07 00:00:00',5,20,'',NULL,'2025-07-31 09:38:10','2025-07-31 09:38:10',NULL),(6,1,NULL,NULL,1,1,'2025-07-08 00:00:00',5,20,'',NULL,'2025-07-31 09:38:10','2025-07-31 09:38:10',NULL),(7,1,NULL,NULL,1,1,'2025-07-09 00:00:00',5,20,'',NULL,'2025-07-31 09:38:10','2025-07-31 09:38:10',NULL),(8,1,NULL,NULL,1,1,'2025-07-10 00:00:00',5,20,'',NULL,'2025-07-31 09:38:10','2025-07-31 09:38:10',NULL),(9,1,NULL,NULL,1,1,'2025-07-11 00:00:00',5,20,'',NULL,'2025-07-31 09:38:10','2025-07-31 09:38:10',NULL),(10,1,NULL,NULL,1,1,'2025-07-14 00:00:00',5,20,'',NULL,'2025-07-31 09:38:10','2025-07-31 09:38:10',NULL),(11,1,NULL,NULL,1,1,'2025-07-15 00:00:00',5,20,'',NULL,'2025-07-31 09:38:10','2025-07-31 09:38:10',NULL),(12,1,NULL,NULL,1,1,'2025-07-16 00:00:00',5,20,'',NULL,'2025-07-31 09:38:10','2025-07-31 09:38:10',NULL),(13,1,NULL,NULL,1,1,'2025-07-17 00:00:00',5,20,'',NULL,'2025-07-31 09:38:10','2025-07-31 09:38:10',NULL),(14,1,NULL,NULL,1,1,'2025-07-18 00:00:00',5,20,'',NULL,'2025-07-31 09:38:10','2025-07-31 09:38:10',NULL),(15,1,NULL,NULL,1,1,'2025-07-21 00:00:00',5,20,'',NULL,'2025-07-31 09:38:10','2025-07-31 09:38:10',NULL),(16,1,NULL,NULL,1,1,'2025-07-22 00:00:00',5,20,'',NULL,'2025-07-31 09:38:10','2025-07-31 09:38:10',NULL),(17,1,NULL,NULL,1,1,'2025-07-23 00:00:00',5,20,'',NULL,'2025-07-31 09:38:10','2025-07-31 09:38:10',NULL),(18,1,NULL,NULL,1,1,'2025-07-24 00:00:00',5,20,'',NULL,'2025-07-31 09:38:10','2025-07-31 09:38:10',NULL),(19,1,NULL,NULL,1,1,'2025-07-25 00:00:00',5,20,'',NULL,'2025-07-31 09:38:10','2025-07-31 09:38:10',NULL),(20,1,NULL,NULL,1,1,'2025-07-28 00:00:00',5,20,'',NULL,'2025-07-31 09:38:10','2025-07-31 09:38:10',NULL),(21,1,NULL,NULL,1,1,'2025-07-29 00:00:00',5,20,'',NULL,'2025-07-31 09:38:10','2025-07-31 09:38:10',NULL),(22,1,NULL,NULL,1,1,'2025-07-30 00:00:00',5,20,'',NULL,'2025-07-31 09:38:10','2025-07-31 09:38:10',NULL),(23,1,NULL,NULL,1,1,'2025-07-31 00:00:00',5,20,'',NULL,'2025-07-31 09:38:10','2025-07-31 09:38:10',NULL),(24,1,NULL,NULL,1,1,'2025-08-01 00:00:00',5,20,'',NULL,'2025-07-31 09:38:10','2025-07-31 09:38:10',NULL),(25,1,NULL,NULL,1,1,'2025-08-04 00:00:00',5,20,'',NULL,'2025-07-31 09:38:10','2025-07-31 09:38:10',NULL),(26,1,NULL,NULL,1,1,'2025-08-05 00:00:00',5,20,'',NULL,'2025-07-31 09:38:10','2025-07-31 09:38:10',NULL),(27,1,NULL,NULL,1,1,'2025-08-06 00:00:00',5,20,'',NULL,'2025-07-31 09:38:10','2025-07-31 09:38:10',NULL),(28,1,NULL,NULL,1,1,'2025-08-07 00:00:00',5,20,'',NULL,'2025-07-31 09:38:10','2025-07-31 09:38:10',NULL),(29,1,NULL,NULL,1,1,'2025-08-08 00:00:00',5,20,'',NULL,'2025-07-31 09:38:10','2025-07-31 09:38:10',NULL),(30,1,NULL,NULL,1,1,'2025-08-11 00:00:00',5,20,'',NULL,'2025-07-31 09:38:10','2025-07-31 09:38:10',NULL),(31,1,NULL,NULL,1,1,'2025-08-12 00:00:00',5,20,'',NULL,'2025-07-31 09:38:10','2025-07-31 09:38:10',NULL),(32,1,NULL,NULL,1,1,'2025-08-13 00:00:00',5,20,'',NULL,'2025-07-31 09:38:10','2025-07-31 09:38:10',NULL),(33,1,NULL,NULL,1,1,'2025-08-14 00:00:00',5,20,'',NULL,'2025-07-31 09:38:10','2025-07-31 09:38:10',NULL),(34,1,NULL,NULL,1,1,'2025-08-15 00:00:00',5,20,'',NULL,'2025-07-31 09:38:10','2025-07-31 09:38:10',NULL),(35,1,NULL,NULL,1,1,'2025-08-18 00:00:00',5,20,'',NULL,'2025-07-31 09:38:10','2025-07-31 09:38:10',NULL),(36,1,NULL,NULL,1,1,'2025-08-19 00:00:00',5,20,'',NULL,'2025-07-31 09:38:10','2025-07-31 09:38:10',NULL),(37,1,NULL,NULL,1,1,'2025-08-20 00:00:00',5,20,'',NULL,'2025-07-31 09:38:10','2025-07-31 09:38:10',NULL),(38,1,NULL,NULL,1,1,'2025-08-21 00:00:00',5,20,'',NULL,'2025-07-31 09:38:10','2025-07-31 09:38:10',NULL),(39,1,NULL,NULL,1,1,'2025-08-22 00:00:00',5,20,'',NULL,'2025-07-31 09:38:10','2025-07-31 09:38:10',NULL),(40,1,NULL,NULL,1,1,'2025-08-25 00:00:00',5,20,'',NULL,'2025-07-31 09:38:10','2025-07-31 09:38:10',NULL),(41,1,NULL,NULL,1,1,'2025-08-26 00:00:00',5,20,'',NULL,'2025-07-31 09:38:10','2025-07-31 09:38:10',NULL),(42,1,NULL,NULL,1,1,'2025-08-27 00:00:00',5,20,'',NULL,'2025-07-31 09:38:10','2025-07-31 09:38:10',NULL),(43,1,NULL,NULL,1,1,'2025-08-28 00:00:00',5,20,'',NULL,'2025-07-31 09:38:10','2025-07-31 09:38:10',NULL),(44,1,NULL,NULL,1,1,'2025-08-29 00:00:00',5,20,'',NULL,'2025-07-31 09:38:10','2025-07-31 09:38:10',NULL),(45,1,NULL,NULL,1,1,'2025-09-01 00:00:00',5,20,'',NULL,'2025-07-31 09:38:10','2025-07-31 09:38:10',NULL),(46,1,NULL,NULL,1,1,'2025-09-02 00:00:00',5,20,'',1,'2025-07-31 09:38:10','2025-07-31 10:24:00','2025-07-31 10:24:00'),(47,1,NULL,NULL,1,1,'2025-09-03 00:00:00',5,20,'',1,'2025-07-31 09:38:10','2025-07-31 10:24:00','2025-07-31 10:24:00'),(48,1,NULL,NULL,1,1,'2025-09-04 00:00:00',5,20,'',1,'2025-07-31 09:38:10','2025-07-31 10:24:00','2025-07-31 10:24:00'),(49,1,NULL,NULL,1,1,'2025-09-05 00:00:00',5,20,'',1,'2025-07-31 09:38:10','2025-07-31 10:24:00','2025-07-31 10:24:00'),(50,1,NULL,NULL,1,1,'2025-09-08 00:00:00',5,20,'',NULL,'2025-07-31 09:38:10','2025-07-31 09:38:10',NULL),(51,1,NULL,NULL,1,1,'2025-09-09 00:00:00',5,20,'',NULL,'2025-07-31 09:38:10','2025-07-31 09:38:10',NULL),(52,1,NULL,NULL,1,1,'2025-09-10 00:00:00',5,20,'',NULL,'2025-07-31 09:38:10','2025-07-31 09:38:10',NULL),(53,1,NULL,NULL,1,1,'2025-09-11 00:00:00',5,20,'',NULL,'2025-07-31 09:38:10','2025-07-31 09:38:10',NULL),(54,1,NULL,NULL,1,1,'2025-09-12 00:00:00',5,20,'',NULL,'2025-07-31 09:38:10','2025-07-31 09:38:10',NULL),(55,1,NULL,NULL,1,1,'2025-09-15 00:00:00',5,20,'',NULL,'2025-07-31 09:38:10','2025-07-31 09:38:10',NULL),(56,1,NULL,NULL,1,1,'2025-09-16 00:00:00',5,20,'',NULL,'2025-07-31 09:38:10','2025-07-31 09:38:10',NULL),(57,1,NULL,NULL,1,1,'2025-09-17 00:00:00',5,20,'',NULL,'2025-07-31 09:38:10','2025-07-31 09:38:10',NULL),(58,1,NULL,NULL,1,1,'2025-09-18 00:00:00',5,20,'',NULL,'2025-07-31 09:38:10','2025-07-31 09:38:10',NULL),(59,1,NULL,NULL,1,1,'2025-09-19 00:00:00',5,20,'',NULL,'2025-07-31 09:38:10','2025-07-31 09:38:10',NULL),(60,1,NULL,NULL,1,1,'2025-09-22 00:00:00',5,20,'',NULL,'2025-07-31 09:38:10','2025-07-31 09:38:10',NULL),(61,1,NULL,NULL,1,1,'2025-09-23 00:00:00',5,20,'',NULL,'2025-07-31 09:38:10','2025-07-31 09:38:10',NULL),(62,1,NULL,NULL,1,1,'2025-09-24 00:00:00',5,20,'',NULL,'2025-07-31 09:38:10','2025-07-31 09:38:10',NULL),(63,1,NULL,NULL,1,1,'2025-09-25 00:00:00',5,20,'',NULL,'2025-07-31 09:38:10','2025-07-31 09:38:10',NULL),(64,1,NULL,NULL,1,1,'2025-09-26 00:00:00',5,20,'',NULL,'2025-07-31 09:38:10','2025-07-31 09:38:10',NULL),(65,1,NULL,NULL,1,1,'2025-09-29 00:00:00',5,20,'',NULL,'2025-07-31 09:38:10','2025-07-31 09:38:10',NULL),(66,1,NULL,NULL,1,1,'2025-09-30 00:00:00',5,20,'',NULL,'2025-07-31 09:38:10','2025-07-31 09:38:10',NULL),(67,1,NULL,NULL,1,1,'2025-10-01 00:00:00',5,20,'',NULL,'2025-07-31 09:38:10','2025-07-31 09:38:10',NULL),(68,1,NULL,NULL,1,1,'2025-10-02 00:00:00',5,20,'',NULL,'2025-07-31 09:38:10','2025-07-31 09:38:10',NULL),(69,1,NULL,NULL,1,1,'2025-10-03 00:00:00',5,20,'',NULL,'2025-07-31 09:38:10','2025-07-31 09:38:10',NULL),(70,1,NULL,NULL,1,1,'2025-10-06 00:00:00',5,20,'',NULL,'2025-07-31 09:38:10','2025-07-31 09:38:10',NULL),(71,1,NULL,NULL,1,1,'2025-10-07 00:00:00',5,20,'',NULL,'2025-07-31 09:38:10','2025-07-31 09:38:10',NULL),(72,1,NULL,NULL,1,1,'2025-10-08 00:00:00',5,20,'',NULL,'2025-07-31 09:38:10','2025-07-31 09:38:10',NULL),(73,1,NULL,NULL,1,1,'2025-10-09 00:00:00',5,20,'',NULL,'2025-07-31 09:38:10','2025-07-31 09:38:10',NULL),(74,1,NULL,NULL,1,1,'2025-10-10 00:00:00',5,20,'',NULL,'2025-07-31 09:38:10','2025-07-31 09:38:10',NULL),(75,1,NULL,NULL,1,1,'2025-10-13 00:00:00',5,20,'',NULL,'2025-07-31 09:38:10','2025-07-31 09:38:10',NULL),(76,1,NULL,NULL,1,1,'2025-10-14 00:00:00',5,20,'',NULL,'2025-07-31 09:38:10','2025-07-31 09:38:10',NULL),(77,1,NULL,NULL,1,1,'2025-10-15 00:00:00',5,20,'',NULL,'2025-07-31 09:38:10','2025-07-31 09:38:10',NULL),(78,1,NULL,NULL,1,1,'2025-10-16 00:00:00',5,20,'',NULL,'2025-07-31 09:38:10','2025-07-31 09:38:10',NULL),(79,1,NULL,NULL,1,1,'2025-10-17 00:00:00',5,20,'',NULL,'2025-07-31 09:38:10','2025-07-31 09:38:10',NULL),(80,1,NULL,NULL,1,1,'2025-10-20 00:00:00',5,20,'',NULL,'2025-07-31 09:38:10','2025-07-31 09:38:10',NULL),(81,1,NULL,NULL,1,1,'2025-10-21 00:00:00',5,20,'',NULL,'2025-07-31 09:38:10','2025-07-31 09:38:10',NULL),(82,1,NULL,NULL,1,1,'2025-10-22 00:00:00',5,20,'',NULL,'2025-07-31 09:38:10','2025-07-31 09:38:10',NULL),(83,1,NULL,NULL,1,1,'2025-10-23 00:00:00',5,20,'',NULL,'2025-07-31 09:38:10','2025-07-31 09:38:10',NULL),(84,1,NULL,NULL,1,1,'2025-10-24 00:00:00',5,20,'',NULL,'2025-07-31 09:38:10','2025-07-31 09:38:10',NULL),(85,1,NULL,NULL,1,1,'2025-10-27 00:00:00',5,20,'',NULL,'2025-07-31 09:38:10','2025-07-31 09:38:10',NULL),(86,1,NULL,NULL,1,1,'2025-10-28 00:00:00',5,20,'',NULL,'2025-07-31 09:38:10','2025-07-31 09:38:10',NULL),(87,1,NULL,NULL,1,1,'2025-10-29 00:00:00',5,20,'',NULL,'2025-07-31 09:38:10','2025-07-31 09:38:10',NULL),(88,1,NULL,NULL,1,1,'2025-10-30 00:00:00',5,20,'',NULL,'2025-07-31 09:38:10','2025-07-31 09:38:10',NULL),(89,1,NULL,NULL,1,1,'2025-10-31 00:00:00',5,20,'',NULL,'2025-07-31 09:38:10','2025-07-31 09:38:10',NULL),(90,1,NULL,NULL,1,1,'2025-11-03 00:00:00',5,20,'',NULL,'2025-07-31 09:38:10','2025-07-31 09:38:10',NULL),(91,1,NULL,NULL,1,1,'2025-11-04 00:00:00',5,20,'',NULL,'2025-07-31 09:38:10','2025-07-31 09:38:10',NULL),(92,1,NULL,NULL,1,1,'2025-11-05 00:00:00',5,20,'',NULL,'2025-07-31 09:38:10','2025-07-31 09:38:10',NULL),(93,1,NULL,NULL,1,1,'2025-11-06 00:00:00',5,20,'',NULL,'2025-07-31 09:38:10','2025-07-31 09:38:10',NULL),(94,1,NULL,NULL,1,1,'2025-11-07 00:00:00',5,20,'',NULL,'2025-07-31 09:38:10','2025-07-31 09:38:10',NULL),(95,1,NULL,NULL,1,1,'2025-11-10 00:00:00',5,20,'',NULL,'2025-07-31 09:38:10','2025-07-31 09:38:10',NULL),(96,1,NULL,NULL,1,1,'2025-11-11 00:00:00',5,20,'',NULL,'2025-07-31 09:38:10','2025-07-31 09:38:10',NULL),(97,1,NULL,NULL,1,1,'2025-11-12 00:00:00',5,20,'',NULL,'2025-07-31 09:38:10','2025-07-31 09:38:10',NULL),(98,1,NULL,NULL,1,1,'2025-11-13 00:00:00',5,20,'',NULL,'2025-07-31 09:38:10','2025-07-31 09:38:10',NULL),(99,1,NULL,NULL,1,1,'2025-11-14 00:00:00',5,20,'',NULL,'2025-07-31 09:38:10','2025-07-31 09:38:10',NULL),(100,1,NULL,NULL,1,1,'2025-11-17 00:00:00',5,20,'',NULL,'2025-07-31 09:38:10','2025-07-31 09:38:10',NULL),(101,1,NULL,NULL,1,1,'2025-11-18 00:00:00',5,20,'',NULL,'2025-07-31 09:38:10','2025-07-31 09:38:10',NULL),(102,1,NULL,NULL,1,1,'2025-11-19 00:00:00',5,20,'',NULL,'2025-07-31 09:38:10','2025-07-31 09:38:10',NULL),(103,1,NULL,NULL,1,1,'2025-11-20 00:00:00',5,20,'',NULL,'2025-07-31 09:38:10','2025-07-31 09:38:10',NULL),(104,1,NULL,NULL,1,1,'2025-11-21 00:00:00',5,20,'',NULL,'2025-07-31 09:38:10','2025-07-31 09:38:10',NULL),(105,1,NULL,NULL,1,1,'2025-11-24 00:00:00',5,20,'',NULL,'2025-07-31 09:38:10','2025-07-31 09:38:10',NULL),(106,1,NULL,NULL,1,1,'2025-11-25 00:00:00',5,20,'',NULL,'2025-07-31 09:38:10','2025-07-31 09:38:10',NULL),(107,1,NULL,NULL,1,1,'2025-11-26 00:00:00',5,20,'',NULL,'2025-07-31 09:38:10','2025-07-31 09:38:10',NULL),(108,1,NULL,NULL,1,1,'2025-11-27 00:00:00',5,20,'',NULL,'2025-07-31 09:38:10','2025-07-31 09:38:10',NULL),(109,1,NULL,NULL,1,1,'2025-11-28 00:00:00',5,20,'',NULL,'2025-07-31 09:38:10','2025-07-31 09:38:10',NULL),(110,1,NULL,NULL,1,1,'2025-12-01 00:00:00',5,20,'',NULL,'2025-07-31 09:38:10','2025-07-31 09:38:10',NULL),(111,1,NULL,NULL,1,1,'2025-12-02 00:00:00',5,20,'',NULL,'2025-07-31 09:38:11','2025-07-31 09:38:11',NULL),(112,1,NULL,NULL,1,1,'2025-12-03 00:00:00',5,20,'',NULL,'2025-07-31 09:38:11','2025-07-31 09:38:11',NULL),(113,1,NULL,NULL,1,1,'2025-12-04 00:00:00',5,20,'',NULL,'2025-07-31 09:38:11','2025-07-31 09:38:11',NULL),(114,1,NULL,NULL,1,1,'2025-12-05 00:00:00',5,20,'',NULL,'2025-07-31 09:38:11','2025-07-31 09:38:11',NULL),(115,1,NULL,NULL,1,1,'2025-12-08 00:00:00',5,20,'',NULL,'2025-07-31 09:38:11','2025-07-31 09:38:11',NULL),(116,1,NULL,NULL,1,1,'2025-12-09 00:00:00',5,20,'',NULL,'2025-07-31 09:38:11','2025-07-31 09:38:11',NULL),(117,1,NULL,NULL,1,1,'2025-12-10 00:00:00',5,20,'',NULL,'2025-07-31 09:38:11','2025-07-31 09:38:11',NULL),(118,1,NULL,NULL,1,1,'2025-12-11 00:00:00',5,20,'',NULL,'2025-07-31 09:38:11','2025-07-31 09:38:11',NULL),(119,1,NULL,NULL,1,1,'2025-12-12 00:00:00',5,20,'',NULL,'2025-07-31 09:38:11','2025-07-31 09:38:11',NULL),(120,1,NULL,NULL,1,1,'2025-12-15 00:00:00',5,20,'',NULL,'2025-07-31 09:38:11','2025-07-31 09:38:11',NULL),(121,1,NULL,NULL,1,1,'2025-12-16 00:00:00',5,20,'',NULL,'2025-07-31 09:38:11','2025-07-31 09:38:11',NULL),(122,1,NULL,NULL,1,1,'2025-12-17 00:00:00',5,20,'',NULL,'2025-07-31 09:38:11','2025-07-31 09:38:11',NULL),(123,1,NULL,NULL,1,1,'2025-12-18 00:00:00',5,20,'',NULL,'2025-07-31 09:38:11','2025-07-31 09:38:11',NULL),(124,1,NULL,NULL,1,1,'2025-12-19 00:00:00',5,20,'',NULL,'2025-07-31 09:38:11','2025-07-31 09:38:11',NULL),(125,1,NULL,NULL,1,1,'2025-12-22 00:00:00',5,20,'',NULL,'2025-07-31 09:38:11','2025-07-31 09:38:11',NULL),(126,1,NULL,NULL,1,1,'2025-12-23 00:00:00',5,20,'',NULL,'2025-07-31 09:38:11','2025-07-31 09:38:11',NULL),(127,1,NULL,NULL,1,1,'2025-12-24 00:00:00',5,20,'',NULL,'2025-07-31 09:38:11','2025-07-31 09:38:11',NULL),(128,1,NULL,NULL,1,1,'2025-12-25 00:00:00',5,20,'',NULL,'2025-07-31 09:38:11','2025-07-31 09:38:11',NULL),(129,1,NULL,NULL,1,1,'2025-12-26 00:00:00',5,20,'',NULL,'2025-07-31 09:38:11','2025-07-31 09:38:11',NULL),(130,1,NULL,NULL,1,1,'2025-12-29 00:00:00',5,20,'',NULL,'2025-07-31 09:38:11','2025-07-31 09:38:11',NULL),(131,1,NULL,NULL,1,1,'2025-12-30 00:00:00',5,20,'',NULL,'2025-07-31 09:38:11','2025-07-31 09:38:11',NULL),(132,1,NULL,NULL,1,1,'2025-12-31 00:00:00',5,20,'',NULL,'2025-07-31 09:38:11','2025-07-31 09:38:11',NULL),(133,2,NULL,NULL,2,2,'2025-07-01 00:00:00',10,15,'',NULL,'2025-07-31 09:38:11','2025-07-31 09:38:11',NULL),(134,2,NULL,NULL,2,2,'2025-07-02 00:00:00',10,15,'',NULL,'2025-07-31 09:38:11','2025-07-31 09:38:11',NULL),(135,2,NULL,NULL,2,2,'2025-07-03 00:00:00',10,15,'',NULL,'2025-07-31 09:38:11','2025-07-31 09:38:11',NULL),(136,2,NULL,NULL,2,2,'2025-07-04 00:00:00',10,15,'',NULL,'2025-07-31 09:38:11','2025-07-31 09:38:11',NULL),(137,2,NULL,NULL,2,2,'2025-07-07 00:00:00',10,15,'',NULL,'2025-07-31 09:38:11','2025-07-31 09:38:11',NULL),(138,2,NULL,NULL,2,2,'2025-07-08 00:00:00',10,15,'',NULL,'2025-07-31 09:38:11','2025-07-31 09:38:11',NULL),(139,2,NULL,NULL,2,2,'2025-07-09 00:00:00',10,15,'',NULL,'2025-07-31 09:38:11','2025-07-31 09:38:11',NULL),(140,2,NULL,NULL,2,2,'2025-07-10 00:00:00',10,15,'',NULL,'2025-07-31 09:38:11','2025-07-31 09:38:11',NULL),(141,2,NULL,NULL,2,2,'2025-07-11 00:00:00',10,15,'',NULL,'2025-07-31 09:38:11','2025-07-31 09:38:11',NULL),(142,2,NULL,NULL,2,2,'2025-07-14 00:00:00',10,15,'',NULL,'2025-07-31 09:38:11','2025-07-31 09:38:11',NULL),(143,2,NULL,NULL,2,2,'2025-07-15 00:00:00',10,15,'',NULL,'2025-07-31 09:38:11','2025-07-31 09:38:11',NULL),(144,2,NULL,NULL,2,2,'2025-07-16 00:00:00',10,15,'',NULL,'2025-07-31 09:38:11','2025-07-31 09:38:11',NULL),(145,2,NULL,NULL,2,2,'2025-07-17 00:00:00',10,15,'',NULL,'2025-07-31 09:38:11','2025-07-31 09:38:11',NULL),(146,2,NULL,NULL,2,2,'2025-07-18 00:00:00',10,15,'',NULL,'2025-07-31 09:38:11','2025-07-31 09:38:11',NULL),(147,2,NULL,NULL,2,2,'2025-07-21 00:00:00',10,15,'',NULL,'2025-07-31 09:38:11','2025-07-31 09:38:11',NULL),(148,2,NULL,NULL,2,2,'2025-07-22 00:00:00',10,15,'',NULL,'2025-07-31 09:38:11','2025-07-31 09:38:11',NULL),(149,2,NULL,NULL,2,2,'2025-07-23 00:00:00',10,15,'',NULL,'2025-07-31 09:38:11','2025-07-31 09:38:11',NULL),(150,2,NULL,NULL,2,2,'2025-07-24 00:00:00',10,15,'',NULL,'2025-07-31 09:38:11','2025-07-31 09:38:11',NULL),(151,2,NULL,NULL,2,2,'2025-07-25 00:00:00',10,15,'',NULL,'2025-07-31 09:38:11','2025-07-31 09:38:11',NULL),(152,2,NULL,NULL,2,2,'2025-07-28 00:00:00',10,15,'',NULL,'2025-07-31 09:38:11','2025-07-31 09:38:11',NULL),(153,2,NULL,NULL,2,2,'2025-07-29 00:00:00',10,15,'',NULL,'2025-07-31 09:38:11','2025-07-31 09:38:11',NULL),(154,2,NULL,NULL,2,2,'2025-07-30 00:00:00',10,15,'',NULL,'2025-07-31 09:38:11','2025-07-31 09:38:11',NULL),(155,2,NULL,NULL,2,2,'2025-07-31 00:00:00',10,15,'',NULL,'2025-07-31 09:38:11','2025-07-31 09:38:11',NULL),(156,2,NULL,NULL,2,2,'2025-08-01 00:00:00',10,15,'',NULL,'2025-07-31 09:38:11','2025-07-31 09:38:11',NULL),(157,2,NULL,NULL,2,2,'2025-08-04 00:00:00',10,15,'',NULL,'2025-07-31 09:38:11','2025-07-31 09:38:11',NULL),(158,2,NULL,NULL,2,2,'2025-08-05 00:00:00',10,15,'',NULL,'2025-07-31 09:38:11','2025-07-31 09:38:11',NULL),(159,2,NULL,NULL,2,2,'2025-08-06 00:00:00',10,15,'',NULL,'2025-07-31 09:38:11','2025-07-31 09:38:11',NULL),(160,2,NULL,NULL,2,2,'2025-08-07 00:00:00',10,15,'',NULL,'2025-07-31 09:38:11','2025-07-31 09:38:11',NULL),(161,2,NULL,NULL,2,2,'2025-08-08 00:00:00',10,15,'',NULL,'2025-07-31 09:38:11','2025-07-31 09:38:11',NULL),(162,2,NULL,NULL,2,2,'2025-08-11 00:00:00',10,15,'',NULL,'2025-07-31 09:38:11','2025-07-31 09:38:11',NULL),(163,2,NULL,NULL,2,2,'2025-08-12 00:00:00',10,15,'',NULL,'2025-07-31 09:38:11','2025-07-31 09:38:11',NULL),(164,2,NULL,NULL,2,2,'2025-08-13 00:00:00',10,15,'',NULL,'2025-07-31 09:38:11','2025-07-31 09:38:11',NULL),(165,2,NULL,NULL,2,2,'2025-08-14 00:00:00',10,15,'',NULL,'2025-07-31 09:38:11','2025-07-31 09:38:11',NULL),(166,2,NULL,NULL,2,2,'2025-08-15 00:00:00',10,15,'',NULL,'2025-07-31 09:38:11','2025-07-31 09:38:11',NULL),(167,2,NULL,NULL,2,2,'2025-08-18 00:00:00',10,15,'',NULL,'2025-07-31 09:38:11','2025-07-31 09:38:11',NULL),(168,2,NULL,NULL,2,2,'2025-08-19 00:00:00',10,15,'',NULL,'2025-07-31 09:38:11','2025-07-31 09:38:11',NULL),(169,2,NULL,NULL,2,2,'2025-08-20 00:00:00',10,15,'',NULL,'2025-07-31 09:38:11','2025-07-31 09:38:11',NULL),(170,2,NULL,NULL,2,2,'2025-08-21 00:00:00',10,15,'',NULL,'2025-07-31 09:38:11','2025-07-31 09:38:11',NULL),(171,2,NULL,NULL,2,2,'2025-08-22 00:00:00',10,15,'',NULL,'2025-07-31 09:38:11','2025-07-31 09:38:11',NULL),(172,2,NULL,NULL,2,2,'2025-08-25 00:00:00',10,15,'',NULL,'2025-07-31 09:38:11','2025-07-31 09:38:11',NULL),(173,2,NULL,NULL,2,2,'2025-08-26 00:00:00',10,15,'',NULL,'2025-07-31 09:38:11','2025-07-31 09:38:11',NULL),(174,2,NULL,NULL,2,2,'2025-08-27 00:00:00',10,15,'',NULL,'2025-07-31 09:38:11','2025-07-31 09:38:11',NULL),(175,2,NULL,NULL,2,2,'2025-08-28 00:00:00',10,15,'',NULL,'2025-07-31 09:38:11','2025-07-31 09:38:11',NULL),(176,2,NULL,NULL,2,2,'2025-08-29 00:00:00',10,15,'',NULL,'2025-07-31 09:38:11','2025-07-31 09:38:11',NULL),(177,2,NULL,NULL,2,2,'2025-09-01 00:00:00',10,15,'',NULL,'2025-07-31 09:38:11','2025-07-31 09:38:11',NULL),(178,2,NULL,NULL,2,2,'2025-09-02 00:00:00',10,15,'',1,'2025-07-31 09:38:11','2025-07-31 10:24:00','2025-07-31 10:24:00'),(179,2,NULL,NULL,2,2,'2025-09-03 00:00:00',10,15,'',1,'2025-07-31 09:38:11','2025-07-31 10:24:00','2025-07-31 10:24:00'),(180,2,NULL,NULL,2,2,'2025-09-04 00:00:00',10,15,'',1,'2025-07-31 09:38:11','2025-07-31 10:24:00','2025-07-31 10:24:00'),(181,2,NULL,NULL,2,2,'2025-09-05 00:00:00',10,15,'',1,'2025-07-31 09:38:11','2025-07-31 10:24:00','2025-07-31 10:24:00'),(182,2,NULL,NULL,2,2,'2025-09-08 00:00:00',10,15,'',NULL,'2025-07-31 09:38:11','2025-07-31 09:38:11',NULL),(183,2,NULL,NULL,2,2,'2025-09-09 00:00:00',10,15,'',NULL,'2025-07-31 09:38:11','2025-07-31 09:38:11',NULL),(184,2,NULL,NULL,2,2,'2025-09-10 00:00:00',10,15,'',NULL,'2025-07-31 09:38:11','2025-07-31 09:38:11',NULL),(185,2,NULL,NULL,2,2,'2025-09-11 00:00:00',10,15,'',NULL,'2025-07-31 09:38:11','2025-07-31 09:38:11',NULL),(186,2,NULL,NULL,2,2,'2025-09-12 00:00:00',10,15,'',NULL,'2025-07-31 09:38:11','2025-07-31 09:38:11',NULL),(187,2,NULL,NULL,2,2,'2025-09-15 00:00:00',10,15,'',NULL,'2025-07-31 09:38:11','2025-07-31 09:38:11',NULL),(188,2,NULL,NULL,2,2,'2025-09-16 00:00:00',10,15,'',NULL,'2025-07-31 09:38:11','2025-07-31 09:38:11',NULL),(189,2,NULL,NULL,2,2,'2025-09-17 00:00:00',10,15,'',NULL,'2025-07-31 09:38:11','2025-07-31 09:38:11',NULL),(190,2,NULL,NULL,2,2,'2025-09-18 00:00:00',10,15,'',NULL,'2025-07-31 09:38:11','2025-07-31 09:38:11',NULL),(191,2,NULL,NULL,2,2,'2025-09-19 00:00:00',10,15,'',NULL,'2025-07-31 09:38:11','2025-07-31 09:38:11',NULL),(192,2,NULL,NULL,2,2,'2025-09-22 00:00:00',10,15,'',NULL,'2025-07-31 09:38:11','2025-07-31 09:38:11',NULL),(193,2,NULL,NULL,2,2,'2025-09-23 00:00:00',10,15,'',NULL,'2025-07-31 09:38:11','2025-07-31 09:38:11',NULL),(194,2,NULL,NULL,2,2,'2025-09-24 00:00:00',10,15,'',NULL,'2025-07-31 09:38:11','2025-07-31 09:38:11',NULL),(195,2,NULL,NULL,2,2,'2025-09-25 00:00:00',10,15,'',NULL,'2025-07-31 09:38:11','2025-07-31 09:38:11',NULL),(196,2,NULL,NULL,2,2,'2025-09-26 00:00:00',10,15,'',NULL,'2025-07-31 09:38:11','2025-07-31 09:38:11',NULL),(197,2,NULL,NULL,2,2,'2025-09-29 00:00:00',10,15,'',NULL,'2025-07-31 09:38:11','2025-07-31 09:38:11',NULL),(198,2,NULL,NULL,2,2,'2025-09-30 00:00:00',10,15,'',NULL,'2025-07-31 09:38:11','2025-07-31 09:38:11',NULL),(199,2,NULL,NULL,2,2,'2025-10-01 00:00:00',10,15,'',NULL,'2025-07-31 09:38:11','2025-07-31 09:38:11',NULL),(200,2,NULL,NULL,2,2,'2025-10-02 00:00:00',10,15,'',NULL,'2025-07-31 09:38:11','2025-07-31 09:38:11',NULL),(201,2,NULL,NULL,2,2,'2025-10-03 00:00:00',10,15,'',NULL,'2025-07-31 09:38:11','2025-07-31 09:38:11',NULL),(202,2,NULL,NULL,2,2,'2025-10-06 00:00:00',10,15,'',NULL,'2025-07-31 09:38:11','2025-07-31 09:38:11',NULL),(203,2,NULL,NULL,2,2,'2025-10-07 00:00:00',10,15,'',NULL,'2025-07-31 09:38:11','2025-07-31 09:38:11',NULL),(204,2,NULL,NULL,2,2,'2025-10-08 00:00:00',10,15,'',NULL,'2025-07-31 09:38:11','2025-07-31 09:38:11',NULL),(205,2,NULL,NULL,2,2,'2025-10-09 00:00:00',10,15,'',NULL,'2025-07-31 09:38:11','2025-07-31 09:38:11',NULL),(206,2,NULL,NULL,2,2,'2025-10-10 00:00:00',10,15,'',NULL,'2025-07-31 09:38:11','2025-07-31 09:38:11',NULL),(207,2,NULL,NULL,2,2,'2025-10-13 00:00:00',10,15,'',NULL,'2025-07-31 09:38:11','2025-07-31 09:38:11',NULL),(208,2,NULL,NULL,2,2,'2025-10-14 00:00:00',10,15,'',NULL,'2025-07-31 09:38:11','2025-07-31 09:38:11',NULL),(209,2,NULL,NULL,2,2,'2025-10-15 00:00:00',10,15,'',NULL,'2025-07-31 09:38:11','2025-07-31 09:38:11',NULL),(210,2,NULL,NULL,2,2,'2025-10-16 00:00:00',10,15,'',NULL,'2025-07-31 09:38:11','2025-07-31 09:38:11',NULL),(211,2,NULL,NULL,2,2,'2025-10-17 00:00:00',10,15,'',NULL,'2025-07-31 09:38:11','2025-07-31 09:38:11',NULL),(212,2,NULL,NULL,2,2,'2025-10-20 00:00:00',10,15,'',NULL,'2025-07-31 09:38:11','2025-07-31 09:38:11',NULL),(213,2,NULL,NULL,2,2,'2025-10-21 00:00:00',10,15,'',NULL,'2025-07-31 09:38:11','2025-07-31 09:38:11',NULL),(214,2,NULL,NULL,2,2,'2025-10-22 00:00:00',10,15,'',NULL,'2025-07-31 09:38:11','2025-07-31 09:38:11',NULL),(215,2,NULL,NULL,2,2,'2025-10-23 00:00:00',10,15,'',NULL,'2025-07-31 09:38:11','2025-07-31 09:38:11',NULL),(216,2,NULL,NULL,2,2,'2025-10-24 00:00:00',10,15,'',NULL,'2025-07-31 09:38:11','2025-07-31 09:38:11',NULL),(217,2,NULL,NULL,2,2,'2025-10-27 00:00:00',10,15,'',NULL,'2025-07-31 09:38:11','2025-07-31 09:38:11',NULL),(218,2,NULL,NULL,2,2,'2025-10-28 00:00:00',10,15,'',NULL,'2025-07-31 09:38:11','2025-07-31 09:38:11',NULL),(219,2,NULL,NULL,2,2,'2025-10-29 00:00:00',10,15,'',NULL,'2025-07-31 09:38:11','2025-07-31 09:38:11',NULL),(220,2,NULL,NULL,2,2,'2025-10-30 00:00:00',10,15,'',NULL,'2025-07-31 09:38:11','2025-07-31 09:38:11',NULL),(221,2,NULL,NULL,2,2,'2025-10-31 00:00:00',10,15,'',NULL,'2025-07-31 09:38:11','2025-07-31 09:38:11',NULL),(222,2,NULL,NULL,2,2,'2025-11-03 00:00:00',10,15,'',NULL,'2025-07-31 09:38:11','2025-07-31 09:38:11',NULL),(223,2,NULL,NULL,2,2,'2025-11-04 00:00:00',10,15,'',NULL,'2025-07-31 09:38:11','2025-07-31 09:38:11',NULL),(224,2,NULL,NULL,2,2,'2025-11-05 00:00:00',10,15,'',NULL,'2025-07-31 09:38:11','2025-07-31 09:38:11',NULL),(225,2,NULL,NULL,2,2,'2025-11-06 00:00:00',10,15,'',NULL,'2025-07-31 09:38:11','2025-07-31 09:38:11',NULL),(226,2,NULL,NULL,2,2,'2025-11-07 00:00:00',10,15,'',NULL,'2025-07-31 09:38:11','2025-07-31 09:38:11',NULL),(227,2,NULL,NULL,2,2,'2025-11-10 00:00:00',10,15,'',NULL,'2025-07-31 09:38:11','2025-07-31 09:38:11',NULL),(228,2,NULL,NULL,2,2,'2025-11-11 00:00:00',10,15,'',NULL,'2025-07-31 09:38:11','2025-07-31 09:38:11',NULL),(229,2,NULL,NULL,2,2,'2025-11-12 00:00:00',10,15,'',NULL,'2025-07-31 09:38:11','2025-07-31 09:38:11',NULL),(230,2,NULL,NULL,2,2,'2025-11-13 00:00:00',10,15,'',NULL,'2025-07-31 09:38:11','2025-07-31 09:38:11',NULL),(231,2,NULL,NULL,2,2,'2025-11-14 00:00:00',10,15,'',NULL,'2025-07-31 09:38:11','2025-07-31 09:38:11',NULL),(232,2,NULL,NULL,2,2,'2025-11-17 00:00:00',10,15,'',NULL,'2025-07-31 09:38:11','2025-07-31 09:38:11',NULL),(233,2,NULL,NULL,2,2,'2025-11-18 00:00:00',10,15,'',NULL,'2025-07-31 09:38:11','2025-07-31 09:38:11',NULL),(234,2,NULL,NULL,2,2,'2025-11-19 00:00:00',10,15,'',NULL,'2025-07-31 09:38:11','2025-07-31 09:38:11',NULL),(235,2,NULL,NULL,2,2,'2025-11-20 00:00:00',10,15,'',NULL,'2025-07-31 09:38:11','2025-07-31 09:38:11',NULL),(236,2,NULL,NULL,2,2,'2025-11-21 00:00:00',10,15,'',NULL,'2025-07-31 09:38:11','2025-07-31 09:38:11',NULL),(237,2,NULL,NULL,2,2,'2025-11-24 00:00:00',10,15,'',NULL,'2025-07-31 09:38:11','2025-07-31 09:38:11',NULL),(238,2,NULL,NULL,2,2,'2025-11-25 00:00:00',10,15,'',NULL,'2025-07-31 09:38:11','2025-07-31 09:38:11',NULL),(239,2,NULL,NULL,2,2,'2025-11-26 00:00:00',10,15,'',NULL,'2025-07-31 09:38:11','2025-07-31 09:38:11',NULL),(240,2,NULL,NULL,2,2,'2025-11-27 00:00:00',10,15,'',NULL,'2025-07-31 09:38:11','2025-07-31 09:38:11',NULL),(241,2,NULL,NULL,2,2,'2025-11-28 00:00:00',10,15,'',NULL,'2025-07-31 09:38:11','2025-07-31 09:38:11',NULL),(242,2,NULL,NULL,2,2,'2025-12-01 00:00:00',10,15,'',NULL,'2025-07-31 09:38:11','2025-07-31 09:38:11',NULL),(243,2,NULL,NULL,2,2,'2025-12-02 00:00:00',10,15,'',NULL,'2025-07-31 09:38:11','2025-07-31 09:38:11',NULL),(244,2,NULL,NULL,2,2,'2025-12-03 00:00:00',10,15,'',NULL,'2025-07-31 09:38:11','2025-07-31 09:38:11',NULL),(245,2,NULL,NULL,2,2,'2025-12-04 00:00:00',10,15,'',NULL,'2025-07-31 09:38:11','2025-07-31 09:38:11',NULL),(246,2,NULL,NULL,2,2,'2025-12-05 00:00:00',10,15,'',NULL,'2025-07-31 09:38:11','2025-07-31 09:38:11',NULL),(247,2,NULL,NULL,2,2,'2025-12-08 00:00:00',10,15,'',NULL,'2025-07-31 09:38:11','2025-07-31 09:38:11',NULL),(248,2,NULL,NULL,2,2,'2025-12-09 00:00:00',10,15,'',NULL,'2025-07-31 09:38:11','2025-07-31 09:38:11',NULL),(249,2,NULL,NULL,2,2,'2025-12-10 00:00:00',10,15,'',NULL,'2025-07-31 09:38:11','2025-07-31 09:38:11',NULL),(250,2,NULL,NULL,2,2,'2025-12-11 00:00:00',10,15,'',NULL,'2025-07-31 09:38:11','2025-07-31 09:38:11',NULL),(251,2,NULL,NULL,2,2,'2025-12-12 00:00:00',10,15,'',NULL,'2025-07-31 09:38:11','2025-07-31 09:38:11',NULL),(252,2,NULL,NULL,2,2,'2025-12-15 00:00:00',10,15,'',NULL,'2025-07-31 09:38:11','2025-07-31 09:38:11',NULL),(253,2,NULL,NULL,2,2,'2025-12-16 00:00:00',10,15,'',NULL,'2025-07-31 09:38:11','2025-07-31 09:38:11',NULL),(254,2,NULL,NULL,2,2,'2025-12-17 00:00:00',10,15,'',NULL,'2025-07-31 09:38:11','2025-07-31 09:38:11',NULL),(255,2,NULL,NULL,2,2,'2025-12-18 00:00:00',10,15,'',NULL,'2025-07-31 09:38:11','2025-07-31 09:38:11',NULL),(256,2,NULL,NULL,2,2,'2025-12-19 00:00:00',10,15,'',NULL,'2025-07-31 09:38:11','2025-07-31 09:38:11',NULL),(257,2,NULL,NULL,2,2,'2025-12-22 00:00:00',10,15,'',NULL,'2025-07-31 09:38:11','2025-07-31 09:38:11',NULL),(258,2,NULL,NULL,2,2,'2025-12-23 00:00:00',10,15,'',NULL,'2025-07-31 09:38:11','2025-07-31 09:38:11',NULL),(259,2,NULL,NULL,2,2,'2025-12-24 00:00:00',10,15,'',NULL,'2025-07-31 09:38:11','2025-07-31 09:38:11',NULL),(260,2,NULL,NULL,2,2,'2025-12-25 00:00:00',10,15,'',NULL,'2025-07-31 09:38:11','2025-07-31 09:38:11',NULL),(261,2,NULL,NULL,2,2,'2025-12-26 00:00:00',10,15,'',NULL,'2025-07-31 09:38:11','2025-07-31 09:38:11',NULL),(262,2,NULL,NULL,2,2,'2025-12-29 00:00:00',10,15,'',NULL,'2025-07-31 09:38:11','2025-07-31 09:38:11',NULL),(263,2,NULL,NULL,2,2,'2025-12-30 00:00:00',10,15,'',NULL,'2025-07-31 09:38:11','2025-07-31 09:38:11',NULL),(264,2,NULL,NULL,2,2,'2025-12-31 00:00:00',10,15,'',NULL,'2025-07-31 09:38:11','2025-07-31 09:38:11',NULL),(265,3,NULL,NULL,1,1,'2025-08-01 00:00:00',50,0,'',NULL,'2025-08-01 01:36:43','2025-08-01 01:36:43',NULL),(266,3,NULL,NULL,1,1,'2025-08-04 00:00:00',50,0,'',NULL,'2025-08-01 01:36:43','2025-08-01 01:36:43',NULL),(267,3,NULL,NULL,1,1,'2025-08-05 00:00:00',50,0,'',NULL,'2025-08-01 01:36:43','2025-08-01 01:36:43',NULL),(268,3,NULL,NULL,1,1,'2025-08-06 00:00:00',50,0,'',NULL,'2025-08-01 01:36:43','2025-08-01 01:36:43',NULL),(269,3,NULL,NULL,1,1,'2025-08-07 00:00:00',50,0,'',NULL,'2025-08-01 01:36:43','2025-08-01 01:36:43',NULL),(270,3,NULL,NULL,1,1,'2025-08-08 00:00:00',50,0,'',NULL,'2025-08-01 01:36:43','2025-08-01 01:36:43',NULL),(271,3,NULL,NULL,1,1,'2025-08-11 00:00:00',50,0,'',NULL,'2025-08-01 01:36:43','2025-08-01 01:36:43',NULL),(272,3,NULL,NULL,1,1,'2025-08-12 00:00:00',50,0,'',NULL,'2025-08-01 01:36:43','2025-08-01 01:36:43',NULL),(273,3,NULL,NULL,1,1,'2025-08-13 00:00:00',50,0,'',NULL,'2025-08-01 01:36:43','2025-08-01 01:36:43',NULL),(274,3,NULL,NULL,1,1,'2025-08-14 00:00:00',50,0,'',NULL,'2025-08-01 01:36:43','2025-08-01 01:36:43',NULL),(275,3,NULL,NULL,1,1,'2025-08-15 00:00:00',50,0,'',NULL,'2025-08-01 01:36:43','2025-08-01 01:36:43',NULL),(276,3,NULL,NULL,1,1,'2025-08-18 00:00:00',50,0,'',NULL,'2025-08-01 01:36:43','2025-08-01 01:36:43',NULL),(277,3,NULL,NULL,1,1,'2025-08-19 00:00:00',50,0,'',NULL,'2025-08-01 01:36:43','2025-08-01 01:36:43',NULL),(278,3,NULL,NULL,1,1,'2025-08-20 00:00:00',50,0,'',NULL,'2025-08-01 01:36:43','2025-08-01 01:36:43',NULL),(279,3,NULL,NULL,1,1,'2025-08-21 00:00:00',50,0,'',NULL,'2025-08-01 01:36:43','2025-08-01 01:36:43',NULL),(280,3,NULL,NULL,1,1,'2025-08-22 00:00:00',50,0,'',NULL,'2025-08-01 01:36:43','2025-08-01 01:36:43',NULL),(281,3,NULL,NULL,1,1,'2025-08-25 00:00:00',50,0,'',NULL,'2025-08-01 01:36:43','2025-08-01 01:36:43',NULL),(282,3,NULL,NULL,1,1,'2025-08-26 00:00:00',50,0,'',NULL,'2025-08-01 01:36:43','2025-08-01 01:36:43',NULL),(283,3,NULL,NULL,1,1,'2025-08-27 00:00:00',50,0,'',NULL,'2025-08-01 01:36:43','2025-08-01 01:36:43',NULL),(284,3,NULL,NULL,1,1,'2025-08-28 00:00:00',50,0,'',NULL,'2025-08-01 01:36:43','2025-08-01 01:36:43',NULL),(285,3,NULL,NULL,1,1,'2025-08-29 00:00:00',50,0,'',NULL,'2025-08-01 01:36:43','2025-08-01 01:36:43',NULL),(286,3,NULL,NULL,1,1,'2025-09-01 00:00:00',50,0,'',NULL,'2025-08-01 01:36:43','2025-08-01 01:36:43',NULL),(287,3,NULL,NULL,1,1,'2025-09-02 00:00:00',50,0,'',1,'2025-08-01 01:36:43','2025-08-01 01:36:43','2025-08-01 01:36:43'),(288,3,NULL,NULL,1,1,'2025-09-03 00:00:00',50,0,'',1,'2025-08-01 01:36:43','2025-08-01 01:36:43','2025-08-01 01:36:43'),(289,3,NULL,NULL,1,1,'2025-09-04 00:00:00',50,0,'',1,'2025-08-01 01:36:43','2025-08-01 01:36:43','2025-08-01 01:36:43'),(290,3,NULL,NULL,1,1,'2025-09-05 00:00:00',50,0,'',1,'2025-08-01 01:36:43','2025-08-01 01:36:43','2025-08-01 01:36:43'),(291,3,NULL,NULL,1,1,'2025-09-08 00:00:00',50,0,'',NULL,'2025-08-01 01:36:43','2025-08-01 01:36:43',NULL),(292,3,NULL,NULL,1,1,'2025-09-09 00:00:00',50,0,'',NULL,'2025-08-01 01:36:43','2025-08-01 01:36:43',NULL),(293,3,NULL,NULL,1,1,'2025-09-10 00:00:00',50,0,'',NULL,'2025-08-01 01:36:43','2025-08-01 01:36:43',NULL),(294,3,NULL,NULL,1,1,'2025-09-11 00:00:00',50,0,'',NULL,'2025-08-01 01:36:43','2025-08-01 01:36:43',NULL),(295,3,NULL,NULL,1,1,'2025-09-12 00:00:00',50,0,'',NULL,'2025-08-01 01:36:43','2025-08-01 01:36:43',NULL),(296,3,NULL,NULL,1,1,'2025-09-15 00:00:00',50,0,'',NULL,'2025-08-01 01:36:43','2025-08-01 01:36:43',NULL),(297,3,NULL,NULL,1,1,'2025-09-16 00:00:00',50,0,'',NULL,'2025-08-01 01:36:43','2025-08-01 01:36:43',NULL),(298,3,NULL,NULL,1,1,'2025-09-17 00:00:00',50,0,'',NULL,'2025-08-01 01:36:43','2025-08-01 01:36:43',NULL),(299,3,NULL,NULL,1,1,'2025-09-18 00:00:00',50,0,'',NULL,'2025-08-01 01:36:43','2025-08-01 01:36:43',NULL),(300,3,NULL,NULL,1,1,'2025-09-19 00:00:00',50,0,'',NULL,'2025-08-01 01:36:43','2025-08-01 01:36:43',NULL),(301,3,NULL,NULL,1,1,'2025-09-22 00:00:00',50,0,'',NULL,'2025-08-01 01:36:43','2025-08-01 01:36:43',NULL),(302,3,NULL,NULL,1,1,'2025-09-23 00:00:00',50,0,'',NULL,'2025-08-01 01:36:43','2025-08-01 01:36:43',NULL),(303,3,NULL,NULL,1,1,'2025-09-24 00:00:00',50,0,'',NULL,'2025-08-01 01:36:43','2025-08-01 01:36:43',NULL),(304,3,NULL,NULL,1,1,'2025-09-25 00:00:00',50,0,'',NULL,'2025-08-01 01:36:43','2025-08-01 01:36:43',NULL),(305,3,NULL,NULL,1,1,'2025-09-26 00:00:00',50,0,'',NULL,'2025-08-01 01:36:43','2025-08-01 01:36:43',NULL),(306,3,NULL,NULL,1,1,'2025-09-29 00:00:00',50,0,'',NULL,'2025-08-01 01:36:43','2025-08-01 01:36:43',NULL),(307,3,NULL,NULL,1,1,'2025-09-30 00:00:00',50,0,'',NULL,'2025-08-01 01:36:43','2025-08-01 01:36:43',NULL);
/*!40000 ALTER TABLE `resources` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `role`
--

DROP TABLE IF EXISTS `role`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `role` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `allDivision` enum('all','division') NOT NULL,
  `flag_protected` tinyint NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `role`
--

LOCK TABLES `role` WRITE;
/*!40000 ALTER TABLE `role` DISABLE KEYS */;
INSERT INTO `role` VALUES (1,'admin','all',1,'2025-07-31 01:57:08','2025-07-31 01:57:08',NULL),(2,'member','division',1,'2025-07-31 01:57:08','2025-07-31 01:57:08',NULL),(3,'los','division',0,'2025-07-31 01:57:08','2025-07-31 01:57:08',NULL);
/*!40000 ALTER TABLE `role` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `setting_other_cost`
--

DROP TABLE IF EXISTS `setting_other_cost`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `setting_other_cost` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `order` double(8,4) DEFAULT NULL,
  `flag_protected` tinyint(1) NOT NULL DEFAULT '0',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `setting_other_cost`
--

LOCK TABLES `setting_other_cost` WRITE;
/*!40000 ALTER TABLE `setting_other_cost` DISABLE KEYS */;
/*!40000 ALTER TABLE `setting_other_cost` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `setting_template`
--

DROP TABLE IF EXISTS `setting_template`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `setting_template` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `title` varchar(255) DEFAULT NULL,
  `type` enum('MESSAGE','Mail','NOTIFY','SITUATION') DEFAULT NULL,
  `content` varchar(255) DEFAULT NULL,
  `userUpdateId` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deletedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_setting_template_user` (`userUpdateId`),
  CONSTRAINT `fk_setting_template_user` FOREIGN KEY (`userUpdateId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `setting_template`
--

LOCK TABLES `setting_template` WRITE;
/*!40000 ALTER TABLE `setting_template` DISABLE KEYS */;
/*!40000 ALTER TABLE `setting_template` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `team_logs`
--

DROP TABLE IF EXISTS `team_logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `team_logs` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `projectId` int DEFAULT NULL,
  `errorMessage` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `team_logs`
--

LOCK TABLES `team_logs` WRITE;
/*!40000 ALTER TABLE `team_logs` DISABLE KEYS */;
/*!40000 ALTER TABLE `team_logs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_projects`
--

DROP TABLE IF EXISTS `user_projects`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_projects` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `userId` varchar(255) DEFAULT NULL,
  `projectId` bigint NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_projects`
--

LOCK TABLES `user_projects` WRITE;
/*!40000 ALTER TABLE `user_projects` DISABLE KEYS */;
INSERT INTO `user_projects` VALUES (1,'001',1,'2025-07-31 09:38:10','2025-07-31 09:38:10',NULL),(2,'user001',1,'2025-07-31 09:38:11','2025-07-31 09:38:11',NULL),(3,'user001',2,'2025-08-01 01:36:43','2025-08-01 01:36:43',NULL);
/*!40000 ALTER TABLE `user_projects` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_salaries`
--

DROP TABLE IF EXISTS `user_salaries`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_salaries` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `userId` varchar(255) NOT NULL,
  `salary` double NOT NULL,
  `year` int NOT NULL,
  `month` int NOT NULL,
  `date` datetime NOT NULL,
  `flag_protected` tinyint(1) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL,
  `bankId` varchar(255) DEFAULT NULL,
  `bankName` varchar(255) DEFAULT NULL,
  `type` enum('fulltimeC','fulltimeT','intern','parttime') DEFAULT NULL,
  `status` enum('Active','Disable','Inactive') DEFAULT NULL,
  `dependent` int DEFAULT NULL,
  `socialInsuranceSalary` double DEFAULT NULL,
  `paymentType` enum('ck','tm') DEFAULT NULL,
  `departmentId` varchar(255) DEFAULT NULL,
  `companyWillPayMoney` double DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_salaries`
--

LOCK TABLES `user_salaries` WRITE;
/*!40000 ALTER TABLE `user_salaries` DISABLE KEYS */;
/*!40000 ALTER TABLE `user_salaries` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` varchar(255) NOT NULL,
  `idGoogle` varchar(255) DEFAULT NULL,
  `lineId` bigint DEFAULT NULL,
  `jobRankId` int DEFAULT NULL,
  `departmentId` int DEFAULT NULL,
  `mail` varchar(255) NOT NULL,
  `displayName` varchar(255) NOT NULL,
  `givenName` varchar(255) DEFAULT NULL,
  `surName` varchar(255) DEFAULT NULL,
  `bankId` varchar(255) DEFAULT NULL,
  `bankName` varchar(255) DEFAULT NULL,
  `role` enum('admin','los','member') DEFAULT NULL,
  `roleId` int DEFAULT NULL,
  `status` enum('Active','Inactive','Deleted') NOT NULL,
  `username` varchar(255) DEFAULT NULL,
  `salaryDefault` double(17,2) NOT NULL,
  `flagOnsite` tinyint(1) NOT NULL,
  `note` text,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL,
  `employeeId` varchar(255) DEFAULT NULL,
  `dependent` int DEFAULT NULL,
  `socialInsuranceSalary` double DEFAULT NULL,
  `paymentType` enum('ck','tm') DEFAULT NULL,
  `type` enum('fulltimeC','fulltimeT','intern','parttime') DEFAULT NULL,
  `bankAccountHolder` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `idGoogle` (`idGoogle`),
  UNIQUE KEY `bankId` (`bankId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES ('001','100618858680111067561',1,NULL,1,'hieptv@ominext.com','Tạ','Hiệp','Hiệp Tạ',NULL,NULL,'los',3,'Active','hieptv',15000000.00,0,'Nhân viên phòng IT','2025-07-31 02:10:57','2025-07-31 09:03:08',NULL,'002',1,NULL,NULL,'fulltimeC',NULL),('user001','100618858680111067562',2,NULL,1,'haida@ominext.com','Dương','Anh Hải','Anh Hải Dương',NULL,NULL,'admin',2,'Active','haida',15000000.00,0,'Nhân viên phòng IT','2025-07-31 02:10:57','2025-07-31 09:02:53',NULL,'001',0,NULL,NULL,'fulltimeC',NULL);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-08-01 15:34:52
ALTER TABLE  `db_tool`.`setting_template` 
MODIFY COLUMN `content` LONGTEXT DEFAULT NULL;
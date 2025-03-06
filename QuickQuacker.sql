/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
select getdate();
CREATE TABLE `Users` (
  `First_Name` CHAR(35) NOT NULL DEFAULT '',
  `Last_Name` CHAR(35) NOT NULL DEFAULT '',
  `Email` CHAR(40) NOT NULL DEFAULT '',
  `SignUP` DATE NOT NULL DEFAULT '1000-01-01',
  `DOB` DATE NOT NULL DEFAULT '1000-01-01'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

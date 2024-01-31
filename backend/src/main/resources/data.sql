
INSERT INTO "tbluser" ("id", "activation_key", "activation_key_expires", "detail", "display_name", "first_name", "last_name", "password", "profile_picture", "role", "status", "username", "token_id") VALUES
	(1, NULL, NULL, '1', 'EDGE EDUCATION', 'EDGE', 'EDUCATION', '81dc9bdb52d04dc20036dbd8313ed055', NULL, 'TEACHER', 'PENDING', 'edge@gmail.com', NULL),
	(3, NULL, NULL, NULL, 'ridwanmonjur', 'John', 'Doe', '81dc9bdb52d04dc20036dbd8313ed055', NULL, 'STUDENT', 'PENDING', 'student@gmail.com', NULL),
	(5, NULL, NULL, '1', 'PARENT', 'PARENT', 'PARENT', '81dc9bdb52d04dc20036dbd8313ed055', NULL, 'PARENT', 'PENDING', 'parent@gmail.com', NULL),
	(7, NULL, NULL, '1', 'BACKOFFICEUPLOADER', 'BACKOFFICEUPLOADER', 'BACKOFFICEUPLOADER', '81dc9bdb52d04dc20036dbd8313ed055', NULL, 'BACKOFFICEUPLOADER', 'PENDING', 'uploader@gmail.com', NULL),
	(9, NULL, NULL, '1', 'BACKOFFICEREVIEWER', 'BACKOFFICEREVIEWER', 'BACKOFFICEREVIEWER', '81dc9bdb52d04dc20036dbd8313ed055', NULL, 'BACKOFFICEREVIEWER', 'PENDING', 'reviewer@gmail.com', NULL);

-- Dumping data for table public.tblstudent: 1 rows
/*!40000 ALTER TABLE "tblstudent" DISABLE KEYS */;
INSERT INTO "tblstudent" ("id", "parent_id", "roll_number", "teacher_id", "user_id") VALUES
	(4, 6, 45, 2, 3);
/*!40000 ALTER TABLE "tblstudent" ENABLE KEYS */;

-- Dumping data for table public.tblsubject: 2 rows
/*!40000 ALTER TABLE "tblsubject" DISABLE KEYS */;

-- Dumping data for table public.tblsubscription: 0 rows
/*!40000 ALTER TABLE "tblsubscription" DISABLE KEYS */;
/*!40000 ALTER TABLE "tblsubscription" ENABLE KEYS */;

-- Dumping data for table public.tblteacher: 1 rows
/*!40000 ALTER TABLE "tblteacher" DISABLE KEYS */;
INSERT INTO "tblteacher" ("id", "user_id") VALUES
	(332, 1);
/*!40000 ALTER TABLE "tblteacher" ENABLE KEYS */;
INSERT INTO "tblparent" ("id", "user_id") VALUES
	(6, 5);
-- Dumping data for table public.tbltoken: 1 rows
/*!40000 ALTER TABLE "tbltoken" DISABLE KEYS */;
INSERT INTO "tbltoken" ("id", "access_token", "gapi_access_token", "gapi_refresh_token", "refresh_token") VALUES
	(11, NULL, 'ya29.a0AfB_byDWqQHrxC2itKS0pE2nFeAXJ_zQVVqe1qIQxMQCh27LtkjYflLuD578Od-y6lqsOC6i_igD6GzT9MWP4fU1rUEYehxuE-q9wX8QncQG9cSCOjKNhxDn-8ZCjbhy1S0J5-0MtAvuEjrMVEYizuWxCDEPVkX_Wnk4aCgYKAQ0SARASFQGOcNnCdW4YTvN29l5wpGsIlcDoyw0171', '1//0g1lCp5AlfLKYCgYIARAAGBASNwF-L9IrcVgWjOYFx77F7Y7GQS1JXP2ikYl7L5isXzzElUSk02URHQQCNhEFkrb-lHAUyx9u850', NULL);

INSERT INTO "tblbackofficereviewer" ("id", "teacher_id", "user_id") VALUES
	(10, 332, 9);
/*!40000 ALTER TABLE "tblbackofficereviewer" ENABLE KEYS */;

-- Dumping data for table public.tblbackofficeuploader: 1 rows
/*!40000 ALTER TABLE "tblbackofficeuploader" DISABLE KEYS */;
INSERT INTO "tblbackofficeuploader" ("id", "teacher_id", "user_id") VALUES
	(8, 332, 7);
/*!40000 ALTER TABLE "tblbackofficeuploader" ENABLE KEYS */;

-- Dumping data for table public.tblexam: 2 rows
/*!40000 ALTER TABLE "tblexam" DISABLE KEYS */;
INSERT INTO "tblexam" ("id", "description", "title") VALUES
	(1, 'NAPLAN', 'NAPLAN'),
	(2, 'Selective', 'Selective');

INSERT INTO "tblsubject" ("id", "description", "title", "exam_id", "teacher_id") VALUES
	(2, 'Subject', 'Thinking Skills', 1, 332),
	(1, 'Subject', 'Maths', 1, 332);
/*!40000 ALTER TABLE "tblsubject" ENABLE KEYS */;
INSERT INTO "tbltopic" ("id", "description", "title", "exam_id", "subject_id") VALUES
	(1, 'Deduction', 'Deduction', 1, 2),
	(2, 'Analytical', 'Analytical', 1, 2),
	(3, 'Algebra', 'Algebra', 1, 1),
	(4, 'Set Theory', 'Set Theory', 1, 1);
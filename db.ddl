-- public.courses definition

-- Drop table

-- DROP TABLE public.courses;

CREATE TABLE public.courses (
	id serial4 NOT NULL,
	course_name varchar(255) NOT NULL,
	course_code varchar(50) NOT NULL,
	department varchar(100) NULL,
	instructor varchar(255) NULL,
	start_date date NULL,
	end_date date NULL,
	created_at timestamp NULL DEFAULT now(),
	updated_at timestamp NULL DEFAULT now(),
	description text NULL,
	"level" varchar(10) NULL,
	CONSTRAINT courses_course_code_key UNIQUE (course_code),
	CONSTRAINT courses_pkey PRIMARY KEY (id)
);


-- public.users definition

-- Drop table

-- DROP TABLE public.users;

CREATE TABLE public.users (
	user_id serial4 NOT NULL,
	first_name varchar(50) NULL,
	last_name varchar(50) NULL,
	email varchar(100) NULL,
	"password" varchar(100) NULL,
	gender varchar(10) NULL,
	birth_date date NULL,
	admission_date date NULL,
	major varchar(50) NULL,
	grade varchar(50) NULL,
	address varchar(100) NULL,
	photo bytea NULL,
	CONSTRAINT users_pkey PRIMARY KEY (user_id)
);


-- public.assessments definition

-- Drop table

-- DROP TABLE public.assessments;

CREATE TABLE public.assessments (
	id serial4 NOT NULL,
	course_id int4 NOT NULL,
	title varchar(255) NOT NULL,
	"type" varchar(255) NOT NULL,
	"date" date NOT NULL,
	duration_minutes int4 NOT NULL,
	assessment_weight numeric(5, 2) NULL,
	CONSTRAINT assessments_pkey PRIMARY KEY (id),
	CONSTRAINT assessments_course_id_fkey FOREIGN KEY (course_id) REFERENCES public.courses(id) ON DELETE CASCADE
);


-- public.assignments definition

-- Drop table

-- DROP TABLE public.assignments;

CREATE TABLE public.assignments (
	id serial4 NOT NULL,
	course_id int4 NOT NULL,
	title varchar(255) NOT NULL,
	description text NOT NULL,
	due_date date NOT NULL,
	max_score int4 NOT NULL,
	link varchar(255) NOT NULL,
	CONSTRAINT assignments_pkey PRIMARY KEY (id),
	CONSTRAINT assignments_course_id_fkey FOREIGN KEY (course_id) REFERENCES public.courses(id) ON DELETE CASCADE
);


-- public.enrollments definition

-- Drop table

-- DROP TABLE public.enrollments;

CREATE TABLE public.enrollments (
	id serial4 NOT NULL,
	course_id int4 NOT NULL,
	user_id int4 NOT NULL,
	CONSTRAINT enrollments_pkey PRIMARY KEY (id),
	CONSTRAINT enrollments_course_id_fkey FOREIGN KEY (course_id) REFERENCES public.courses(id) ON DELETE CASCADE,
	CONSTRAINT enrollments_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE CASCADE
);


-- public.exams definition

-- Drop table

-- DROP TABLE public.exams;

CREATE TABLE public.exams (
	id serial4 NOT NULL,
	course_id serial4 NOT NULL,
	title varchar(255) NOT NULL,
	"date" date NOT NULL,
	exam_time time NULL,
	duration_minutes int4 NOT NULL,
	link varchar(255) NOT NULL,
	CONSTRAINT exams_pkey PRIMARY KEY (id),
	CONSTRAINT exams_course_id_fkey FOREIGN KEY (course_id) REFERENCES public.courses(id) ON DELETE CASCADE
);


-- public.assignment_progress definition

-- Drop table

-- DROP TABLE public.assignment_progress;

CREATE TABLE public.assignment_progress (
	id serial4 NOT NULL,
	user_id int4 NULL,
	assignment_id int4 NULL,
	progress int4 NULL,
	completed bool NULL,
	date_completed timestamp NULL,
	CONSTRAINT assignment_progress_pkey PRIMARY KEY (id),
	CONSTRAINT assignment_progress_assignment_id_fkey FOREIGN KEY (assignment_id) REFERENCES public.assignments(id),
	CONSTRAINT assignment_progress_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id)
);
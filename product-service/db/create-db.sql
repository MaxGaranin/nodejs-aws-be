create extension if not exists "uuid-ossp";

create table products (
	id uuid primary key default uuid_generate_v4(),
	title text not null,
	description text,
	author text,
	image text,
	price real
);

create table stocks (
	product_id uuid,
	count integer,
	foreign key (product_id) references products(id) on delete cascade
);

insert into products (id, title, description, author, image, price) values
	('25f87050-dea3-4db7-9381-9b66a0cd51c4', 'Рефакторинг. Улучшение проекта существующего кода', 'Классическая книга про практикам программирования от Мартина Фаулера', 'Фаулер Мартин', 'https://cdn1.ozone.ru/multimedia/1019869511.jpg', 2180.4),
	('9137d163-a173-4bc2-9dc7-d2df27ea3b7b', 'Чистый код. Создание анализ и рефакторинг', 'Тоже классика разработки от дядюшки Боба Мартина', 'Мартин Роберт', 'https://cdn1.ozone.ru/multimedia/1026061260.jpg', 504),
	('75d4707a-1c37-49e9-b531-e3967f66ba10', 'Высоконагруженные приложения. Программирование масштабирование поддержка', 'Книга по разработке высоконагруженных систем', 'Клеппман Мартин', 'https://cdn1.ozone.ru/s3/multimedia-r/6007449903.jpg', 1576),
	('6a983db2-96cb-4581-ab39-2e1b0a233d49', 'Kubernetes в действии', 'Система контейнерной оркестровки Kubernetes', 'Лукша Марко', 'https://cdn1.ozone.ru/multimedia/1026091236.jpg', 1871),
	('0cc51f32-9e97-4fd5-866a-7bdb2d011ba3', 'Стратегии решения математических задач. Различные подходы к типовым задачам', 'В этой книге рассказывается о десяти различных стратегиях решения задач', 'Крутик Стивен', 'https://cdn1.ozone.ru/multimedia/1022149198.jpg', 344),	
	('5041bb4e-44c2-46a2-9509-b83e23a5fd70', 'Выразительный JavaScript. Современное веб-программирование', 'Получайте опыт и изучайте язык на множестве примеров, выполняя упражнения и учебные проекты', 'Хавербеке Марейн', 'https://cdn1.ozone.ru/s3/multimedia-t/6000018281.jpg', 1169),
	('285bd041-8c39-478c-a40b-5e53685937bb', 'Код. Тайный язык информатики', 'Эта книга — азбука компьютерных технологий', 'Петцольд Чарльз', 'https://cdn1.ozone.ru/multimedia/1004493926.jpg', 184.9),
	('a499223f-3b7a-4249-abbb-10b1c8a6848f', 'Дизайн и эволюция С++', 'В книге, написанной создателем языка С++ Бьерпом Страуструпом, представлено описание процесса проектирования и разработки языка программирования С++', 'Страуструп Бьерн', 'https://cdn1.ozone.ru/multimedia/1014964320.jpg', 815);

insert into stocks (product_id, count) values
	('25f87050-dea3-4db7-9381-9b66a0cd51c4', 5),
	('9137d163-a173-4bc2-9dc7-d2df27ea3b7b', 7),
	('75d4707a-1c37-49e9-b531-e3967f66ba10', 1),
	('6a983db2-96cb-4581-ab39-2e1b0a233d49', 23),
	('0cc51f32-9e97-4fd5-866a-7bdb2d011ba3', 10),	
	('5041bb4e-44c2-46a2-9509-b83e23a5fd70', 15),
	('285bd041-8c39-478c-a40b-5e53685937bb', 0),
	('a499223f-3b7a-4249-abbb-10b1c8a6848f', 3);
	
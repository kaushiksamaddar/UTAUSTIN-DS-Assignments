USE sakila;

-- 1a. Display the first and last names of all the actors from the table actor. 
SELECT first_name, last_name from actor;

-- 1b. Display the first and last name of each actor in a single column in upper case letters. Name the column Actor Name
SELECT CONCAT(first_name, '  ', last_name) as 'ACTOR NAME' from ACTOR;

-- 2a. You need to find the ID number, first name, and last name of an actor, of whom you know only the first name, "Joe." What is one query would you use to obtain this information?
SELECT actor_id as ID, first_name, last_name FROM actor WHERE first_name = 'Joe';

-- 2b. Find all actors whose last name contain the letters GEN:
SELECT * FROM actor WHERE last_name LIKE '%GEN%';

-- 2c. Find all actors whose last names contain the letters LI. This time, order the rows by last name and first name, in that order:
SELECT * FROM actor WHERE last_name LIKE '%LI%' order by last_name, first_name;

-- 2d. Using IN, display the country_id and country columns of the following countries: Afghanistan, Bangladesh, and China:
SELECT country_id, country FROM country where country in ('Afghanistan', 'Bangladesh', 'China');

-- 3a. You want to keep a description of each actor. You don't think you will be performing queries on a description, so create a column in the table actor named description and use the data type BLOB (Make sure to research the type BLOB, as the difference between it and VARCHAR are significant).
ALTER TABLE country ADD COLUMN description BLOB NULL AFTER country;

-- 3b. Very quickly you realize that entering descriptions for each actor is too much effort. Delete the description column.
ALTER TABLE country DROP COLUMN description;

-- 4a. List the last names of actors, as well as how many actors have that last name.
SELECT DISTINCT last_name, count(last_name) AS 'No. of actors' FROM actor GROUP BY (last_name);

-- 4b. List last names of actors and the number of actors who have that last name, but only for names that are shared by at least two actors
SELECT DISTINCT last_name, count(last_name) AS 'No. of actors' FROM actor GROUP BY (last_name)  HAVING count(last_name) >=2; 

-- 4c. The actor HARPO WILLIAMS was accidentally entered in the actor table as GROUCHO WILLIAMS. Write a query to fix the record.
UPDATE ACTOR SET first_name = 'HARPO'  WHERE first_name = 'GROUCHO'  AND last_name = 'WILLIAMS';

-- 4d. Perhaps we were too hasty in changing GROUCHO to HARPO. It turns out that GROUCHO was the correct name after all! In a single query, if the first name of the actor is currently HARPO, change it to GROUCHO.
UPDATE ACTOR SET first_name = 'GROUCHO'  WHERE first_name = 'HARPO'  AND last_name = 'WILLIAMS';

-- 5a. You cannot locate the schema of the address table. Which query would you use to re-create it?
SHOW CREATE TABLE address;
-- Hint: https://dev.mysql.com/doc/refman/5.7/en/show-create-table.html

-- 6a. Use JOIN to display the first and last names, as well as the address, of each staff member. Use the tables staff and address:
SELECT s.first_name, s.last_name, a.address FROM address a INNER JOIN staff s on a.address_id = s.address_id; 

-- 6b. Use JOIN to display the total amount rung up by each staff member in August of 2005. Use tables staff and payment.
SELECT s.staff_id, SUM(p.amount) FROM staff s INNER JOIN payment p on s.staff_id=p.staff_id WHERE YEAR(p.payment_date) = 2005 and MONTH(p.payment_date) = 05 GROUP BY s.staff_id;

-- 6c. List each film and the number of actors who are listed for that film. Use tables film_actor and film. Use inner join.
SELECT f.title, count(a.actor_id) FROM film f INNER JOIN film_actor a on f.film_id = a.film_id GROUP BY f.film_id;

-- 6d. How many copies of the film Hunchback Impossible exist in the inventory system?
SELECT f.title, count(inv.store_id) FROM film f INNER JOIN inventory inv on f.film_id = inv.film_id WHERE UPPER(f.title) = 'HUNCHBACK IMPOSSIBLE' GROUP BY f.film_id;

-- 6e. Using the tables payment and customer and the JOIN command, list the total paid by each customer. List the customers alphabetically by last name:
SELECT CONCAT(c.first_name, ' ', last_name) as 'Customer', SUM(p.amount) as 'Total Paid' FROM customer c INNER JOIN payment p on c.customer_id = p.customer_id 
GROUP BY (c.customer_id) ORDER BY c.last_name;

-- 7a. The music of Queen and Kris Kristofferson have seen an unlikely resurgence. As an unintended consequence, films starting with the letters K and Q have also soared in popularity. 
-- Use subqueries to display the titles of movies starting with the letters K and Q whose language is English.

SELECT title as 'Movie' from film where language_id = 
(
	SELECT language_id from language where name = 'English'
)
and (title LIKE 'K%' OR title LIKE 'Q%')
;

-- 7b. Use subqueries to display all actors who appear in the film Alone Trip.

SELECT CONCAT(a.first_name, ' ', a.last_name) as 'Actors' FROM actor a WHERE a.actor_id IN
(
	SELECT actor_id FROM film_actor WHERE film_id = 
    (
		SELECT film_id FROM film where title = 'Alone Trip'
    )
);



-- 7c. You want to run an email marketing campaign in Canada, for which you will need the names and email addresses of all Canadian customers. Use joins to retrieve this information.
SELECT CONCAT(c.first_name, ' ', c.last_name) as 'Customer', c.email FROM customer c INNER JOIN address ad ON c.address_id = ad.address_id 
INNER JOIN city ON ad.city_id = city.city_id INNER JOIN country ctr ON city.country_id = ctr.country_id WHERE ctr.country = 'CANADA';

-- 7d. Sales have been lagging among young families, and you wish to target all family movies for a promotion. Identify all movies categorized as family films.
SELECT title FROM film WHERE film_id IN 
(
	SELECT film_id FROM film_category WHERE category_id IN
    (
			SELECT category_id FROM category WHERE name = 'Family' 
	)
);

-- 7e. Display the most frequently rented movies in descending order.

SELECT f.title, COUNT(r.rental_id) as 'frequencey' FROM rental r INNER JOIN inventory inv ON r.inventory_id = inv.inventory_id INNER JOIN film f ON inv.film_id = f.film_id
GROUP BY inv.inventory_id ORDER by COUNT(r.rental_id) DESC, f.title DESC;

-- 7f. Write a query to display how much business, in dollars, each store brought in.
SELECT store.store_id AS 'Store', SUM(payment.amount) AS 'Total Business ($)' FROM payment INNER JOIN store ON payment.staff_id = store.manager_staff_id GROUP BY payment.staff_id;

-- 7g. Write a query to display for each store its store ID, city, and country.
SELECT  store.store_id, city.city, country.country FROM store, address, city, country where store.address_id = address.address_id 
and address.city_id = city.city_id and city.country_id = country.country_id;

-- 7h. List the top five genres in gross revenue in descending order. (Hint: you may need to use the following tables: category, film_category, inventory, payment, and rental.)
/**
The query ensued is equivalent to the following. This is created as a cross reference to the amount that we receive. The query as ensued is created on Sports Category with id = 15.
=======================================================================================================================================
SELECT SUM(amount) FROM sakila.payment where rental_id in (SELECT rental_id FROM rental where inventory_id in 
(SELECT inventory_id FROM sakila.inventory where film_id in (SELECT film_id FROM sakila.film_category where category_id = 15)));
=======================================================================================================================================
This query returns 5314.21 which is the same as that we receive on executing the main query.
*/
SELECT category.name as 'Genre', SUM(payment.amount) 
FROM payment 
INNER JOIN rental ON payment.rental_id = rental.rental_id
INNER JOIN inventory ON inventory.inventory_id = rental.inventory_id
INNER JOIN film_category fc ON fc.film_id = inventory.film_id
INNER JOIN category ON category.category_id = fc.category_id
GROUP BY category.name
ORDER BY SUM(payment.amount) DESC
LIMIT 5
;


-- 8a. In your new role as an executive, you would like to have an easy way of viewing the Top five genres by gross revenue. 
-- Use the solution from the problem above to create a view. If you haven't solved 7h, you can substitute another query to create a view.

CREATE VIEW top_five_genre AS
(
	SELECT category.name as 'Genre', SUM(payment.amount) 
FROM payment 
INNER JOIN rental ON payment.rental_id = rental.rental_id
INNER JOIN inventory ON inventory.inventory_id = rental.inventory_id
INNER JOIN film_category fc ON fc.film_id = inventory.film_id
INNER JOIN category ON category.category_id = fc.category_id
GROUP BY category.name
ORDER BY SUM(payment.amount) DESC
LIMIT 5
)
;

-- 8b. How would you display the view that you created in 8a?
SELECT * FROM sakila.top_five_genre;

-- 8c. You find that you no longer need the view top_five_genres. Write a query to delete it.
DROP VIEW sakila.top_five_genre;







# Specifications
The CS340 Project that you will submit at the end of this course should satisfy all these specifications:

Your database should be pre-populated with sample data. At least three rows per table is expected. The sample data should illustrate a table's functionality, e.g. if the table is part of a many-to-many relationship, the sample data should depict M:M.

Your database should have at least 4 entities and at least 4 relationships, identify two of which must be a many-to-many relationship, you will implement one M:M relationship in Project Step 7.  The entities and relationships should implement the operational requirements of your project.

Every table should be used in at least one SELECT query. For the SELECT queries, it is fine to just display the content of the tables, but your website needs to also have the ability to search using text or filter using a dynamically populated list of properties. This search/filter functionality should be present for at least one entity. It is generally not appropriate to have only a single query that joins all tables and displays them.

You need to include one DELETE and one UPDATE function in your website, for any one of the entities. In addition, it should be possible to add and remove things from at least one many-to-many relationship and it should be possible to add things to all relationships. This means you need INSERT functionality for all relationships as well as entities. And DELETE for at least one many-to-many relationship.

In a one-to-many relationship (like bsg_people to bsg_planets), you should be able to set the foreign key value to NULL (such as on a person in bsg_people), that removes the relationship. In case none of the one-to-many relationships in your database has partial participation, you would need to change that to make sure they can have NULL values.

In a many-to-many relationship, to remove a relationship one would need to delete a row from a table. That would be the case with bsg_people and bsg_certifications. One should be able to add and remove certifications for a person without deleting either bsg_people rows or bsg_certification rows. If you implement DELETE functionality on at least (1) many-to-many relationship table, such that the rows in the relevant entity tables are not impacted, that is sufficient.
 

# General Rules and Grading
Can be developed using any technology platform which serves content over the web.

Should use MySQL/MariaDB as the database back end.

You should write all the queries and not depend on an ORM or similar mechanism to generate any queries.

You can host it anywhere as long as it is accessible to the graders.

Apart from Step 0 (see table below), you are required to work on the Project Steps in a Project Group of two students. By the end of Week 1, you are required to submit the names of your team members. It’s recommended that you have a set weekly meeting time to check on the progress and also use tools like version control to keep in sync. You can change groups at most 1 time through the quarter, and then only if you find someone else ready to swap groups.

Please note that the CS340 database created for you will be deleted from the server at the end of the term.

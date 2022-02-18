INSERT INTO department (name)
VALUES ("Sales"),
       ("Engineering"),
       ("Finance"),
       ("Legal");

INSERT INTO role (title, salary, department_id)
VALUES ("Sales Person", 80000, 1),
       ("Lead Engineer", 250000, 2),
       ("Software Engineer", 120000, 2),
       ("Account Manager", 160000, 3),
       ("Accountant", 125000, 3),
       ("Legal Team Lead", 250000, 4),
       ("Lawyer", 190000, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Paul", "Rudd", 1, NULL),
       ("Seth", "Rogen", 2, NULL),
       ("Jason", "Statham", 3, NULL),
       ("Craig", "Robertson", 4, 1),
       ("Bruce", "Willis", 5, NULL),
       ("Jim", "Carey", 6, NULL),
       ("Adam", "Sandler", 7, NULL),
       ("Morgan", "Freeman", 8, NULL);
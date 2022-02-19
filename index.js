const inquirer = require("inquirer");
const mysql = require("mysql2");
require("dotenv").config();
const cTable = require("console.table");

const connection = mysql.createConnection(
    {
        host: 'localhost',
        user: process.env.USER_DB,
        password: process.env.PASSWORD_DB,
        database: process.env.NAME_DB
    },
    console.log(`Connected to the company_db database.`)
);

const init = () => {
    return inquirer
        .prompt([
            {
                type: "list",
                name: "menu",
                message: "Choose an option!",
                choices: ["View All Departments", "View All Roles", "View All Employees",
                "Add a Department", "Add a Role", "Add an Employee", "Update an Employee Role", "[Quit]"]
            },
        ])
        .then((data) => {
            const role = data.menu;
            if (role === "View All Departments") {
                return viewAllDepartments();
            } else if (role === "View All Roles") {
                return viewAllRoles();
            } else if (role === "View All Employees") {
                return viewAllEmployees();
            } else if (role === "Add a Department") {
                return departmentQ(); 
            } else if (role === "Add a Role") {
                return addRoleQ();
            } else if (role === "Add an Employee") {
                return addEmployeeQ();
            } else if (role === "Update an Employee Role") {
                return updateEmployeeQ();
            } else if (role === '[Quit]') {
                return quitApp();
            }
        });
};

const viewAllDepartments = () => {
    const sql = `SELECT department.id,
    department.name AS department
    FROM department;`;
    connection.query(sql, (err, rows) => {
        if (err) {
            console.log(err);
        } else {
            console.table(rows);
            init();
        }
    });
};

const viewAllRoles = () => {
    const sql = `SELECT * FROM role;`;
    connection.query(sql, (err, rows) => {
        if (err) {
            console.log(err);
        } else {
            console.table(rows);
            init();
        }
    });
};

const viewAllEmployees = () => {
    const sql = `SELECT employee.id, 
    CONCAT (employee.first_name, " ", employee.last_name) AS name,
    role.title, 
    department.name AS department,
    role.salary, 
    CONCAT (manager.first_name, " ", manager.last_name) AS manager
    FROM employee
    LEFT JOIN role ON employee.role_id = role.id
    LEFT JOIN department ON role.department_id = department.id
    LEFT JOIN employee manager ON employee.manager_id = manager.id`;
    connection.query(sql, (err, rows) => {
        if (err) {
            console.log(err);
        } else {
            console.table(rows);
            init();
        }
    });
};

const addADepartment = (newDepartment) => {
    const sql = `INSERT INTO department (name) VALUES ("${newDepartment}");`;
    connection.query(sql, (err, rows) => {
        if (err) {
            console.log(err);
        } else {
            console.table(rows);
            console.log(`New department ${newDepartment} created!`)
            init();
        }
    });
};

const addARole = (title, salary, department_id) => {
    const sql = `INSERT INTO role (title, salary, department_id)
    VALUES ("${title}", ${salary}, ${department_id});`;
    connection.query(sql, (err, rows) => {
        if (err) {
            console.log(err);
        } else {
            console.table(rows);
            console.log(`New role ${title} created!`);
            init();
        }
    });
};

const addAnEmployee = (first_name, last_name, role_id, manager_id) => {
    const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id)
    VALUES ("${first_name}", "${last_name}", ${role_id}, ${manager_id});`;
    connection.query(sql, (err, rows) => {
        if (err) {
            console.log(err);
        } else {
            console.table(rows);
            console.log(`New employee ${first_name} created!`);
            init();
        }
    });
};

// Should they all be prepared statements????                                  ????  ???? ????
const updateEmployeeRole = (changeProperty, newValue, id) => {
    const sql = `UPDATE employee SET ? = ? WHERE id = ?;`;
    connection.query(sql, changeProperty, newValue, id, (err, rows) => {
        if (err) {
            console.log(err);
        } else {
            console.table(rows);
            console.log(`Employee ${id} updated!`);
            init();
        }
    });
};

const quitApp = () => {
    if (err) {
        console.log(err);
    } else {
        return console.log("Goodbye!");
    }
};

const departmentQ = () => {
    return inquirer
        .prompt([
            {
                type: "input",
                name: "departmentName",
                message: "What do you want to name your new department?",
            },
        ]).then((data) => {
            const departmentName = data.name;
            addADepartment(departmentName);
        });
};

const addRoleQ = () => {
    return inquirer
        .prompt([
            {
                type: "input",
                name: "title",
                message: "What is the title of the new role?",
            },
            {
                type: "input",
                name: "salary",
                message: "What is the salaray of the role?",
            },
            {
                type: "input",
                name: "department_id",
                message: "What is the department id?",
            }
        ]).then((data) => {
            const { title, salary, department_id } = data;
            addARole(title, salary, department_id);
        });
};

const addEmployeeQ = () => {
    return inquirer
        .prompt([
            {
                type: "input",
                name: "firstname",
                message: "What is the first name of the new Employee?",
            },
            {
                type: "input",
                name: "lastname",
                message: "What is the last name of the new Employee?",
            },
            {
                type: "input",
                name: "roleid",
                message: "What is the role id?",
            },
            {
                type: "input",
                name: "managerid",
                message: "What is the managers id?",
            },
        ]).then((data) => {
            const { first_name, last_name, role_id, manager_id } = data;
            addAnEmployee(first_name, last_name, role_id, manager_id);
        });
};

const updateEmployeeQ = () => {
    return inquirer
        .prompt([
            {
                type: "input",
                name: "changeproperty",
                message: "What row/property do you want to change?",
            },
            {
                type: "input",
                name: "newvalue",
                message: "What do you want to change the value to?",
            },
            {
                type: "input",
                name: "employeeid",
                message: "What is the employee's id that you want to update?",
            },
        ]).then((data) => {
            const { changeProperty, newValue, id } = data;
            updateEmployeeRole(changeProperty, newValue, id);
        });
};

init();
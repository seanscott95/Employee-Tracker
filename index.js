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
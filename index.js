const inquirer = require("inquirer");
const mysql = require("mysql2");
require("dotenv").configure();
const cTable = require("console.table");

const connection = await mysql.createConnection(
    {
        host: 'localhost',
        user: process.env.USER_DB,
        password: process.env.PASSWORD_DB,
        database: process.env.NAME_DB
    },
    console.log(`Connected to the company_db database.`)
);

const qMenu = () => {
    return inquirer
        .prompt([
            {
                type: "list",
                name: "menu",
                message: "Click",
                choices: ["View All Departments", "View All Roles", "View All Employees",
                "Add a Department", "Add a Role", "Add an Employee", "Update an Employee Role", "[Quit]"]
            },
        ])
        .then((data) => {
            const role = data.role;
            if (role === "View All Departments") {
                return viewAllDepartments();
            } else if (role === "View All Roles") {
                return viewAllRoles();
            } else if (role === "View All Employees") {
                return viewAllEmployees();
            } else if (role === "Add a Department") {
                return addADepartment(); 
            } else if (role === "Add a Role") {
                return addARole();
            } else if (role === "Add an Employee") {
                return addAnEmployee();
            } else if (role === "Update an Employee Role") {
                return updateEmployeeRole();
            } else if (role === '[Quit]') {
                return quitApp();
            }
        });
};

const viewAllDepartments = () => {
    const sql = `SELECT * FROM department`;
    connection.query(sql, (err, rows) => {
        if (err) {
            console.log(err);
        } else {
            console.table(rows);
            init();
        }
    });
};
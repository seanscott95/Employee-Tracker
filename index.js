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
    return inquirer.prompt([
        {
            type: "list",
            name: "menu",
            message: "Choose an option!",
            choices: ["View All Departments", "View All Roles", "View All Employees",
                "Add a Department", "Add a Role", "Add an Employee", "Update an Employee Role",
                "Update Employee Managers", "View Employees By Manager", 
                "View Employees by Department", "Delete Department", "Delete Role",
                "Delete Employee", "View the Total Utilized Budget of a Department", "[Quit]"]
        },
    ]).then((data) => {
        const role = data.menu;
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
            return updateAnEmployee();
        } else if (role === "Update Employee Managers") {
            return updateEmployeeManagers();
        } else if (role === "View Employees By Manager") {
            return viewEmployeeByManager();
        } else if (role === "View Employees by Department") {
            return viewEmployeeByDepartment();
        } else if (role === "View the Total Utilized Budget of a Department") {
            return viewDepartmentUtilBudget();
        } else if (role === "Delete Department") {
            return deleteDepartment();
        } else if (role === "Delete Role") {
            return deleteRole();
        } else if (role === "Delete Employee") {
            return deleteEmployee();
        } else if (role === '[Quit]') {
            return connection.end();
        };
    });
};

//
const viewAllDepartments = () => {
    const sql = `SELECT department.id AS ID,
    department.name AS Department
    FROM department;`;
    connection.query(sql, (err, data) => {
        if (err) throw err;
        console.table(data);
        init();
    });
};

//
const viewAllRoles = () => {
    const sql = `SELECT role.id AS ID,
    role.title AS Title
    FROM role;`;
    connection.query(sql, (err, data) => {
        if (err) throw err;
        console.table(data);
        init();
    });
};

//
const viewAllEmployees = () => {
    const sql = `SELECT employee.id AS ID, 
    CONCAT (employee.first_name, " ", employee.last_name) AS Name,
    role.title AS Title, 
    department.name AS Department,
    role.salary AS Salary, 
    CONCAT (manager.first_name, " ", manager.last_name) AS Manager
    FROM employee
    LEFT JOIN role ON employee.role_id = role.id
    LEFT JOIN department ON role.department_id = department.id
    LEFT JOIN employee manager ON employee.manager_id = manager.id;`;
    connection.query(sql, (err, data) => {
        if (err) throw err;
        console.table(data);
        init();
    });
};

//
const addADepartment = () => {
    inquirer.prompt([
        {
            type: "input",
            name: "name",
            message: "What do you want to name your new department?",
            validate: input => {
                if (input) {
                    return true;
                } else {
                    console.log("Please enter a new department name.");
                    return false;
                }
            }
        }
    ]).then((data) => {
        const departmentName = data.name;
        const sql = `INSERT INTO department (name) VALUES (?);`;
        // const
        connection.query(sql, departmentName, (err, data) => {
            if (err) throw err;
            console.log(`New department created!`);
            viewAllDepartments();
        });
    });
};

//
const addARole = () => {
    inquirer.prompt([
        {
            type: "input",
            name: "title",
            message: "What is the title of the new role?",
            validate: input => {
                if (input) {
                    return true;
                } else {
                    console.log("Please enter a new role title.");
                    return false;
                }
            }
        },
        {
            type: "input",
            name: "salary",
            message: "What is the salaray of the role?",
            validate:  input => {
                if ((input)) {
                    if (isNaN(input)) {
                        console.log("Please enter a number for the salary")
                        return false
                    } else {
                        return true;
                    }
                } else {
                    console.log("Please enter a salary.");
                    return false;
                }
            }
        }
    ]).then((data) => {
        const params = [data.title, data.salary, data.departmentid];
        const roleSql = `SELECT name, id FROM department`;
        connection.query(roleSql, (err, data) => {     // ??? promise
            if (err) throw err;
            const department = data.map(({ title, id }) => ({ name: title, value: id }));

            inquirer.prompt([
                {
                    type: "list",
                    name: "departmentid",
                    message: "What department does the role belong to?",
                    choices: department
                }
            ]).then((data) => {
                const departmentId = data.departmentid;
                params.push(departmentId);
                    
                const sql = `INSERT INTO role (title, salary, department_id)
                VALUES (?, ?, ?)`;
                connection.query(sql, params, (err, rows) => {
                    if (err) throw err;
                    console.log(`New role created!`);
                    viewAllRoles();
                });
            });
        });
    });
};

//
const addAnEmployee = () => {
    inquirer.prompt([
        {
            type: "input",
            name: "firstname",
            message: "What is the first name of the new Employee?",
            validate:  input => {
                if (input) {
                    return true;
                } else {
                    console.log("Please enter the first name of the new Employee.");
                    return false;
                }
            }
        },
        {
            type: "input",
            name: "lastname",
            message: "What is the last name of the new Employee?",
            validate: input => {
                if (input) {
                    return true;
                } else {
                    console.log("Please enter the last name of the new Employee.");
                    return false;
                }
            }
        },
    ]).then((data) => {
        const params = [data.firstname, data.lastname];
        const roleSql = `SELECT * FROM role`;
        connection.query(roleSql, (err, data) => {
            if (err) throw err;
            const roles = data.map(({ title, id }) => ({ name: title, value: id }));
            inquirer.prompt([
                {
                    type: "list",
                    name: "roleid",
                    message: "What is the role of the new employee?",
                    choices: roles
                }
            ]).then((data) => {
                const role = data.roleid;
                params.push(role);

                const managerSql = `SELECT e.manager_id, CONCAT(m.first_name, ' ', m.last_name) 
                AS manager 
                FROM employee e 
                LEFT JOIN role r
                ON e.role_id = r.id
                LEFT JOIN employee m
                ON m.id = e.manager_id GROUP BY e.manager_id`;
                //????
                connection.query(managerSql, (err, data) => {
                    if (err) throw err;
                    // ????
                    const manager = data.map(({ manager, manager_id  }) => ({ 
                        name: manager,
                        value: manager_id,
                    }));
                    inquirer.prompt([
                        {
                            type: "input",
                            name: "managerid",
                            message: "What is the managers id?",
                            choice: manager
                        }
                    ]).then((data) => {
                        const managerId = data.managerid
                        params.push(managerId);

                        const sql = `INSERT INTO employee (first_name, last_name, role_id, 
                        manager_id)
                        VALUES (? ? ? ?)`;
                        connection.query(sql, params, (err, rows) => {
                            if (err) throw err;
                            console.log(`New employee created!`);
                            viewAllEmployees();
                        });
                    });
                });
            });
        });
    });
};

//
const updateAnEmployee = () => { 
    const employeesSql = `SELECT * FROM employee`; 
    connection.query(employeesSql, (err, data) => {           //   ?? .promise??
        if (err) throw err; 
        const employees = data.map(({ id, first_name, last_name }) => ({ 
            name: first_name + " " + last_name,
            value: id,
        }));
        inquirer.prompt([
            {
                type: 'list', 
                name: 'name',
                message: "What employee do you want to update?",
                choices: employees
            }
        ]).then((data) => {
            const employee = data.name;
            const params = [];
            params.push(employee);
            const roleSql = `SELECT * FROM role`;
            connection.query(roleSql, (err, data) => {                  //   ?? .promise??
                if (err) throw err;
                const roles = data.map(({ title, id }) => ({ name: title, value: id }));
                inquirer.prompt([
                    {
                        type: 'list', 
                        name: 'role',
                        message: "What is the new role of the employee?",
                        choices: roles
                    }
                ]).then((data) => {
                    const role = data.role;
                    // Adds role to start of params
                    params.unshift(role);

                    const sql = `UPDATE employee SET role_id = ? WHERE id = ?`;
                    connection.query(sql, params, (err, data) => {
                        if (err) throw err;
                        console.log("Employee has been updated!");
                        viewAllEmployees();
                    });
                });
            });
        });
    });
};

//
const updateEmployeeManagers = () => {
    const employeeSql = `SELECT * FROM employee`;
    connection.query(employeeSql, (err, data) => {     //   ?? .promise??
        if (err) throw err; 
        const employees = data.map(({ id, first_name, last_name }) => ({ 
            name: first_name + " " + last_name, 
            value: id,
        }));
        inquirer.prompt([
            {
                type: 'list',
                name: 'name',
                message: "Which employee would you like to update?",
                choices: employees
            }
        ]).then(data => {
            const employee = data.name;
            const params = [];
            params.push(employee);
            const managerSql = `SELECT * FROM employee`;
            connection.query(managerSql, (err, data) => {          //   ?? .promise??
                if (err) throw err;
                const managers = data.map(({ id, first_name, last_name }) => ({ 
                    name: first_name + " " + last_name,
                    value: id,
                }));
                inquirer.prompt([
                    {
                        type: 'list',
                        name: 'manager',
                        message: "Who is the employee's manager?",
                        choices: managers
                    }
                ]).then((data) => {
                    const manager = data.manager;
                    params.push(manager);

                    let employee = params[0]
                    params[0] = manager
                    params[1] = employee 

                    const sql = `UPDATE employee SET manager_id = ? WHERE id = ?`;
                    connection.query(sql, params, (err, data) => {
                        if (err) throw err;
                        console.log("Employee has been updated!");
                        viewAllEmployees();
                    });
                });
            });
        });
    });
};

//
const viewEmployeeByManager = () => {
    const managerSql = `SELECT e.manager_id, CONCAT(m.first_name, ' ', m.last_name) AS manager
    FROM employee e LEFT JOIN role r
	ON e.role_id = r.id
  	LEFT JOIN department d
  	ON d.id = r.department_id
  	LEFT JOIN employee m
	ON m.id = e.manager_id GROUP BY e.manager_id`;

	connection.query(managerSql, (err, data) => {                  //   ?? .promise??
		if (err) throw err;
		const managers = data.map(({ manager_id, manager }) => ({
            value: manager_id,
            name: manager,
        }));
		inquirer.prompt([
            {
                type: "list",
                name: "managers",
                choices: managers
            }
        ]).then((data) => {
            const params = [data.managers]
            const sql  = `SELECT e.id, e.first_name, e.last_name, r.title,
            CONCAT(m.first_name, ' ', m.last_name) AS manager
			FROM employee e
			JOIN role r
			ON e.role_id = r.id
			JOIN department d
			ON d.id = r.department_id
			LEFT JOIN employee m
			ON m.id = e.manager_id
			WHERE m.id = ?`;
            
            connection.query(sql, params, (err, data) => {
                if (err) throw err;
                console.table(data);
                init();
            });
		});
	});
};

//
const viewEmployeeByDepartment = () => {
    const sql = `SELECT CONCAT(first_name, " ", last_name) AS Name,
    department.name AS Department
    FROM employee
    LEFT JOIN role ON employee.role_id = role.id 
    LEFT JOIN department ON role.department_id = department.id;`;
    connection.query(sql, (err, data) => {       // promise ct w???
        if (err) throw err;
        console.table(data);        // ??
        init();
    });
};

//
const viewDepartmentUtilBudget = () => {
    const sql = `SELECT department_id AS ID,
    department.name AS Department,
    SUM(salary) AS Budget
    FROM role
    JOIN department ON role.department_id = department.id GROUP BY department_id`;
    connection.query(sql, (err, data) => {
        if (err) throw err;
        console.table(data);         // ??
        init();
    });
};

//
const deleteDepartment = () => {
    const departmentSql = `SELECT * FROM department`; 
    connection.query(departmentSql, (err, data) => {             //   ?? .promise??
        if (err) throw err; 
        const departments = data.map(({ name, id }) => ({ name: name, value: id }));
        inquirer.prompt([
            {
                type: 'list', 
                name: 'department',
                message: "What department do you want to delete?",
                choices: departments
            }
      ]).then(data => {
            const department = data.department;
            const sql = `DELETE FROM department WHERE id = ?`;
            connection.query(sql, department, (err, data) => {
                if (err) throw err;
                console.log("Successfully deleted!");
                viewAllDepartments();
            });
        });
    });
};

//
const deleteRole = () => { 
    const roleSql = `SELECT * FROM role`; 
    connection.query(roleSql, (err, data) => {           //   ?? .promise??
        if (err) throw err; 
        const roles = data.map(({ title, id }) => ({ name: title, value: id }));
        inquirer.prompt([
            {
                type: 'list', 
                name: 'role',
                message: "What role do you want to delete?",
                choices: roles
            }
        ]).then(data => {
            const role = data.role;
            const sql = `DELETE FROM role WHERE id = ?`;
            connection.query(sql, role, (err, data) => {
                if (err) throw err;
                console.log("Successfully deleted!"); 
                viewAllRoles();
            });
        });
    });
};

//
const deleteEmployee = () => {
    const employeeSql = `SELECT * FROM employee`;
    connection.query(employeeSql, (err, data) => {     //   ?? .promise??
        if (err) throw err; 
        const employees = data.map(({ id, first_name, last_name }) => ({ 
            name: first_name + " "+ last_name,
            value: id,
        }));
        inquirer.prompt([
            {
                type: 'list',
                name: 'name',
                message: "Which employee would you like to delete?",
                choices: employees
            }
        ]).then(data => {
            const employee = data.name;
            const sql = `DELETE FROM employee WHERE id = ?`;
            connection.query(sql, employee, (err, data) => {
                if (err) throw err;
                console.log("Successfully Deleted!");
                viewAllEmployees();
            });
        });
    });
};

init();
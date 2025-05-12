const express = require("express");
const mysql = require("mysql2");
const moment = require("moment");
const cors = require("cors");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config();
// dotenv.config({ debug: true });

const app = express();
const port = process.env.PORT || 8080;

app.use(cors()); // middleware enable express to recive data from the react frontend
app.use(express.urlencoded({ extended: true })); //middleware enable express to understand urlencoded data
app.use(express.json()); // middleware enable express to understand json data

app.listen(port, () => {
  console.log(`app is listening at port ${port}`);
});
app.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.url}`);
  next();
});

// Create database connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

//connect database
db.connect((err) => {
  if (err) throw err;
  else console.log("MYSQL connected Successfully wow:");
});
console.log("DB_HOST:", process.env.DB_HOST);
console.log("DB_USER:", process.env.DB_USER);
console.log("DB_PASSWORD:", process.env.DB_PASSWORD);
console.log("DB_NAME:", process.env.DB_NAME);

/*=========================================================================================================================================================
===========================================================================================================================================================
==============================================    CRUD Routes for Projects   ==============================================================================
===========================================================================================================================================================
===========================================================================================================================================================
*/
app.get("/", (req, res) => {
  res.send("welcome to CPMS");
});

//______________________________________________ Get all Projects __________//

app.get("/projects", (req, res) => {
  const { search } = req.query;
  let q = "SELECT * FROM projects ";
  // Add search functionality
  if (search) {
    q += ` WHERE name LIKE "%${search}%"`;
  }
  try {
    db.query(q, (err, result) => {
      if (err) throw err;
      // Format date using moment //  "MMMM Do YYYY, h:mm:ss a"
      result.forEach((project) => {
        project.start_date = moment(project.start_date).format("MMM Do YYYY");
        project.end_date = moment(project.end_date).format("MMMM Do YYYY");
      });
      console.log(result);
      return res.json(result);
      // res.render("project-index.ejs", { projects: result });
    });
  } catch (error) {
    console.log(error);
  }
});
//______________________________________________Get  Projects By ID________//

app.get("/projects/:id", (req, res) => {
  const { id } = req.params;
  db.query("SELECT * FROM projects WHERE id=?", [id], (err, result) => {
    if (err) throw err;
    // Format date using moment //  "MMMM Do YYYY, h:mm:ss a"
    result.forEach((project) => {
      project.start_date = moment(project.start_date).format("YYYY-MM-DD");
      // ("yyyy-MM-dd");
      project.end_date = moment(project.end_date).format("YYYY-MM-DD");
    });
    res.json(result);
    // res.render("project-details.ejs", { project_details: result });
  });
});

//______________________________________________ Create   Projects _______//

app.post("/projects", (req, res) => {
  const value = [
    req.body.name,
    req.body.description,
    req.body.location,
    req.body.start_date,
    req.body.end_date,
    req.body.status,
    req.body.budget,
    req.body.expenses,
  ];

  const q = `INSERT INTO
  projects (
    name,
    description,
    location,
    start_date,
    end_date,
    status,
    budget,
    expenses
  )
values
  (?)`;
  try {
    db.query(q, [value], (err, result) => {
      if (err) throw err;
      // res.redirect("http://localhost:8080/projects");
      res.json("project is added:");
    });
  } catch (error) {
    console.log(error);
  }
});

//______________________________________________ Update   Projects ______//

app.put("/projects/:id", (req, res) => {
  const { id } = req.params;
  const value = [
    req.body.name,
    req.body.description,
    req.body.location,
    req.body.start_date,
    req.body.end_date,
    req.body.status,
    req.body.budget,
    req.body.expenses,
  ];
  const q =
    "UPDATE projects SET name=? ,  description=?, location =? ,  start_date=?, end_date=?, status=?,  budget=?, expenses=? WHERE id=?";
  db.query(q, [...value, id], (err, result) => {
    if (err) throw err;

    res.json("data is updated:");
    console.log("update=", result);
  });
});

//______________________________________________ Delete   Projects ______//

app.delete("/projects/:id", (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM projects WHERE id=?", [id], (err, result) => {
    // res.redirect("http://localhost:8080/projects");
    console.log(result);
    return res.json("project is deleted:");
  });
});

//______________________________________________ get  Specific Project Expenses ______//

app.get(`/projects/:id/expenses`, (req, res) => {
  const { id } = req.params;

  const q = ` SELECT p.id     AS project_id,
              p.name          AS project_name,
       Coalesce(e.total_expenses, 0)
       + Coalesce(pr.total_resource_cost, 0) AS total_expenses

FROM   projects AS p

       LEFT JOIN (SELECT project_id,
                         Sum(amount) AS total_expenses
                  FROM   expenses
                  WHERE  project_id =?
                  GROUP  BY project_id) AS e
              ON p.id = e.project_id

       LEFT JOIN (SELECT pr.project_id,
                         Sum(pr.quantity_used * i.priceperunit) AS
                         total_resource_cost
                  FROM   project_resources AS pr
                         INNER JOIN inventory AS i
                                 ON pr.resource_id = i.id
                  WHERE  pr.project_id = ?

                  GROUP  BY pr.project_id) AS pr
              ON p.id = pr.project_id

WHERE  p.id = ? ; `;
  try {
    db.query(q, [id, id, id], (err, result) => {
      if (err) throw err;
      console.log(result[0]);
      res.json(result[0]);
    });
  } catch (error) {
    console.log(error);
  }
});

//______________________________________________ get  Specific Project Expenses vs Budget ______//

app.get("/project-budget-expenses/:projectId", (req, res) => {
  const projectId = req.params.projectId;

  const budgetQuery = "SELECT budget FROM projects WHERE id = ?";
  const expensesQuery = "SELECT expenses FROM projects WHERE id = ?";
  // const expensesQuery = `
  //   SELECT
  //       COALESCE(SUM(e.amount), 0) + COALESCE(SUM(pr.quantity_used * i.pricePerUnit), 0) AS total_expenses
  //   FROM
  //       projects AS p
  //   LEFT JOIN
  //       expenses AS e ON p.id = e.project_id
  //   LEFT JOIN
  //       project_resources AS pr ON p.id = pr.project_id
  //   LEFT JOIN
  //       inventory AS i ON pr.resource_id = i.id
  //   WHERE
  //       p.id = ?
  //   GROUP BY
  //       p.id;
  // `;

  db.query(budgetQuery, [projectId], (err, budgetResult) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }

    // db.query(
    //   expensesQuery,
    //   [projectId, projectId, projectId],
    //   (err, expensesResult) => {
    //     if (err) {
    //       res.status(500).json({ error: err.message });
    //       return;
    //     }
    db.query(expensesQuery, [projectId], (err, expensesResult) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }

      const budget = budgetResult[0]?.budget || 0;
      const expenses = expensesResult[0]?.expenses || 0;
      console.log("budget=", budget, "expenses", expenses);

      res.json({ budget, expenses });
    });
  });
});

//______________________________________________ get  ALL Project Expenses vs Budget ______//

app.get("/projects-budget-expenses", (req, res) => {
  const query = `
    SELECT 
        p.id AS project_id,
        p.name AS project_name,
        p.budget,
        COALESCE(e.total_expenses, 0) + COALESCE(pr.total_resource_cost, 0) AS total_expenses
    FROM 
        projects AS p
    LEFT JOIN 
        (
            SELECT 
                project_id, 
                SUM(amount) AS total_expenses
            FROM 
                expenses
            GROUP BY 
                project_id
        ) AS e ON p.id = e.project_id
    LEFT JOIN 
        (
            SELECT 
                pr.project_id, 
                SUM(pr.quantity_used * i.pricePerUnit) AS total_resource_cost
            FROM 
                project_resources AS pr
            INNER JOIN 
                inventory AS i ON pr.resource_id = i.id
            GROUP BY 
                pr.project_id
        ) AS pr ON p.id = pr.project_id;
  `;

  db.query(query, (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(results);
  });
});

app.get("/projects-task-status", (req, res) => {
  const query = `
    SELECT 
   
     p.name AS project_name,
      t.name AS task_name,
      t.status,
      t.start_date,
      t.end_date,
      e.first_name AS assigned_to
    FROM tasks t
    JOIN projects p ON t.project_id = p.id
    JOIN employees e ON t.assigned_to = e.id
  `;

  db.query(query, (err, results) => {
    if (err) {
      res.status(500).json({ error: "Error fetching task data" });
    } else {
      results.forEach((task) => {
        task.start_date = moment(task.start_date).format("MMM Do YYYY");
        // ("yyyy-MM-dd");
        task.end_date = moment(task.end_date).format("MMM Do YYYY");
      });
      // Structure the data as expected by the frontend
      const data = results.reduce((acc, row) => {
        const project = acc.find((p) => p.name === row.project_name);
        if (project) {
          project.tasks.push({
            name: row.task_name,
            status: row.status,
            start_date: row.start_date,
            end_date: row.end_date,
            assigned_to: row.assigned_to,
          });
        } else {
          acc.push({
            name: row.project_name,
            tasks: [
              {
                name: row.task_name,
                status: row.status,
                start_date: row.start_date,
                end_date: row.end_date,
                assigned_to: row.assigned_to,
              },
            ],
          });
        }
        return acc;
      }, []);

      res.json(data);
    }
  });
});
-app.get("/count/projects", (req, res) => {
  const q = ` SELECT COUNT(*) as projectsCount FROM projects  `;
  try {
    db.query(q, (err, result) => {
      if (err) throw err;
      console.log("Projects with status 'ongoing':", result);
      res.json(result[0]);
    });
  } catch (error) {
    console.log(error);
  }
});
app.get("/completed/projects", (req, res) => {
  console.log("API endpoint hit");

  if (!db) {
    console.error("Database connection not established");
    return res.status(500).json({ error: "Database connection failed" });
  }
  const query = `SELECT COUNT(*) as completedCount FROM projects WHERE status = "Completed" `;
  try {
    db.query(query, (err, result) => {
      if (err) {
        console.error("Error executing query:", err);
        return res.status(500).json({
          error:
            "An error occurred while fetching the completed projects count",
        });
      }
      // Send the count of completed projects to the frontend
      console.log("Projects with status 'Completed':", result);
      res.json(result[0]);
    });
  } catch (error) {
    console.log(error);
  }
});

app.get("/pending/projects", (req, res) => {
  const q = `SELECT COUNT(*) as pendingCount FROM projects WHERE status="Pending"`;
  db.query(q, (err, result) => {
    if (err) {
      console.error("Error executing query:", err);
      return res.status(500).json({
        error: "An error occurred while fetching the pending projects count",
      });
    }
    // Assuming 'result' is an array with one object containing the count
    console.log("Projects with status 'pending':", result);
    res.json(result[0]);
  });
});

app.get("/ongoing/projects", (req, res) => {
  const q = ` SELECT COUNT(*) as ongoingCount FROM projects WHERE status="Ongoing" `;
  try {
    db.query(q, (err, result) => {
      if (err) throw err;
      console.log("Projects with status 'ongoing':", result);
      res.json(result[0]);
    });
  } catch (error) {
    console.log(error);
  }
});
/*=========================================================================================================================================================
===========================================================================================================================================================
==============================================    CRUD Routes for Suppliers   =============================================================================
===========================================================================================================================================================
===========================================================================================================================================================
*/

//______________________________________________Get all Suppliers _____//

app.get("/suppliers", (req, res) => {
  try {
    db.query("SELECT * FROM  suppliers ", (err, result) => {
      if (err) throw err;
      return res.json(result);
    });
  } catch (error) {
    console.log(error);
  }
});

//______________________________________________Get  Supplier By ID ____//

app.get("/suppliers/:id", (req, res) => {
  const { id } = req.params;
  const q = "SELECT * FROM  suppliers WHERE id=?";
  try {
    db.query(q, [id], (err, result) => {
      if (err) throw err;
      res.json(result);
    });
  } catch (error) {
    console.log(error);
  }
});

//______________________________________________ Create   Suppliers _____//

app.post("/suppliers", (req, res) => {
  const { name, phone, email, address } = req.body;

  const q =
    "INSERT INTO suppliers (name, phone, email, address  ) values (?, ?, ?, ? )";
  try {
    db.query(q, [name, phone, email, address], (err, result) => {
      if (err) throw err;
      res.json(" New suppliers is added sucssfully:");
      console.log(" New suppliers is added sucssfully:");
    });
  } catch (error) {
    console.log(error);
  }
});

//______________________________________________Update Supplier _______//

app.put("/suppliers/:id", (req, res) => {
  const { id } = req.params;
  const value = [
    req.body.name,
    req.body.phone,
    req.body.email,
    req.body.address,
  ];
  const q =
    "UPDATE suppliers SET name=? ,  phone=?, email =? ,  address=?  WHERE id=? ";
  try {
    db.query(q, [...value, id], (err, result) => {
      if (err) throw err;
      res.json(`suppliers with id  ${id}  is updated :`);
    });
  } catch (error) {
    console.log(error);
  }
});

//______________________________________________Delete supplier ______//

app.delete("/suppliers/:id", (req, res) => {
  const { id } = req.params;
  const q = "DELETE FROM suppliers  WHERE id=?";
  try {
    db.query(q, [id], (err, result) => {
      if (err) throw err;
      return res.json(`suppliers with id  ${id}  is deleted :`);
    });
  } catch (error) {
    console.log(error);
  }
});

/*=========================================================================================================================================================
===========================================================================================================================================================
==============================================    CRUD Routes for Inventory   =============================================================================
===========================================================================================================================================================
===========================================================================================================================================================
*/

//______________________________________________Get All Inventory _____//

app.get("/inventory", (req, res) => {
  try {
    db.query("SELECT  * FROM inventory ", (err, result) => {
      if (err) throw err;
      return res.json(result);
    });
  } catch (error) {
    console.log(error);
  }
});

//______________________________________________Get  Inventory By ID ____//

app.get("/inventory/:id", (req, res) => {
  const { id } = req.params;
  const q = "SELECT * FROM   inventory  WHERE id=?";
  try {
    db.query(q, [id], (err, result) => {
      if (err) throw err;
      res.json(result);
    });
  } catch (error) {
    console.log(error);
  }
});

//______________________________________________Create Inventory _______//

app.post("/inventory", (req, res) => {
  const { item_name, quantity, pricePerUnit, supplier_id } = req.body;
  console.log(item_name, quantity, pricePerUnit, supplier_id);
  const q =
    "INSERT INTO inventory ( item_name, quantity,  pricePerUnit,  supplier_id) VALUES(?,?,?,?)";
  try {
    db.query(
      q,
      [item_name, quantity, pricePerUnit, supplier_id],
      (err, result) => {
        if (err) throw err;

        res.json("invntory is added sucessfully:");
      }
    );
  } catch (error) {
    console.log(error);
  }
});

//______________________________________________Update  Inventory _______//

app.put("/inventory/:id", (req, res) => {
  const { id } = req.params;

  const values = [
    req.body.supplier_id,
    req.body.item_name,
    req.body.quantity,
    req.body.pricePerUnit,
  ];

  const q =
    "UPDATE  inventory SET supplier_id=? ,  item_name=?, quantity=?, pricePerUnit=?  WHERE id= ? ";
  try {
    db.query(q, [...values, id], (err, result) => {
      if (err) throw err;
      res.json(`inventory having id ${id} is updated sucessfully `);
    });
  } catch (error) {
    console.log(error);
  }
});

//______________________________________________Delete  Inventory _______//

app.delete("/inventory/:id", (req, res) => {
  const { id } = req.params;
  const q = "DELETE FROM inventory WHERE id=?";
  try {
    db.query(q, [id], (err, result) => {
      if (err) throw err;

      res.json(`inventory having id ${id} is deleted sucessfully `);
    });
  } catch (err) {
    console.log(err);
  }
});

/*=========================================================================================================================================================
===========================================================================================================================================================
==============================================    CRUD Routes for Employees   =============================================================================
===========================================================================================================================================================
===========================================================================================================================================================
*/

//______________________________________________get all employees ________//
// app.get("/employees", (req, res) => {
//   const q = "SELECT  * FROM employees";
//   try {
//     db.query(q, (err, result) => {
//       if (err) throw err;
//       result.forEach((project) => {
//         project.date_hired = moment(project.date_hired).format("YYYY-MM-DD");
//       });

//       return res.json(result);
//     });
//   } catch (error) {
//     console.log(error);
//   }
// });

app.get("/employees", (req, res) => {
  const { project_id, search } = req.query; // Extract project_id from query parameters

  let q = "SELECT * FROM employees ";
  let params = [];

  if (project_id) {
    q += " WHERE project_id = ?";
    params.push(project_id);
  }
  // Add search functionality
  if (search) {
    q += ` AND first_name LIKE "%${search}%"`;
  }
  try {
    db.query(q, params, (err, result) => {
      if (err) throw err;
      result.forEach((employee) => {
        employee.date_hired = moment(employee.date_hired).format("YYYY-MM-DD");
      });
      console.log(result);
      return res.json(result);
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//______________________________________________ Get  employees By ID ___//
app.get("/employees/:id", (req, res) => {
  const { id } = req.params;
  const q = "SELECT * FROM  employees WHERE id=?";
  try {
    db.query(q, [id], (err, result) => {
      if (err) throw err;
      result.forEach((employee) => {
        employee.date_hired = moment(employee.date_hired).format("MMM Do YYYY");
      });
      res.json(result);
    });
  } catch (error) {
    console.log(error);
  }
});

//______________________________________________ Create  employees ______//
app.post("/employees", (req, res) => {
  const value = [
    req.body.first_name,
    req.body.last_name,
    req.body.role,
    req.body.phone,
    req.body.email,
    req.body.address,
    req.body.salary,
    req.body.project_id,
    req.body.date_hired,
  ];
  console.log(value);
  const q = `INSERT INTO
  employees (
    first_name,
    last_name,
    role,
    phone,
    email,
    address,
    salary,
    project_id,
    date_hired
  )
VALUES
  (?)`;
  try {
    db.query(q, [value], (err, result) => {
      if (err) throw err;
      console.log(result);
      return res.json(result);
    });
  } catch (error) {
    console.log(error);
  }
});

//______________________________________________ Update employees ______//
app.put("/employees/:id", (req, res) => {
  const { id } = req.params;
  const value = [
    req.body.first_name,
    req.body.last_name,
    req.body.role,
    req.body.phone,
    req.body.email,
    req.body.address,
    req.body.salary,
    req.body.project_id,
    req.body.date_hired,
  ];
  console.log(value);
  const q = `UPDATE employees
SET
  first_name = ?,
  last_name = ?,
  role = ?,
  phone = ?,
  email = ?,
  address = ?,
  salary = ?,
  project_id = ?,
  date_hired = ?
WHERE
  id = ?`;
  try {
    db.query(q, [...value, id], (err, result) => {
      if (err) throw err;
      res.json(`employee with id "${id}" upadted sucessfully!!`);
    });
  } catch (error) {
    console.log(error);
  }
});
//______________________________________________ Delete  employees _____//
app.delete("/employees/:id", (req, res) => {
  const { id } = req.params;
  const q = "DELETE FROM employees WHERE id=?";
  try {
    db.query(q, [id], (err, result) => {
      if (err) throw err;
      return res.json(`employees with id " ${id} " is deleted:`);
    });
  } catch (error) {
    console.log(error);
  }
});

/*=========================================================================================================================================================
===========================================================================================================================================================
==============================================    CRUD Routes for Task   =============================================================================
===========================================================================================================================================================
===========================================================================================================================================================
*/

//______________________________________________get all Task ________//
// app.get("/task", (req, res) => {
//   const q = "SELECT  * FROM tasks";
//   try {
//     db.query(q, (err, result) => {
//       if (err) throw err;
//       result.forEach((task) => {
//         task.start_date = moment(task.start_date).format("YYYY-MM-DD");
//         task.end_date = moment(task.end_date).format("YYYY-MM-DD");
//       });
//       console.log("result===", result);
//       return res.json(result);
//     });
//   } catch (error) {
//     console.log(error);
//   }
// });
// app.get("/task", (req, res) => {
//   const {
//     status,
//     project_id,
//     assigned_to,
//     page = 1,
//     limit = 10,
//     sortField = "id",
//     sortOrder = "ASC",
//     search,
//   } = req.query;
//   let params = [];
//   console.log("serach =", search);
//   let query = "SELECT * FROM tasks WHERE 1=1";
//   if (search) {
//     q = `SELECT * FROM tasks WHERE name LIKE "%${search}%" `;
//     // params.push(search);
//   }
//   // Add filters
//   if (status) {
//     query += ` AND status='${status}'`;
//   }
//   if (project_id) {
//     query += ` AND project_id='${project_id}'`;
//   }
//   if (assigned_to) {
//     query += ` AND assigned_to='${assigned_to}'`;
//   }

//   // Add sorting
//   query += ` ORDER BY ${sortField} ${sortOrder}`;

//   // Add pagination
//   const offset = (page - 1) * limit;
//   query += ` LIMIT ${limit} OFFSET ${offset}`;

//   // Execute the query
//   db.query(query, (err, result) => {
//     if (err) throw err;
//     result.forEach((task) => {
//       task.start_date = moment(task.start_date).format("YYYY-MM-DD");
//       task.end_date = moment(task.end_date).format("YYYY-MM-DD");
//     });
//     console.log("task serach result=", result);
//     res.json(result);
//   });
// });

app.get("/task", (req, res) => {
  const {
    status,
    project_id,
    assigned_to,
    page = 1,
    limit = 10,
    sortField = "id",
    sortOrder = "ASC",
    search,
  } = req.query;

  // let query = "SELECT * FROM tasks WHERE 1=1";
  let query = "SELECT * FROM tasks "; // Base query

  // Add search functionality
  if (project_id) {
    query += `WHERE project_id= ${project_id}`;
  }
  if (search) {
    query += ` AND name LIKE "%${search}%"`;
  }

  // Add filters
  if (status) {
    query += ` AND status='${status}'`;
  }
  if (project_id) {
    query += ` AND project_id='${project_id}'`;
  }
  if (assigned_to) {
    query += ` AND assigned_to='${assigned_to}'`;
  }

  // Add sorting
  query += ` ORDER BY ${sortField} ${sortOrder}`;

  // Add pagination
  const offset = (page - 1) * limit;
  query += ` LIMIT ${limit} OFFSET ${offset}`;

  // Execute the query
  db.query(query, (err, result) => {
    if (err) throw err;

    // Format date fields
    result.forEach((task) => {
      task.start_date = moment(task.start_date).format("YYYY-MM-DD");
      task.end_date = moment(task.end_date).format("YYYY-MM-DD");
    });
    console.log(result);
    res.json(result);
  });
});

//______________________________________________ Get  Task By ID ___//

app.get("/task/:id", (req, res) => {
  const { id } = req.params;
  const q = "SELECT * FROM  tasks WHERE id=?";
  try {
    db.query(q, [id], (err, result) => {
      if (err) throw err;
      console.log("task update:", result);
      result.forEach((task) => {
        task.start_date = moment(task.start_date).format("YYYY-MM-DD");
        task.end_date = moment(task.end_date).format("YYYY-MM-DD");
      });
      res.json(result);
    });
  } catch (error) {
    console.log(error);
  }
});

//______________________________________________ Create  Task ______//
app.post("/task", (req, res) => {
  console.log("req.body", req.body);
  const value = [
    req.body.project_id,
    req.body.name,
    req.body.description,
    req.body.assigned_to,
    req.body.start_date,
    req.body.end_date,
    req.body.status,
    req.body.priority,
  ];
  console.log(value);
  const q =
    "INSERT INTO tasks  ( project_id  , name , description , assigned_to,  start_date,  end_date, status,  priority )  VALUES (?)";
  try {
    db.query(q, [value], (err, result) => {
      if (err) throw err;
      console.log(result);
      return res.json(result);
    });
  } catch (error) {
    console.log(error);
  }
});

//______________________________________________ Update Task ______//
app.put("/task/:id", (req, res) => {
  const { id } = req.params;
  const value = [
    req.body.project_id,
    req.body.name,
    req.body.description,
    req.body.assigned_to,
    req.body.start_date,
    req.body.end_date,
    req.body.status,
    req.body.priority,
  ];
  console.log(value);
  const q = `UPDATE tasks
SET
  project_id = ?,
  name = ?,
  description = ?,
  assigned_to = ?,
  start_date = ?,
  end_date = ?,
  status = ?,
  priority = ?
WHERE
  id = ?`;
  try {
    db.query(q, [...value, id], (err, result) => {
      if (err) throw err;
      res.json(`task with id "${id}" upadted sucessfully!!`);
    });
  } catch (error) {
    console.log(error);
  }
});
//______________________________________________ Delete  Task _____//

app.delete("/task/:id", (req, res) => {
  const { id } = req.params;
  console.log("id=", id);
  const q = "DELETE FROM tasks WHERE id=?";
  try {
    db.query(q, [id], (err, result) => {
      if (err) throw err;
      return res.json(`task with id " ${id} " is deleted:`);
    });
  } catch (error) {
    console.log(error);
  }
});

/*=========================================================================================================================================================
===========================================================================================================================================================
==============================================    CRUD Routes for Project Resourses  =============================================================================
===========================================================================================================================================================
===========================================================================================================================================================
*/

//______________________________________________get all Project Resources ________//

app.get("/projectResources", (req, res) => {
  const { project_id, search } = req.query; // Extract project_id from query parameters

  let q = `SELECT project_resources.id,
  name,
  item_name,
  quantity_used
FROM   project_resources
  INNER JOIN projects
          ON projects.id = project_resources.project_id
  INNER JOIN inventory
          ON inventory.id = project_resources.resource_id
ORDER  BY project_resources.id `;

  let params = [];

  if (project_id) {
    q = `SELECT project_resources.id,
       name,
       item_name,
       quantity_used
FROM   project_resources
       INNER JOIN projects
               ON projects.id = project_resources.project_id
       INNER JOIN inventory
               ON inventory.id = project_resources.resource_id
WHERE  project_resources.project_id = ?
ORDER  BY project_resources.id;
`;
    params.push(project_id);
  }
  if (project_id && search) {
    q = `SELECT project_resources.id,
       name,
       item_name,
       quantity_used
FROM   project_resources
       INNER JOIN projects
               ON projects.id = project_resources.project_id
       INNER JOIN inventory
               ON inventory.id = project_resources.resource_id
WHERE  project_resources.project_id = ${project_id} item_name LIKE "%${search}%"
ORDER  BY project_resources.id;

`;
    params.push(project_id, search);
  }

  try {
    db.query(q, params, (err, result) => {
      if (err) throw err;

      console.log("all project_Resources ===", result);
      return res.json(result);
    });
  } catch (error) {
    console.log(error);
  }
});
//______________________________________________ Get  Project Resources By ID ___//
app.get("/projectResources/:id", (req, res) => {
  const { id } = req.params;
  const q = "SELECT * FROM project_resources  WHERE id=?";
  try {
    db.query(q, [id], (err, result) => {
      if (err) throw err;

      console.log(` Project Resources  with id: ${id}=`, result);
      res.json(result);
    });
  } catch (error) {
    console.log(error);
  }
});

//______________________________________________ Create  Project Resources ______//
app.post("/projectResources", (req, res) => {
  const value = [
    req.body.project_id,
    req.body.resource_id,
    req.body.quantity_used,
  ];
  console.log("value=", value);
  const q =
    "INSERT INTO project_resources  ( project_id  ,  resource_id,  quantity_used )  VALUES (?)";
  try {
    db.query(q, [value], (err, result) => {
      if (err) throw err;
      console.log(result);
      return res.json(
        `new resource having id ${req.body.resource_id} for project having id:${req.body.project_id} is added`
      );
    });
  } catch (error) {
    console.log(error);
  }
});

//______________________________________________ Update Project Resources ______//
app.put("/projectResources/:id", (req, res) => {
  const { id } = req.params;
  const value = [
    req.body.project_id,
    req.body.resource_id,
    req.body.quantity_used,
  ];
  console.log("update value", value);
  const q = `UPDATE project_resources SET project_id=? , resource_id=? , quantity_used=?  WHERE id=?`;
  try {
    db.query(q, [...value, id], (err, result) => {
      if (err) throw err;
      res.json(` project Resources with id "${id}" upadted sucessfully!!`);
    });
  } catch (error) {
    console.log(error);
  }
});
//______________________________________________ Delete  Project Resources _____//

app.delete("/projectResources/:id", (req, res) => {
  const { id } = req.params;
  console.log("id=", id);
  const q = "DELETE FROM project_resources  WHERE id=?";
  try {
    db.query(q, [id], (err, result) => {
      if (err) throw err;
      return res.json(`project resources with id " ${id} " is deleted:`);
    });
  } catch (error) {
    console.log(error);
  }
});

/*=========================================================================================================================================================
===========================================================================================================================================================
==============================================    CRUD Routes for Expenses  =============================================================================
===========================================================================================================================================================
===========================================================================================================================================================
*/

//______________________________________________get all Expenses________//

app.get("/expenses", (req, res) => {
  const q = `SELECT * FROM expenses `;
  try {
    db.query(q, (err, result) => {
      if (err) throw err;

      result.forEach((expenses) => {
        expenses.date = moment(expenses.date).format("MMM Do YYYY");
      });
      console.log("all expenses ===", result);

      return res.json(result);
    });
  } catch (error) {
    console.log(error);
  }
});
//______________________________________________ Get  Expenses By ID ___//
app.get("/expenses/:id", (req, res) => {
  const { id } = req.params;
  const q = "SELECT * FROM expenses  WHERE id=?";
  try {
    db.query(q, [id], (err, result) => {
      if (err) throw err;
      result.forEach((expenses) => {
        expenses.date = moment(expenses.date).format("YYYY-MM-DD");
      });

      console.log(` expenses  with id: ${id}=`, result);
      res.json(result);
    });
  } catch (error) {
    console.log(error);
  }
});

//______________________________________________ Create  Expenses ______//
app.post("/expenses", (req, res) => {
  const value = [
    req.body.project_id,
    req.body.amount,
    req.body.description,
    req.body.date,
  ];
  console.log("value=", value);
  const q =
    "INSERT INTO expenses ( project_id  ,  amount ,  description , date  )  VALUES (?)";
  try {
    db.query(q, [value], (err, result) => {
      if (err) throw err;
      console.log(result);
      return res.json(
        `new expenses  for project having id:${req.body.project_id} is added`
      );
    });
  } catch (error) {
    console.log(error);
  }
});

//______________________________________________ Update Expenses ______//
app.put("/expenses/:id", (req, res) => {
  const { id } = req.params;
  const value = [
    req.body.project_id,
    req.body.amount,
    req.body.description,
    req.body.date,
  ];
  console.log("update value", value);
  const q = `UPDATE expenses SET project_id=? , amount=? , description=?,  date=?  WHERE id=?`;
  try {
    db.query(q, [...value, id], (err, result) => {
      if (err) throw err;
      res.json(` expenses with id "${id}" upadted sucessfully!!`);
    });
  } catch (error) {
    console.log(error);
  }
});
//______________________________________________ Delete  Expenses _____//

app.delete("/expenses/:id", (req, res) => {
  const { id } = req.params;
  console.log("id=", id);
  const q = "DELETE FROM expenses  WHERE id=?";
  try {
    db.query(q, [id], (err, result) => {
      if (err) throw err;
      return res.json(`expenses with id " ${id} " is deleted:`);
    });
  } catch (error) {
    console.log(error);
  }
});

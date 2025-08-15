// const express = require("express");
// const mysql = require("mysql2");
// const moment = require("moment");
// const cors = require("cors");
// const dotenv = require("dotenv");
// const passport = require("passport");
// const LocalStrategy = require("passport-local").Strategy;
// const bcrypt = require("bcryptjs");
// const session = require("express-session");

// // Load environment variables
// dotenv.config();
// // dotenv.config({ debug: true });

// const app = express();
// const port = process.env.PORT || 8080;

// // Middleware
// // app.use(cors()); // middleware enable express to recive data from the react frontend
// app.use(
//   cors({
//     origin: process.env.FRONTEND_URL || "http://localhost:3000",
//     credentials: true,
//   })
// );

// app.use(express.urlencoded({ extended: true })); //middleware enable express to understand urlencoded data
// app.use(express.json()); // middleware enable express to understand json data

// // Add request logging middleware here
// app.use((req, res, next) => {
//   console.log(`Incoming request: ${req.method} ${req.url}`);
//   next();
// });

// // Session configuration
// app.use(
//   session({
//     secret: process.env.SESSION_SECRET || "your-secret-key-here",
//     resave: false,
//     saveUninitialized: false,
//     cookie: {
//       secure: process.env.NODE_ENV === "production",
//       maxAge: 24 * 60 * 60 * 1000, // 24 hours
//     },
//   })
// );

// // Passport initialization
// app.use(passport.initialize());
// app.use(passport.session());

// // Create database connection
// const db = mysql.createConnection({
//   host: process.env.DB_HOST,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_NAME,
// });

// //connect database
// db.connect((err) => {
//   if (err) throw err;
//   else console.log("MYSQL connected Successfully wow:");
// });
// console.log("DB_HOST:", process.env.DB_HOST);
// console.log("DB_USER:", process.env.DB_USER);
// console.log("DB_PASSWORD:", process.env.DB_PASSWORD);
// console.log("DB_NAME:", process.env.DB_NAME);

// // Passport configuration
// passport.use(
//   new LocalStrategy(
//     { usernameField: "email" },
//     async (email, password, done) => {
//       try {
//         db.query(
//           "SELECT * FROM users WHERE email = ?",
//           [email],
//           async (err, results) => {
//             if (err) return done(err);

//             if (results.length === 0) {
//               return done(null, false, {
//                 message: "Incorrect email or password.",
//               });
//             }

//             const user = results[0];
//             const isMatch = await bcrypt.compare(password, user.password);

//             if (!isMatch) {
//               return done(null, false, {
//                 message: "Incorrect email or password.",
//               });
//             }

//             return done(null, user);
//           }
//         );
//       } catch (err) {
//         return done(err);
//       }
//     }
//   )
// );

// passport.serializeUser((user, done) => {
//   done(null, user.id);
// });

// passport.deserializeUser((id, done) => {
//   db.query(
//     "SELECT id, email, first_name, last_name FROM users WHERE id = ?",
//     [id],
//     (err, results) => {
//       if (err) return done(err);
//       done(null, results[0]);
//     }
//   );
// });

// // Authentication middleware
// const isAuthenticated = (req, res, next) => {
//   if (req.isAuthenticated()) {
//     return next();
//   }
//   res.status(401).json({ message: "Unauthorized" });
// };

// // ======================== AUTHENTICATION ROUTES ======================== //

// // Signup route
// app.post("/auth/signup", async (req, res) => {
//   const { email, password, firstName, lastName } = req.body;

//   if (!email || !password || !firstName || !lastName) {
//     return res.status(400).json({ message: "All fields are required" });
//   }

//   try {
//     db.query(
//       "SELECT * FROM users WHERE email = ?",
//       [email],
//       async (err, results) => {
//         if (err) throw err;

//         if (results.length > 0) {
//           return res.status(400).json({ message: "Email already in use" });
//         }

//         const salt = await bcrypt.genSalt(10);
//         const hashedPassword = await bcrypt.hash(password, salt);

//         const newUser = {
//           email,
//           password: hashedPassword,
//           first_name: firstName,
//           last_name: lastName,
//         };

//         db.query("INSERT INTO users SET ?", newUser, (err, result) => {
//           if (err) throw err;

//           req.login({ id: result.insertId, ...newUser }, (err) => {
//             if (err) throw err;
//             res.json({
//               success: true,
//               user: {
//                 id: result.insertId,
//                 email: newUser.email,
//                 firstName: newUser.first_name,
//                 lastName: newUser.last_name,
//               },
//             });
//           });
//         });
//       }
//     );
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Server error during signup" });
//   }
// });

// // Login route
// app.post("/auth/login", (req, res, next) => {
//   passport.authenticate("local", (err, user, info) => {
//     if (err) return next(err);
//     if (!user) {
//       return res.status(401).json({ message: info.message });
//     }
//     req.login(user, (err) => {
//       if (err) return next(err);
//       return res.json({
//         success: true,
//         user: {
//           id: user.id,
//           email: user.email,
//           firstName: user.first_name,
//           lastName: user.last_name,
//         },
//       });
//     });
//   })(req, res, next);
// });

// // Logout route
// app.post("/auth/logout", (req, res) => {
//   req.logout((err) => {
//     if (err) {
//       return res.status(500).json({ message: "Error logging out" });
//     }
//     res.json({ success: true, message: "Logged out successfully" });
//   });
// });

// // Check authentication status
// app.get("/auth/status", (req, res) => {
//   if (req.isAuthenticated()) {
//     res.json({
//       isAuthenticated: true,
//       user: {
//         id: req.user.id,
//         email: req.user.email,
//         firstName: req.user.first_name,
//         lastName: req.user.last_name,
//       },
//     });
//   } else {
//     res.json({ isAuthenticated: false, user: null });
//   }
// });

// // Add this route after your other authentication routes
// app.post("/auth/change-password", isAuthenticated, async (req, res) => {
//   const { oldPassword, newPassword } = req.body;
//   const userId = req.user.id;

//   try {
//     // Get user from database
//     db.query(
//       "SELECT * FROM users WHERE id = ?",
//       [userId],
//       async (err, results) => {
//         if (err) {
//           console.error("Database error:", err);
//           return res.status(500).json({ message: "Server error" });
//         }

//         if (results.length === 0) {
//           return res.status(404).json({ message: "User not found" });
//         }

//         const user = results[0];

//         // Verify old password
//         const isMatch = await bcrypt.compare(oldPassword, user.password);
//         if (!isMatch) {
//           return res
//             .status(400)
//             .json({ message: "Current password is incorrect" });
//         }

//         // Hash new password
//         const salt = await bcrypt.genSalt(10);
//         const hashedPassword = await bcrypt.hash(newPassword, salt);

//         // Update password in database
//         db.query(
//           "UPDATE users SET password = ? WHERE id = ?",
//           [hashedPassword, userId],
//           (updateErr) => {
//             if (updateErr) {
//               console.error("Password update error:", updateErr);
//               return res
//                 .status(500)
//                 .json({ message: "Error updating password" });
//             }

//             res.json({ message: "Password changed successfully" });
//           }
//         );
//       }
//     );
//   } catch (err) {
//     console.error("Server error:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// app.listen(port, () => {
//   console.log(`app is listening at port ${port}`);
// });
// app.use((req, res, next) => {
//   console.log(`Incoming request: ${req.method} ${req.url}`);
//   next();
// });
// // app.get("/", (req, res) => {
// //   res.send("Welcome to CPMS");
// // });
// /*=========================================================================================================================================================
// ===========================================================================================================================================================
// ==============================================    CRUD Routes for Documents   =============================================================================
// ===========================================================================================================================================================
// ===========================================================================================================================================================
// */

// // Configure multer for file uploads
// const multer = require("multer");
// const path = require("path");
// const fs = require("fs");

// // Set up storage configuration
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     const uploadDir = "uploads/";
//     if (!fs.existsSync(uploadDir)) {
//       fs.mkdirSync(uploadDir, { recursive: true });
//     }
//     cb(null, uploadDir);
//   },
//   filename: (req, file, cb) => {
//     const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
//     cb(null, uniqueSuffix + path.extname(file.originalname));
//   },
// });

// const upload = multer({
//   storage: storage,
//   limits: { fileSize: 100 * 1024 * 1024 }, // 100MB limit
// });

// function formatFileSize(bytes) {
//   if (bytes === 0) return "0 Bytes";
//   const k = 1024;
//   const sizes = ["Bytes", "KB", "MB", "GB"];
//   const i = Math.floor(Math.log(bytes) / Math.log(k));
//   return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
// }

// //______________________________________________ Upload Document ______//
// app.post(
//   "/projects/:projectId/documents",
//   isAuthenticated, // This middleware ensures user is logged in
//   upload.single("file"),
//   async (req, res) => {
//     const { projectId } = req.params;
//     const { description } = req.body;
//     const file = req.file;
//     const userId = req.user.id;
//     console.log("user is", userId); // From the authenticated session

//     if (!file) {
//       return res.status(400).json({ error: "No file uploaded" });
//     }

//     try {
//       const q = `INSERT INTO documents
//                (project_id,  uploaded_by,  name, file_type, file_extension, file_path, file_size,  description)
//                VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

//       const fileExt = path.extname(file.originalname).slice(1).toLowerCase();

//       db.query(
//         q,
//         [
//           projectId,
//           userId, // Added user_id here Will always have a value since route is protected by isAuthenticated
//           file.originalname,
//           file.mimetype,
//           fileExt,
//           file.path,
//           file.size,
//           description || null,
//         ],
//         (err, result) => {
//           if (err) {
//             console.error("Error saving document:", err);
//             // Clean up the uploaded file if DB operation fails
//             fs.unlinkSync(file.path);
//             return res.status(500).json({ error: "Failed to save document" });
//           }

//           res.status(201).json({
//             message: "Document uploaded successfully",
//             documentId: result.insertId,
//           });
//         }
//       );
//     } catch (error) {
//       console.error("Error in document upload:", error);
//       if (file && file.path) {
//         fs.unlinkSync(file.path); // Clean up file on error
//       }
//       res.status(500).json({ error: "Server error during document upload" });
//     }
//   }
// );

// //______________________________________________ Get All Documents for Project ______//
// app.get("/projects/:projectId/documents", isAuthenticated, (req, res) => {
//   const { projectId } = req.params;

//   const q = `SELECT id, name, file_type, file_size, upload_date, description, download_count
//              FROM documents
//              WHERE project_id = ?
//              ORDER BY upload_date DESC`;
//   console.log("Fetching documents for project:", projectId);

//   db.query(q, [projectId], (err, results) => {
//     if (err) {
//       console.error("Error fetching documents:", err);
//       return res.status(500).json({ error: "Failed to fetch documents" });
//     }

//     // Format dates and file sizes for better readability
//     const formattedResults = results.map((doc) => ({
//       ...doc,
//       upload_date: new Date(doc.upload_date).toISOString(),
//       file_size: formatFileSize(doc.file_size),
//     }));

//     res.json(formattedResults);
//   });
// });

// //______________________________________________ Download Document ______//
// // app.get("/documents/:id/download", isAuthenticated, (req, res) => {
// //   const { id } = req.params;

// //   const q = `SELECT name, file_path, file_type FROM documents WHERE id = ?`;

// //   db.query(q, [id], (err, results) => {
// //     if (err) {
// //       console.error("Error fetching document:", err);
// //       return res.status(500).json({ error: "Failed to fetch document" });
// //     }

// //     if (results.length === 0) {
// //       return res.status(404).json({ error: "Document not found" });
// //     }

// //     const document = results[0];
// //     const filePath = path.resolve(document.file_path);

// //     // Check if file exists
// //     if (!fs.existsSync(filePath)) {
// //       return res.status(404).json({ error: "File not found on server" });
// //     }

// //     // Set appropriate headers
// //     res.setHeader("Content-Type", document.file_type);
// //     res.setHeader(
// //       "Content-Disposition",
// //       `attachment; filename="${document.name}"`
// //     );

// //     // Create read stream and pipe to response
// //     const fileStream = fs.createReadStream(filePath);
// //     fileStream.pipe(res);

// //     // Handle stream errors
// //     fileStream.on("error", (err) => {
// //       console.error("File stream error:", err);
// //       res.status(500).json({ error: "Error streaming file" });
// //     });
// //   });
// // });

// // Download Document (with download count tracking)
// app.get("/documents/:id/download", isAuthenticated, (req, res) => {
//   const { id } = req.params;
//   const userId = req.user.id;

//   // First get the document details
//   const getQuery = `SELECT name, file_path, file_type, is_secure FROM documents WHERE id = ?`;

//   db.query(getQuery, [id], (err, results) => {
//     if (err) {
//       console.error("Error fetching document:", err);
//       return res.status(500).json({ error: "Failed to fetch document" });
//     }

//     if (results.length === 0) {
//       return res.status(404).json({ error: "Document not found" });
//     }

//     const document = results[0];
//     const filePath = path.resolve(document.file_path);

//     // Check if file exists
//     if (!fs.existsSync(filePath)) {
//       return res.status(404).json({ error: "File not found on server" });
//     }

//     // Increment download count (non-blocking)
//     db.query(
//       "UPDATE documents SET download_count = download_count + 1 WHERE id = ?",
//       [id],
//       (updateErr) => {
//         if (updateErr) {
//           console.error("Failed to update download count:", updateErr);
//           // Don't fail the request if count update fails
//         }
//       }
//     );

//     // Set appropriate headers
//     res.setHeader("Content-Type", document.file_type);
//     res.setHeader(
//       "Content-Disposition",
//       `attachment; filename="${encodeURIComponent(document.name)}"`
//     );

//     // Create read stream and pipe to response
//     const fileStream = fs.createReadStream(filePath);
//     fileStream.pipe(res);

//     // Handle stream errors
//     fileStream.on("error", (err) => {
//       console.error("File stream error:", err);
//       res.status(500).json({ error: "Error streaming file" });
//     });
//   });
// });
// //______________________________________________ Delete Document ______//
// app.delete("/documents/:id", isAuthenticated, (req, res) => {
//   const { id } = req.params;
//   const userId = req.user.id;

//   // First get the document details
//   const getQuery = `SELECT file_path, uploaded_by FROM documents WHERE id = ?`;

//   db.query(getQuery, [id], (err, results) => {
//     if (err) {
//       console.error("Error fetching document:", err);
//       return res.status(500).json({ error: "Failed to fetch document" });
//     }

//     if (results.length === 0) {
//       return res.status(404).json({ error: "Document not found" });
//     }

//     const document = results[0];

//     // Check if the current user is the uploader or has admin rights
//     if (document.uploaded_by !== userId) {
//       return res
//         .status(403)
//         .json({ error: "You can only delete your own documents" });
//     }

//     // Delete the file from filesystem
//     if (document.file_path && fs.existsSync(document.file_path)) {
//       fs.unlink(document.file_path, (err) => {
//         if (err) {
//           console.error("Error deleting file:", err);
//           return res.status(500).json({ error: "Failed to delete file" });
//         }

//         // File deleted successfully, now delete the DB record
//         deleteDocumentRecord(id, res);
//       });
//     } else {
//       // No file to delete, just delete the record
//       deleteDocumentRecord(id, res);
//     }
//   });
// });

// // Helper function to delete document record
// function deleteDocumentRecord(id, res) {
//   const deleteQuery = `DELETE FROM documents WHERE id = ?`;

//   db.query(deleteQuery, [id], (err, result) => {
//     if (err) {
//       console.error("Error deleting document record:", err);
//       return res
//         .status(500)
//         .json({ error: "Failed to delete document record" });
//     }

//     if (result.affectedRows === 0) {
//       return res.status(404).json({ error: "Document not found" });
//     }

//     res.json({ message: "Document deleted successfully" });
//   });
// }

// /*=========================================================================================================================================================
// ===========================================================================================================================================================
// ==============================================    CRUD Routes for Projects   ==============================================================================
// ===========================================================================================================================================================
// ===========================================================================================================================================================
// */

// //______________________________________________ Get all Projects __________//

// app.get("/projects", (req, res) => {
//   const { search } = req.query;
//   let q = "SELECT * FROM projects ";
//   // Add search functionality
//   if (search) {
//     q += ` WHERE name LIKE "%${search}%"`;
//   }
//   try {
//     db.query(q, (err, result) => {
//       if (err) throw err;
//       // Format date using moment //  "MMMM Do YYYY, h:mm:ss a"
//       result.forEach((project) => {
//         project.start_date = moment(project.start_date).format("MMM Do YYYY");
//         project.end_date = moment(project.end_date).format("MMMM Do YYYY");
//       });
//       console.log(result);
//       return res.json(result);
//       // res.render("project-index.ejs", { projects: result });
//     });
//   } catch (error) {
//     console.log(error);
//   }
// });
// //______________________________________________Get  Projects By ID________//

// app.get("/projects/:id", (req, res) => {
//   const { id } = req.params;
//   db.query("SELECT * FROM projects WHERE id=?", [id], (err, result) => {
//     if (err) throw err;
//     // Format date using moment //  "MMMM Do YYYY, h:mm:ss a"
//     result.forEach((project) => {
//       project.start_date = moment(project.start_date).format("YYYY-MM-DD");
//       // ("yyyy-MM-dd");
//       project.end_date = moment(project.end_date).format("YYYY-MM-DD");
//     });
//     res.json(result);
//     // res.render("project-details.ejs", { project_details: result });
//   });
// });

// //______________________________________________ Create   Projects _______//

// app.post("/projects", (req, res) => {
//   const value = [
//     req.body.name,
//     req.body.description,
//     req.body.location,
//     req.body.start_date,
//     req.body.end_date,
//     req.body.status,
//     req.body.budget,
//     req.body.expenses,
//   ];

//   const q = `INSERT INTO
//   projects (
//     name,
//     description,
//     location,
//     start_date,
//     end_date,
//     status,
//     budget,
//     expenses
//   )
// values
//   (?)`;
//   try {
//     db.query(q, [value], (err, result) => {
//       if (err) throw err;
//       // res.redirect("http://localhost:8080/projects");
//       res.json("project is added:");
//     });
//   } catch (error) {
//     console.log(error);
//   }
// });

// //______________________________________________ Update   Projects ______//

// app.put("/projects/:id", (req, res) => {
//   const { id } = req.params;
//   const value = [
//     req.body.name,
//     req.body.description,
//     req.body.location,
//     req.body.start_date,
//     req.body.end_date,
//     req.body.status,
//     req.body.budget,
//     req.body.expenses,
//   ];
//   const q =
//     "UPDATE projects SET name=? ,  description=?, location =? ,  start_date=?, end_date=?, status=?,  budget=?, expenses=? WHERE id=?";
//   db.query(q, [...value, id], (err, result) => {
//     if (err) throw err;

//     res.json("data is updated:");
//     console.log("update=", result);
//   });
// });

// //______________________________________________ Delete   Projects ______//

// app.delete("/projects/:id", (req, res) => {
//   const { id } = req.params;
//   db.query("DELETE FROM projects WHERE id=?", [id], (err, result) => {
//     // res.redirect("http://localhost:8080/projects");
//     console.log(result);
//     return res.json("project is deleted:");
//   });
// });

// //______________________________________________ get  Specific Project Expenses ______//

// app.get(`/projects/:id/expenses`, (req, res) => {
//   const { id } = req.params;

//   const q = ` SELECT p.id     AS project_id,
//               p.name          AS project_name,
//        Coalesce(e.total_expenses, 0)
//        + Coalesce(pr.total_resource_cost, 0) AS total_expenses

// FROM   projects AS p

//        LEFT JOIN (SELECT project_id,
//                          Sum(amount) AS total_expenses
//                   FROM   expenses
//                   WHERE  project_id =?
//                   GROUP  BY project_id) AS e
//               ON p.id = e.project_id

//        LEFT JOIN (SELECT pr.project_id,
//                          Sum(pr.quantity_used * i.priceperunit) AS
//                          total_resource_cost
//                   FROM   project_resources AS pr
//                          INNER JOIN inventory AS i
//                                  ON pr.resource_id = i.id
//                   WHERE  pr.project_id = ?

//                   GROUP  BY pr.project_id) AS pr
//               ON p.id = pr.project_id

// WHERE  p.id = ? ; `;
//   try {
//     db.query(q, [id, id, id], (err, result) => {
//       if (err) throw err;
//       console.log(result[0]);
//       res.json(result[0]);
//     });
//   } catch (error) {
//     console.log(error);
//   }
// });

// //______________________________________________ get  Specific Project Expenses vs Budget ______//

// app.get("/project-budget-expenses/:projectId", (req, res) => {
//   const projectId = req.params.projectId;

//   const budgetQuery = "SELECT budget FROM projects WHERE id = ?";
//   const expensesQuery = "SELECT expenses FROM projects WHERE id = ?";
//   // const expensesQuery = `
//   //   SELECT
//   //       COALESCE(SUM(e.amount), 0) + COALESCE(SUM(pr.quantity_used * i.pricePerUnit), 0) AS total_expenses
//   //   FROM
//   //       projects AS p
//   //   LEFT JOIN
//   //       expenses AS e ON p.id = e.project_id
//   //   LEFT JOIN
//   //       project_resources AS pr ON p.id = pr.project_id
//   //   LEFT JOIN
//   //       inventory AS i ON pr.resource_id = i.id
//   //   WHERE
//   //       p.id = ?
//   //   GROUP BY
//   //       p.id;
//   // `;

//   db.query(budgetQuery, [projectId], (err, budgetResult) => {
//     if (err) {
//       res.status(500).json({ error: err.message });
//       return;
//     }

//     // db.query(
//     //   expensesQuery,
//     //   [projectId, projectId, projectId],
//     //   (err, expensesResult) => {
//     //     if (err) {
//     //       res.status(500).json({ error: err.message });
//     //       return;
//     //     }
//     db.query(expensesQuery, [projectId], (err, expensesResult) => {
//       if (err) {
//         res.status(500).json({ error: err.message });
//         return;
//       }

//       const budget = budgetResult[0]?.budget || 0;
//       const expenses = expensesResult[0]?.expenses || 0;
//       console.log("budget=", budget, "expenses", expenses);

//       res.json({ budget, expenses });
//     });
//   });
// });

// //______________________________________________ get  ALL Project Expenses vs Budget ______//

// app.get("/projects-budget-expenses", (req, res) => {
//   const query = `
//     SELECT
//         p.id AS project_id,
//         p.name AS project_name,
//         p.budget,
//         COALESCE(e.total_expenses, 0) + COALESCE(pr.total_resource_cost, 0) AS total_expenses
//     FROM
//         projects AS p
//     LEFT JOIN
//         (
//             SELECT
//                 project_id,
//                 SUM(amount) AS total_expenses
//             FROM
//                 expenses
//             GROUP BY
//                 project_id
//         ) AS e ON p.id = e.project_id
//     LEFT JOIN
//         (
//             SELECT
//                 pr.project_id,
//                 SUM(pr.quantity_used * i.pricePerUnit) AS total_resource_cost
//             FROM
//                 project_resources AS pr
//             INNER JOIN
//                 inventory AS i ON pr.resource_id = i.id
//             GROUP BY
//                 pr.project_id
//         ) AS pr ON p.id = pr.project_id;
//   `;

//   db.query(query, (err, results) => {
//     if (err) {
//       res.status(500).json({ error: err.message });
//       return;
//     }
//     res.json(results);
//   });
// });

// app.get("/projects-task-status", (req, res) => {
//   const query = `
//     SELECT

//      p.name AS project_name,
//       t.name AS task_name,
//       t.status,
//       t.start_date,
//       t.end_date,
//       e.first_name AS assigned_to
//     FROM tasks t
//     JOIN projects p ON t.project_id = p.id
//     JOIN employees e ON t.assigned_to = e.id
//   `;

//   db.query(query, (err, results) => {
//     if (err) {
//       res.status(500).json({ error: "Error fetching task data" });
//     } else {
//       results.forEach((task) => {
//         task.start_date = moment(task.start_date).format("MMM Do YYYY");
//         // ("yyyy-MM-dd");
//         task.end_date = moment(task.end_date).format("MMM Do YYYY");
//       });
//       // Structure the data as expected by the frontend
//       const data = results.reduce((acc, row) => {
//         const project = acc.find((p) => p.name === row.project_name);
//         if (project) {
//           project.tasks.push({
//             name: row.task_name,
//             status: row.status,
//             start_date: row.start_date,
//             end_date: row.end_date,
//             assigned_to: row.assigned_to,
//           });
//         } else {
//           acc.push({
//             name: row.project_name,
//             tasks: [
//               {
//                 name: row.task_name,
//                 status: row.status,
//                 start_date: row.start_date,
//                 end_date: row.end_date,
//                 assigned_to: row.assigned_to,
//               },
//             ],
//           });
//         }
//         return acc;
//       }, []);

//       res.json(data);
//     }
//   });
// });
// -app.get("/count/projects", (req, res) => {
//   const q = ` SELECT COUNT(*) as projectsCount FROM projects  `;
//   try {
//     db.query(q, (err, result) => {
//       if (err) throw err;
//       console.log("Projects with status 'ongoing':", result);
//       res.json(result[0]);
//     });
//   } catch (error) {
//     console.log(error);
//   }
// });
// app.get("/completed/projects", (req, res) => {
//   console.log("API endpoint hit");

//   if (!db) {
//     console.error("Database connection not established");
//     return res.status(500).json({ error: "Database connection failed" });
//   }
//   const query = `SELECT COUNT(*) as completedCount FROM projects WHERE status = "Completed" `;
//   try {
//     db.query(query, (err, result) => {
//       if (err) {
//         console.error("Error executing query:", err);
//         return res.status(500).json({
//           error:
//             "An error occurred while fetching the completed projects count",
//         });
//       }
//       // Send the count of completed projects to the frontend
//       console.log("Projects with status 'Completed':", result);
//       res.json(result[0]);
//     });
//   } catch (error) {
//     console.log(error);
//   }
// });

// app.get("/pending/projects", (req, res) => {
//   const q = `SELECT COUNT(*) as pendingCount FROM projects WHERE status="Pending"`;
//   db.query(q, (err, result) => {
//     if (err) {
//       console.error("Error executing query:", err);
//       return res.status(500).json({
//         error: "An error occurred while fetching the pending projects count",
//       });
//     }
//     // Assuming 'result' is an array with one object containing the count
//     console.log("Projects with status 'pending':", result);
//     res.json(result[0]);
//   });
// });

// app.get("/ongoing/projects", (req, res) => {
//   const q = ` SELECT COUNT(*) as ongoingCount FROM projects WHERE status="Ongoing" `;
//   try {
//     db.query(q, (err, result) => {
//       if (err) throw err;
//       console.log("Projects with status 'ongoing':", result);
//       res.json(result[0]);
//     });
//   } catch (error) {
//     console.log(error);
//   }
// });

// // Add this route after your other project routes
// app.get("/projects/:id/employees", (req, res) => {
//   const { id } = req.params;
//   const query = `
//     SELECT
//       e.id,
//       e.first_name,
//       e.last_name,
//       e.role,
//       e.project_id
//     FROM employees e
//     WHERE e.project_id = ?
//   `;

//   try {
//     db.query(query, [id], (err, result) => {
//       if (err) {
//         console.error("Error fetching project employees:", err);
//         return res.status(500).json({
//           error: "An error occurred while fetching project employees",
//         });
//       }

//       // Transform the data for the frontend Select component
//       const formattedEmployees = result.map((employee) => ({
//         value: employee.id,
//         label: `${employee.first_name} ${employee.last_name} (${employee.role})`,
//       }));

//       console.log("Project employees:", formattedEmployees);
//       res.json(formattedEmployees);
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({
//       error: "Server error while fetching project employees",
//     });
//   }
// });

// /*=========================================================================================================================================================
// ===========================================================================================================================================================
// ==============================================    CRUD Routes for Suppliers   =============================================================================
// ===========================================================================================================================================================
// ===========================================================================================================================================================
// */

// //______________________________________________Get all Suppliers _____//

// app.get("/suppliers", (req, res) => {
//   try {
//     db.query("SELECT * FROM  suppliers ", (err, result) => {
//       if (err) throw err;
//       return res.json(result);
//     });
//   } catch (error) {
//     console.log(error);
//   }
// });

// //______________________________________________Get  Supplier By ID ____//

// app.get("/suppliers/:id", (req, res) => {
//   const { id } = req.params;
//   const q = "SELECT * FROM  suppliers WHERE id=?";
//   try {
//     db.query(q, [id], (err, result) => {
//       if (err) throw err;
//       res.json(result);
//     });
//   } catch (error) {
//     console.log(error);
//   }
// });

// //______________________________________________ Create   Suppliers _____//

// app.post("/suppliers", (req, res) => {
//   const { name, phone, email, address } = req.body;

//   const q =
//     "INSERT INTO suppliers (name, phone, email, address  ) values (?, ?, ?, ? )";
//   try {
//     db.query(q, [name, phone, email, address], (err, result) => {
//       if (err) throw err;
//       res.json(" New suppliers is added sucssfully:");
//       console.log(" New suppliers is added sucssfully:");
//     });
//   } catch (error) {
//     console.log(error);
//   }
// });

// //______________________________________________Update Supplier _______//

// app.put("/suppliers/:id", (req, res) => {
//   const { id } = req.params;
//   const value = [
//     req.body.name,
//     req.body.phone,
//     req.body.email,
//     req.body.address,
//   ];
//   const q =
//     "UPDATE suppliers SET name=? ,  phone=?, email =? ,  address=?  WHERE id=? ";
//   try {
//     db.query(q, [...value, id], (err, result) => {
//       if (err) throw err;
//       res.json(`suppliers with id  ${id}  is updated :`);
//     });
//   } catch (error) {
//     console.log(error);
//   }
// });

// //______________________________________________Delete supplier ______//

// app.delete("/suppliers/:id", (req, res) => {
//   const { id } = req.params;
//   const q = "DELETE FROM suppliers  WHERE id=?";
//   try {
//     db.query(q, [id], (err, result) => {
//       if (err) throw err;
//       return res.json(`suppliers with id  ${id}  is deleted :`);
//     });
//   } catch (error) {
//     console.log(error);
//   }
// });

// /*=========================================================================================================================================================
// ===========================================================================================================================================================
// ==============================================    CRUD Routes for Inventory   =============================================================================
// ===========================================================================================================================================================
// ===========================================================================================================================================================
// */

// //______________________________________________Get All Inventory _____//

// app.get("/inventory", (req, res) => {
//   try {
//     db.query("SELECT  * FROM inventory ", (err, result) => {
//       if (err) throw err;
//       return res.json(result);
//     });
//   } catch (error) {
//     console.log(error);
//   }
// });

// //______________________________________________Get  Inventory By ID ____//

// app.get("/inventory/:id", (req, res) => {
//   const { id } = req.params;
//   const q = "SELECT * FROM   inventory  WHERE id=?";
//   try {
//     db.query(q, [id], (err, result) => {
//       if (err) throw err;
//       res.json(result);
//     });
//   } catch (error) {
//     console.log(error);
//   }
// });

// //______________________________________________Create Inventory _______//

// app.post("/inventory", (req, res) => {
//   const { item_name, quantity, pricePerUnit, supplier_id } = req.body;
//   console.log(item_name, quantity, pricePerUnit, supplier_id);
//   const q =
//     "INSERT INTO inventory ( item_name, quantity,  pricePerUnit,  supplier_id) VALUES(?,?,?,?)";
//   try {
//     db.query(
//       q,
//       [item_name, quantity, pricePerUnit, supplier_id],
//       (err, result) => {
//         if (err) throw err;

//         res.json("invntory is added sucessfully:");
//       }
//     );
//   } catch (error) {
//     console.log(error);
//   }
// });

// //______________________________________________Update  Inventory _______//

// app.put("/inventory/:id", (req, res) => {
//   const { id } = req.params;

//   const values = [
//     req.body.supplier_id,
//     req.body.item_name,
//     req.body.quantity,
//     req.body.pricePerUnit,
//   ];

//   const q =
//     "UPDATE  inventory SET supplier_id=? ,  item_name=?, quantity=?, pricePerUnit=?  WHERE id= ? ";
//   try {
//     db.query(q, [...values, id], (err, result) => {
//       if (err) throw err;
//       res.json(`inventory having id ${id} is updated sucessfully `);
//     });
//   } catch (error) {
//     console.log(error);
//   }
// });

// //______________________________________________Delete  Inventory _______//

// app.delete("/inventory/:id", (req, res) => {
//   const { id } = req.params;
//   const q = "DELETE FROM inventory WHERE id=?";
//   try {
//     db.query(q, [id], (err, result) => {
//       if (err) throw err;

//       res.json(`inventory having id ${id} is deleted sucessfully `);
//     });
//   } catch (err) {
//     console.log(err);
//   }
// });

// /*=========================================================================================================================================================
// ===========================================================================================================================================================
// ==============================================    CRUD Routes for Employees   =============================================================================
// ===========================================================================================================================================================
// ===========================================================================================================================================================
// */

// //______________________________________________get all employees ________//
// // app.get("/employees", (req, res) => {
// //   const q = "SELECT  * FROM employees";
// //   try {
// //     db.query(q, (err, result) => {
// //       if (err) throw err;
// //       result.forEach((project) => {
// //         project.date_hired = moment(project.date_hired).format("YYYY-MM-DD");
// //       });

// //       return res.json(result);
// //     });
// //   } catch (error) {
// //     console.log(error);
// //   }
// // });

// app.get("/employees", (req, res) => {
//   const { project_id, search } = req.query; // Extract project_id from query parameters

//   let q = "SELECT * FROM employees ";
//   let params = [];

//   if (project_id) {
//     q += " WHERE project_id = ?";
//     params.push(project_id);
//   }
//   // Add search functionality
//   if (search) {
//     q += ` AND first_name LIKE "%${search}%"`;
//   }
//   try {
//     db.query(q, params, (err, result) => {
//       if (err) throw err;
//       result.forEach((employee) => {
//         employee.date_hired = moment(employee.date_hired).format("YYYY-MM-DD");
//       });
//       console.log(result);
//       return res.json(result);
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });

// //______________________________________________ Get  employees By ID ___//
// app.get("/employees/:id", (req, res) => {
//   const { id } = req.params;
//   const q = "SELECT * FROM  employees WHERE id=?";
//   try {
//     db.query(q, [id], (err, result) => {
//       if (err) throw err;
//       result.forEach((employee) => {
//         employee.date_hired = moment(employee.date_hired).format("MMM Do YYYY");
//       });
//       res.json(result);
//     });
//   } catch (error) {
//     console.log(error);
//   }
// });

// //______________________________________________ Create  employees ______//
// app.post("/employees", (req, res) => {
//   const value = [
//     req.body.first_name,
//     req.body.last_name,
//     req.body.role,
//     req.body.phone,
//     req.body.email,
//     req.body.address,
//     req.body.salary,
//     req.body.project_id,
//     req.body.date_hired,
//   ];
//   console.log(value);
//   const q = `INSERT INTO
//   employees (
//     first_name,
//     last_name,
//     role,
//     phone,
//     email,
//     address,
//     salary,
//     project_id,
//     date_hired
//   )
// VALUES
//   (?)`;
//   try {
//     db.query(q, [value], (err, result) => {
//       if (err) throw err;
//       console.log(result);
//       return res.json(result);
//     });
//   } catch (error) {
//     console.log(error);
//   }
// });

// //______________________________________________ Update employees ______//
// app.put("/employees/:id", (req, res) => {
//   const { id } = req.params;
//   const value = [
//     req.body.first_name,
//     req.body.last_name,
//     req.body.role,
//     req.body.phone,
//     req.body.email,
//     req.body.address,
//     req.body.salary,
//     req.body.project_id,
//     req.body.date_hired,
//   ];
//   console.log(value);
//   const q = `UPDATE employees
// SET
//   first_name = ?,
//   last_name = ?,
//   role = ?,
//   phone = ?,
//   email = ?,
//   address = ?,
//   salary = ?,
//   project_id = ?,
//   date_hired = ?
// WHERE
//   id = ?`;
//   try {
//     db.query(q, [...value, id], (err, result) => {
//       if (err) throw err;
//       res.json(`employee with id "${id}" upadted sucessfully!!`);
//     });
//   } catch (error) {
//     console.log(error);
//   }
// });
// //______________________________________________ Delete  employees _____//
// app.delete("/employees/:id", (req, res) => {
//   const { id } = req.params;
//   const q = "DELETE FROM employees WHERE id=?";
//   try {
//     db.query(q, [id], (err, result) => {
//       if (err) throw err;
//       return res.json(`employees with id " ${id} " is deleted:`);
//     });
//   } catch (error) {
//     console.log(error);
//   }
// });

// /*=========================================================================================================================================================
// ===========================================================================================================================================================
// ==============================================    CRUD Routes for Task   =============================================================================
// ===========================================================================================================================================================
// ===========================================================================================================================================================
// */

// //______________________________________________get all Task ________//
// // app.get("/task", (req, res) => {
// //   const q = "SELECT  * FROM tasks";
// //   try {
// //     db.query(q, (err, result) => {
// //       if (err) throw err;
// //       result.forEach((task) => {
// //         task.start_date = moment(task.start_date).format("YYYY-MM-DD");
// //         task.end_date = moment(task.end_date).format("YYYY-MM-DD");
// //       });
// //       console.log("result===", result);
// //       return res.json(result);
// //     });
// //   } catch (error) {
// //     console.log(error);
// //   }
// // });
// // app.get("/task", (req, res) => {
// //   const {
// //     status,
// //     project_id,
// //     assigned_to,
// //     page = 1,
// //     limit = 10,
// //     sortField = "id",
// //     sortOrder = "ASC",
// //     search,
// //   } = req.query;
// //   let params = [];
// //   console.log("serach =", search);
// //   let query = "SELECT * FROM tasks WHERE 1=1";
// //   if (search) {
// //     q = `SELECT * FROM tasks WHERE name LIKE "%${search}%" `;
// //     // params.push(search);
// //   }
// //   // Add filters
// //   if (status) {
// //     query += ` AND status='${status}'`;
// //   }
// //   if (project_id) {
// //     query += ` AND project_id='${project_id}'`;
// //   }
// //   if (assigned_to) {
// //     query += ` AND assigned_to='${assigned_to}'`;
// //   }

// //   // Add sorting
// //   query += ` ORDER BY ${sortField} ${sortOrder}`;

// //   // Add pagination
// //   const offset = (page - 1) * limit;
// //   query += ` LIMIT ${limit} OFFSET ${offset}`;

// //   // Execute the query
// //   db.query(query, (err, result) => {
// //     if (err) throw err;
// //     result.forEach((task) => {
// //       task.start_date = moment(task.start_date).format("YYYY-MM-DD");
// //       task.end_date = moment(task.end_date).format("YYYY-MM-DD");
// //     });
// //     console.log("task serach result=", result);
// //     res.json(result);
// //   });
// // });

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

//   // let query = "SELECT * FROM tasks WHERE 1=1";
//   let query = "SELECT * FROM tasks "; // Base query

//   // Add search functionality
//   if (project_id) {
//     query += `WHERE project_id= ${project_id}`;
//   }
//   if (search) {
//     query += ` AND name LIKE "%${search}%"`;
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

//     // Format date fields
//     result.forEach((task) => {
//       task.start_date = moment(task.start_date).format("YYYY-MM-DD");
//       task.end_date = moment(task.end_date).format("YYYY-MM-DD");
//     });
//     console.log(result);
//     res.json(result);
//   });
// });

// //______________________________________________ Get  Task By ID ___//

// app.get("/task/:id", (req, res) => {
//   const { id } = req.params;
//   const q = "SELECT * FROM  tasks WHERE id=?";
//   try {
//     db.query(q, [id], (err, result) => {
//       if (err) throw err;
//       console.log("task update:", result);
//       result.forEach((task) => {
//         task.start_date = moment(task.start_date).format("YYYY-MM-DD");
//         task.end_date = moment(task.end_date).format("YYYY-MM-DD");
//       });
//       res.json(result);
//     });
//   } catch (error) {
//     console.log(error);
//   }
// });

// //______________________________________________ Create  Task ______//
// app.post("/task", (req, res) => {
//   console.log("req.body", req.body);
//   const value = [
//     req.body.project_id,
//     req.body.name,
//     req.body.description,
//     req.body.assigned_to,
//     req.body.start_date,
//     req.body.end_date,
//     req.body.status,
//     req.body.priority,
//   ];
//   console.log(value);
//   const q =
//     "INSERT INTO tasks  ( project_id  , name , description , assigned_to,  start_date,  end_date, status,  priority )  VALUES (?)";
//   try {
//     db.query(q, [value], (err, result) => {
//       if (err) throw err;
//       console.log(result);
//       return res.json(result);
//     });
//   } catch (error) {
//     console.log(error);
//   }
// });

// //______________________________________________ Update Task ______//
// app.put("/task/:id", (req, res) => {
//   const { id } = req.params;
//   const value = [
//     req.body.project_id,
//     req.body.name,
//     req.body.description,
//     req.body.assigned_to,
//     req.body.start_date,
//     req.body.end_date,
//     req.body.status,
//     req.body.priority,
//   ];
//   console.log(value);
//   const q = `UPDATE tasks
// SET
//   project_id = ?,
//   name = ?,
//   description = ?,
//   assigned_to = ?,
//   start_date = ?,
//   end_date = ?,
//   status = ?,
//   priority = ?
// WHERE
//   id = ?`;
//   try {
//     db.query(q, [...value, id], (err, result) => {
//       if (err) throw err;
//       res.json(`task with id "${id}" upadted sucessfully!!`);
//     });
//   } catch (error) {
//     console.log(error);
//   }
// });
// //______________________________________________ Delete  Task _____//

// app.delete("/task/:id", (req, res) => {
//   const { id } = req.params;
//   console.log("id=", id);
//   const q = "DELETE FROM tasks WHERE id=?";
//   try {
//     db.query(q, [id], (err, result) => {
//       if (err) throw err;
//       return res.json(`task with id " ${id} " is deleted:`);
//     });
//   } catch (error) {
//     console.log(error);
//   }
// });

// /*=========================================================================================================================================================
// ===========================================================================================================================================================
// ==============================================    CRUD Routes for Project Resourses  =============================================================================
// ===========================================================================================================================================================
// ===========================================================================================================================================================
// */

// //______________________________________________get all Project Resources ________//

// app.get("/projectResources", (req, res) => {
//   const { project_id, search } = req.query; // Extract project_id from query parameters

//   let q = `SELECT project_resources.id,
//   name,
//   item_name,
//   quantity_used
// FROM   project_resources
//   INNER JOIN projects
//           ON projects.id = project_resources.project_id
//   INNER JOIN inventory
//           ON inventory.id = project_resources.resource_id
// ORDER  BY project_resources.id `;

//   let params = [];

//   if (project_id) {
//     q = `SELECT project_resources.id,
//        name,
//        item_name,
//        quantity_used
// FROM   project_resources
//        INNER JOIN projects
//                ON projects.id = project_resources.project_id
//        INNER JOIN inventory
//                ON inventory.id = project_resources.resource_id
// WHERE  project_resources.project_id = ?
// ORDER  BY project_resources.id;
// `;
//     params.push(project_id);
//   }
//   if (project_id && search) {
//     q = `SELECT project_resources.id,
//        name,
//        item_name,
//        quantity_used
// FROM   project_resources
//        INNER JOIN projects
//                ON projects.id = project_resources.project_id
//        INNER JOIN inventory
//                ON inventory.id = project_resources.resource_id
// WHERE  project_resources.project_id = ${project_id} item_name LIKE "%${search}%"
// ORDER  BY project_resources.id;

// `;
//     params.push(project_id, search);
//   }

//   try {
//     db.query(q, params, (err, result) => {
//       if (err) throw err;

//       console.log("all project_Resources ===", result);
//       return res.json(result);
//     });
//   } catch (error) {
//     console.log(error);
//   }
// });
// //______________________________________________ Get  Project Resources By ID ___//
// app.get("/projectResources/:id", (req, res) => {
//   const { id } = req.params;
//   const q = "SELECT * FROM project_resources  WHERE id=?";
//   try {
//     db.query(q, [id], (err, result) => {
//       if (err) throw err;

//       console.log(` Project Resources  with id: ${id}=`, result);
//       res.json(result);
//     });
//   } catch (error) {
//     console.log(error);
//   }
// });

// //______________________________________________ Create  Project Resources ______//
// app.post("/projectResources", (req, res) => {
//   const value = [
//     req.body.project_id,
//     req.body.resource_id,
//     req.body.quantity_used,
//   ];
//   console.log("value=", value);
//   const q =
//     "INSERT INTO project_resources  ( project_id  ,  resource_id,  quantity_used )  VALUES (?)";
//   try {
//     db.query(q, [value], (err, result) => {
//       if (err) throw err;
//       console.log(result);
//       return res.json(
//         `new resource having id ${req.body.resource_id} for project having id:${req.body.project_id} is added`
//       );
//     });
//   } catch (error) {
//     console.log(error);
//   }
// });

// //______________________________________________ Update Project Resources ______//
// app.put("/projectResources/:id", (req, res) => {
//   const { id } = req.params;
//   const value = [
//     req.body.project_id,
//     req.body.resource_id,
//     req.body.quantity_used,
//   ];
//   console.log("update value", value);
//   const q = `UPDATE project_resources SET project_id=? , resource_id=? , quantity_used=?  WHERE id=?`;
//   try {
//     db.query(q, [...value, id], (err, result) => {
//       if (err) throw err;
//       res.json(` project Resources with id "${id}" upadted sucessfully!!`);
//     });
//   } catch (error) {
//     console.log(error);
//   }
// });
// //______________________________________________ Delete  Project Resources _____//

// app.delete("/projectResources/:id", (req, res) => {
//   const { id } = req.params;
//   console.log("id=", id);
//   const q = "DELETE FROM project_resources  WHERE id=?";
//   try {
//     db.query(q, [id], (err, result) => {
//       if (err) throw err;
//       return res.json(`project resources with id " ${id} " is deleted:`);
//     });
//   } catch (error) {
//     console.log(error);
//   }
// });

// /*=========================================================================================================================================================
// ===========================================================================================================================================================
// ==============================================    CRUD Routes for Expenses  =============================================================================
// ===========================================================================================================================================================
// ===========================================================================================================================================================
// */

// //______________________________________________get all Expenses________//

// app.get("/expenses", (req, res) => {
//   const q = `SELECT * FROM expenses `;
//   try {
//     db.query(q, (err, result) => {
//       if (err) throw err;

//       result.forEach((expenses) => {
//         expenses.date = moment(expenses.date).format("MMM Do YYYY");
//       });
//       console.log("all expenses ===", result);

//       return res.json(result);
//     });
//   } catch (error) {
//     console.log(error);
//   }
// });
// //______________________________________________ Get  Expenses By ID ___//
// app.get("/expenses/:id", (req, res) => {
//   const { id } = req.params;
//   const q = "SELECT * FROM expenses  WHERE id=?";
//   try {
//     db.query(q, [id], (err, result) => {
//       if (err) throw err;
//       result.forEach((expenses) => {
//         expenses.date = moment(expenses.date).format("YYYY-MM-DD");
//       });

//       console.log(` expenses  with id: ${id}=`, result);
//       res.json(result);
//     });
//   } catch (error) {
//     console.log(error);
//   }
// });

// //______________________________________________ Create  Expenses ______//
// app.post("/expenses", (req, res) => {
//   const value = [
//     req.body.project_id,
//     req.body.amount,
//     req.body.description,
//     req.body.date,
//   ];
//   console.log("value=", value);
//   const q =
//     "INSERT INTO expenses ( project_id  ,  amount ,  description , date  )  VALUES (?)";
//   try {
//     db.query(q, [value], (err, result) => {
//       if (err) throw err;
//       console.log(result);
//       return res.json(
//         `new expenses  for project having id:${req.body.project_id} is added`
//       );
//     });
//   } catch (error) {
//     console.log(error);
//   }
// });

// //______________________________________________ Update Expenses ______//
// app.put("/expenses/:id", (req, res) => {
//   const { id } = req.params;
//   const value = [
//     req.body.project_id,
//     req.body.amount,
//     req.body.description,
//     req.body.date,
//   ];
//   console.log("update value", value);
//   const q = `UPDATE expenses SET project_id=? , amount=? , description=?,  date=?  WHERE id=?`;
//   try {
//     db.query(q, [...value, id], (err, result) => {
//       if (err) throw err;
//       res.json(` expenses with id "${id}" upadted sucessfully!!`);
//     });
//   } catch (error) {
//     console.log(error);
//   }
// });
// //______________________________________________ Delete  Expenses _____//

// app.delete("/expenses/:id", (req, res) => {
//   const { id } = req.params;
//   console.log("id=", id);
//   const q = "DELETE FROM expenses  WHERE id=?";
//   try {
//     db.query(q, [id], (err, result) => {
//       if (err) throw err;
//       return res.json(`expenses with id " ${id} " is deleted:`);
//     });
//   } catch (error) {
//     console.log(error);
//   }
// });
/*=========================================================================================================================================================
===========================================================================================================================================================
==============================================    CRUD Routes for Documents   =============================================================================
===========================================================================================================================================================
===========================================================================================================================================================
*/
const express = require("express");
const mysql = require("mysql2");
const moment = require("moment");
const cors = require("cors");
const dotenv = require("dotenv");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");
const session = require("express-session");

// Load environment variables
dotenv.config();
// dotenv.config({ debug: true });

const app = express();
const port = process.env.PORT || 8080;

// Middleware
// app.use(cors()); // middleware enable express to recive data from the react frontend
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  })
);

app.use(express.urlencoded({ extended: true })); //middleware enable express to understand urlencoded data
app.use(express.json()); // middleware enable express to understand json data

// Add request logging middleware here
app.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.url}`);
  next();
});

// Session configuration
app.use(
  session({
    secret: process.env.SESSION_SECRET || "your-secret-key-here",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  })
);

// Passport initialization
app.use(passport.initialize());
app.use(passport.session());

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

// Passport configuration
passport.use(
  new LocalStrategy(
    { usernameField: "email" },
    async (email, password, done) => {
      try {
        db.query(
          "SELECT * FROM users WHERE email = ?",
          [email],
          async (err, results) => {
            if (err) return done(err);

            if (results.length === 0) {
              return done(null, false, {
                message: "Incorrect email or password.",
              });
            }

            const user = results[0];
            const isMatch = await bcrypt.compare(password, user.password);

            if (!isMatch) {
              return done(null, false, {
                message: "Incorrect email or password.",
              });
            }

            return done(null, user);
          }
        );
      } catch (err) {
        return done(err);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  db.query(
    "SELECT id, email, first_name, last_name FROM users WHERE id = ?",
    [id],
    (err, results) => {
      if (err) return done(err);
      done(null, results[0]);
    }
  );
});

// Authentication middleware
const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: "Unauthorized" });
};
// const express = require("express");
// const mysql = require("mysql2");
// const moment = require("moment");
// const cors = require("cors");
// const dotenv = require("dotenv");
// const passport = require("passport");
// const LocalStrategy = require("passport-local").Strategy;
// const bcrypt = require("bcryptjs");
// const session = require("express-session");
// const helmet = require("helmet"); // Added for security headers
// const rateLimit = require("express-rate-limit"); // Added for rate limiting

// // Load environment variables with enhanced configuration
// // dotenv.config({ path: `.env.${process.env.NODE_ENV || "development"}` });
// // // Load environment variables
// dotenv.config();
// // dotenv.config({ debug: true });
// const app = express();
// const port = process.env.PORT || 8080;

// // Enhanced security middleware
// app.use(helmet());
// app.use(express.json({ limit: "10kb" }));
// app.use(express.urlencoded({ extended: true, limit: "10kb" }));

// // Rate limiting for API endpoints
// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 100, // limit each IP to 100 requests per windowMs
// });
// app.use(limiter);

// // CORS configuration with enhanced security
// app.use(
//   cors({
//     origin: process.env.FRONTEND_URL || "http://localhost:3000",
//     credentials: true,
//     methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
//     allowedHeaders: ["Content-Type", "Authorization"],
//   })
// );

// // Enhanced request logging middleware
// app.use((req, res, next) => {
//   console.log(
//     `[${new Date().toISOString()}] ${req.method} ${req.url} ${
//       req.user ? `(User: ${req.user.id})` : ""
//     }`
//   );
//   next();
// });

// // Session configuration with enhanced security
// app.use(
//   session({
//     name: "cpms.sid",
//     secret:
//       process.env.SESSION_SECRET ||
//       require("crypto").randomBytes(64).toString("hex"),
//     resave: false,
//     saveUninitialized: false,
//     cookie: {
//       secure: process.env.NODE_ENV === "production",
//       httpOnly: true,
//       sameSite: "lax",
//       maxAge: 24 * 60 * 60 * 1000, // 24 hours
//     },
//   })
// );

// // Passport initialization
// app.use(passport.initialize());
// app.use(passport.session());

// // Database connection with error handling
// const db = mysql.createConnection({
//   host: process.env.DB_HOST,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_NAME,
//   multipleStatements: false, // Prevent SQL injection
// });

// db.connect((err) => {
//   if (err) {
//     console.error("Database connection failed:", err);
//     process.exit(1);
//   }
//   console.log("MySQL connected successfully");
// });

// // Enhanced Passport configuration with error handling
// passport.use(
//   new LocalStrategy(
//     {
//       usernameField: "email",
//       passReqToCallback: true,
//     },
//     async (req, email, password, done) => {
//       try {
//         db.query(
//           "SELECT * FROM users WHERE email = ?",
//           [email],
//           async (err, results) => {
//             if (err) return done(err);

//             if (results.length === 0) {
//               return done(null, false, {
//                 message: "Incorrect email or password.",
//               });
//             }

//             const user = results[0];
//             const isMatch = await bcrypt.compare(password, user.password);

//             if (!isMatch) {
//               return done(null, false, {
//                 message: "Incorrect email or password.",
//               });
//             }

//             return done(null, user);
//           }
//         );
//       } catch (err) {
//         return done(err);
//       }
//     }
//   )
// );

// // Serialize/Deserialize user with session management
// passport.serializeUser((user, done) => {
//   done(null, user.id);
// });

// passport.deserializeUser((id, done) => {
//   db.query(
//     "SELECT id, email, first_name, last_name FROM users WHERE id = ?",
//     [id],
//     (err, results) => {
//       if (err) return done(err);
//       done(null, results[0]);
//     }
//   );
// });

// // Enhanced authentication middleware with role checking
// const isAuthenticated = (req, res, next) => {
//   if (req.isAuthenticated()) {
//     return next();
//   }
//   res.status(401).json({ message: "Unauthorized" });
// };

// // Helper function to verify user ownership of a resource
// const verifyOwnership = (table, id, userId, callback) => {
//   const query = `SELECT id FROM ${table} WHERE id = ? AND user_id = ?`;
//   db.query(query, [id, userId], (err, results) => {
//     if (err) return callback(err);
//     if (results.length === 0)
//       return callback(new Error("Resource not found or access denied"));
//     callback(null, true);
//   });
// };

// ======================== AUTHENTICATION ROUTES ======================== //
// (Existing auth routes remain unchanged but are now more secure)
// ... [Previous auth routes implementation remains the same]
// Configure multer for file uploads
// // ======================== AUTHENTICATION ROUTES ======================== //

// Signup route
app.post("/auth/signup", async (req, res) => {
  const { email, password, firstName, lastName } = req.body;

  if (!email || !password || !firstName || !lastName) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    db.query(
      "SELECT * FROM users WHERE email = ?",
      [email],
      async (err, results) => {
        if (err) throw err;

        if (results.length > 0) {
          return res.status(400).json({ message: "Email already in use" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = {
          email,
          password: hashedPassword,
          first_name: firstName,
          last_name: lastName,
        };

        db.query("INSERT INTO users SET ?", newUser, (err, result) => {
          if (err) throw err;

          req.login({ id: result.insertId, ...newUser }, (err) => {
            if (err) throw err;
            res.json({
              success: true,
              user: {
                id: result.insertId,
                email: newUser.email,
                firstName: newUser.first_name,
                lastName: newUser.last_name,
              },
            });
          });
        });
      }
    );
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error during signup" });
  }
});

// Login route
app.post("/auth/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) return next(err);
    if (!user) {
      return res.status(401).json({ message: info.message });
    }
    req.login(user, (err) => {
      if (err) return next(err);
      return res.json({
        success: true,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.first_name,
          lastName: user.last_name,
        },
      });
    });
  })(req, res, next);
});

// Logout route
app.post("/auth/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ message: "Error logging out" });
    }
    res.json({ success: true, message: "Logged out successfully" });
  });
});

// Check authentication status
app.get("/auth/status", (req, res) => {
  if (req.isAuthenticated()) {
    res.json({
      isAuthenticated: true,
      user: {
        id: req.user.id,
        email: req.user.email,
        firstName: req.user.first_name,
        lastName: req.user.last_name,
      },
    });
  } else {
    res.json({ isAuthenticated: false, user: null });
  }
});

// Add this route after your other authentication routes
app.post("/auth/change-password", isAuthenticated, async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const userId = req.user.id;

  try {
    // Get user from database
    db.query(
      "SELECT * FROM users WHERE id = ?",
      [userId],
      async (err, results) => {
        if (err) {
          console.error("Database error:", err);
          return res.status(500).json({ message: "Server error" });
        }

        if (results.length === 0) {
          return res.status(404).json({ message: "User not found" });
        }

        const user = results[0];

        // Verify old password
        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
          return res
            .status(400)
            .json({ message: "Current password is incorrect" });
        }

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // Update password in database
        db.query(
          "UPDATE users SET password = ? WHERE id = ?",
          [hashedPassword, userId],
          (updateErr) => {
            if (updateErr) {
              console.error("Password update error:", updateErr);
              return res
                .status(500)
                .json({ message: "Error updating password" });
            }

            res.json({ message: "Password changed successfully" });
          }
        );
      }
    );
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

app.listen(port, () => {
  console.log(`app is listening at port ${port}`);
});
app.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.url}`);
  next();
});
// app.get("/", (req, res) => {
//   res.send("Welcome to CPMS");
// });
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Set up storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = "uploads/";
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB limit
});

function formatFileSize(bytes) {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

//______________________________________________ Upload Document ______//
app.post(
  "/projects/:projectId/documents",
  isAuthenticated, // Added: Authentication middleware
  upload.single("file"),
  async (req, res) => {
    const { projectId } = req.params;
    const { description } = req.body;
    const file = req.file;
    const userId = req.user.id; // Added: Get user ID from authenticated session

    if (!file) {
      // Added: Consistent error handling for no file
      return res.status(400).json({ error: "No file uploaded" });
    }

    // Basic validation for project ID (optional, but good practice)
    if (!projectId || isNaN(projectId)) {
      if (file && file.path) {
        fs.unlinkSync(file.path); // Clean up file on validation failure
      }
      return res.status(400).json({ error: "Invalid project ID" });
    }

    try {
      const q = `INSERT INTO documents
               (project_id,  uploaded_by,  name, file_type, file_extension, file_path, file_size,  description)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

      const fileExt = path.extname(file.originalname).slice(1).toLowerCase();

      db.query(
        q,
        [
          projectId,
          userId, // user_id is correctly added here from req.user.id
          file.originalname,
          file.mimetype,
          fileExt,
          file.path,
          file.size,
          description || null,
        ],
        (err, result) => {
          if (err) {
            console.error("Error saving document:", err);
            // Clean up the uploaded file if DB operation fails
            if (file && file.path) {
              fs.unlinkSync(file.path);
            }
            // Added: Consistent error handling for DB error
            return res.status(500).json({ error: "Failed to save document" });
          }

          // Added: Consistent success response
          res.status(201).json({
            message: "Document uploaded successfully",
            documentId: result.insertId,
          });
        }
      );
    } catch (error) {
      console.error("Error in document upload:", error);
      if (file && file.path) {
        fs.unlinkSync(file.path); // Clean up file on error
      }
      // Added: Consistent error handling for server error
      res.status(500).json({ error: "Server error during document upload" });
    }
  }
);

//______________________________________________ Get All Documents for Project ______//
app.get("/projects/:projectId/documents", isAuthenticated, (req, res) => {
  // Added: Authentication middleware
  const { projectId } = req.params;
  const userId = req.user.id; // Added: Get user ID from authenticated session

  // Added: Filter documents by project_id AND uploaded_by
  const q = `SELECT id, name, file_type, file_size, upload_date, description, download_count
             FROM documents
             WHERE project_id = ? AND uploaded_by = ?
             ORDER BY upload_date DESC`;
  console.log(
    "Fetching documents for project:",
    projectId,
    " for user:",
    userId
  ); // Added: Log user ID

  db.query(q, [projectId, userId], (err, results) => {
    // Added: Pass userId to query parameters
    if (err) {
      console.error("Error fetching documents:", err);
      // Added: Consistent error handling for DB error
      return res.status(500).json({ error: "Failed to fetch documents" });
    }

    // Format dates and file sizes for better readability
    const formattedResults = results.map((doc) => ({
      ...doc,
      upload_date: new Date(doc.upload_date).toISOString(), // Keep ISO string or format as needed by frontend
      file_size: formatFileSize(doc.file_size),
    }));

    res.json(formattedResults);
  });
});

//______________________________________________ Download Document ______//
app.get("/documents/:id/download", isAuthenticated, (req, res) => {
  // Added: Authentication middleware
  const { id } = req.params;
  const userId = req.user.id; // Added: Get user ID from authenticated session

  // Added: First get the document details, filtered by document ID AND uploaded_by
  const getQuery = `SELECT name, file_path, file_type, is_secure FROM documents WHERE id = ? AND uploaded_by = ?`;

  db.query(getQuery, [id, userId], (err, results) => {
    // Added: Pass userId to query parameters
    if (err) {
      console.error("Error fetching document:", err);
      // Added: Consistent error handling for DB error
      return res.status(500).json({ error: "Failed to fetch document" });
    }

    if (results.length === 0) {
      // Added: Return 404 if document not found or doesn't belong to the user
      return res.status(404).json({
        error: "Document not found or you do not have permission to access it",
      });
    }

    const document = results[0];
    const filePath = path.resolve(document.file_path);

    // Check if file exists on the filesystem
    if (!fs.existsSync(filePath)) {
      // Added: Consistent error handling if file is missing on server
      console.error(`File not found on server: ${filePath}`);
      return res.status(500).json({ error: "File not found on server" }); // Use 500 because the DB record exists but the file is missing
    }

    // Increment download count (non-blocking)
    // Added: Download count update remains, no user_id filter needed here as we already verified ownership above
    db.query(
      "UPDATE documents SET download_count = download_count + 1 WHERE id = ?",
      [id],
      (updateErr) => {
        if (updateErr) {
          console.error("Failed to update download count:", updateErr);
          // Don't fail the request if count update fails
        }
      }
    );

    // Set appropriate headers
    res.setHeader("Content-Type", document.file_type);
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${encodeURIComponent(document.name)}"` // Added: encodeURIComponent for safety
    );

    // Create read stream and pipe to response
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);

    // Handle stream errors
    fileStream.on("error", (err) => {
      console.error("File stream error:", err);
      // Added: Consistent error handling for stream errors
      res.status(500).json({ error: "Error streaming file" });
    });
  });
});

//______________________________________________ Delete Document ______//
app.delete("/documents/:id", isAuthenticated, (req, res) => {
  // Added: Authentication middleware
  const { id } = req.params;
  const userId = req.user.id; // Added: Get user ID from authenticated session

  // Added: First get the document details, filtered by document ID AND uploaded_by
  const getQuery = `SELECT file_path FROM documents WHERE id = ? AND uploaded_by = ?`;

  db.query(getQuery, [id, userId], (err, results) => {
    // Added: Pass userId to query parameters
    if (err) {
      console.error("Error fetching document for deletion:", err);
      // Added: Consistent error handling for DB error
      return res
        .status(500)
        .json({ error: "Failed to fetch document for deletion" });
    }

    if (results.length === 0) {
      // Added: Return 404 if document not found or doesn't belong to the user
      return res.status(404).json({
        error: "Document not found or you do not have permission to delete it",
      });
    }

    const document = results[0];

    // Delete the file from filesystem if file_path exists and the file exists
    if (document.file_path) {
      const filePath = path.resolve(document.file_path); // Added: Resolve the absolute path
      if (fs.existsSync(filePath)) {
        // Added: Check if file actually exists before trying to delete
        fs.unlink(filePath, (err) => {
          if (err) {
            console.error("Error deleting file:", err);
            // Added: Consistent error handling for file deletion error
            // Decide if you want to stop here or try to delete the DB record anyway
            // For data consistency, it's often better to stop if the file can't be deleted.
            return res
              .status(500)
              .json({ error: "Failed to delete document file" });
          }

          // File deleted successfully, now delete the DB record
          deleteDocumentRecord(id, userId, res); // Added: Pass userId to deleteDocumentRecord
        });
      } else {
        console.warn(
          `File not found on filesystem for document ID ${id}, proceeding with DB record deletion.`
        );
        // File reference exists in DB but file is missing on disk.
        // Proceed to delete the DB record to clean up.
        deleteDocumentRecord(id, userId, res); // Added: Pass userId to deleteDocumentRecord
      }
    } else {
      // No file_path, just delete the record
      deleteDocumentRecord(id, userId, res); // Added: Pass userId to deleteDocumentRecord
    }
  });
});

// Helper function to delete document record
// Added: accept userId parameter
function deleteDocumentRecord(id, userId, res) {
  // Added: Filter deletion by document ID AND uploaded_by
  const deleteQuery = `DELETE FROM documents WHERE id = ? AND uploaded_by = ?`;

  db.query(deleteQuery, [id, userId], (err, result) => {
    // Added: Pass userId to query parameters
    if (err) {
      console.error("Error deleting document record:", err);
      // Added: Consistent error handling for DB error
      return res
        .status(500)
        .json({ error: "Failed to delete document record" });
    }

    // The initial SELECT already checked for ownership, so affectedRows should be 1 if found.
    // If affectedRows is 0, something went wrong or the record was deleted between select and delete.
    if (result.affectedRows === 0) {
      // This case should ideally not be hit if the initial SELECT passed, but as a safeguard:
      console.warn(
        `Document record with ID ${id} and user ID ${userId} not found for deletion after file check.`
      );
      return res
        .status(404)
        .json({ error: "Document record not found or already deleted." });
    }

    // Added: Consistent success response
    res.json({ message: "Document deleted successfully" });
  });
}

// Note: There are no explicit PUT (Update) routes for documents in the original code,
// so no changes are made for a PUT operation here.
/*=========================================================================================================================================================
===========================================================================================================================================================
==============================================    CRUD Routes for Projects   ==============================================================================
===========================================================================================================================================================
===========================================================================================================================================================
*/

//______________________________________________ Get all Projects __________//
app.get("/projects", isAuthenticated, (req, res) => {
  // Added: Authentication middleware
  const { search } = req.query;
  const userId = req.user.id; // Added: Get user ID from authenticated session

  let q = "SELECT * FROM projects WHERE user_id = ?"; // Added: Filter by user_id
  let params = [userId]; // Added: Add userId to parameters

  // Add search functionality
  if (search) {
    q += ` AND name LIKE ?`; // Added: Add search condition
    params.push(`%${search}%`); // Added: Add search term to parameters
  }

  try {
    db.query(q, params, (err, result) => {
      // Added: Pass parameters to the query
      if (err) {
        console.error("Error fetching projects:", err); // Added: Log error
        return res.status(500).json({ error: "Failed to fetch projects" }); // Added: Consistent error handling
      }
      // Format date using moment //  "MMMM DoYYYY, h:mm:ss a"
      result.forEach((project) => {
        // Assuming these formats are for display; adjust if needed by frontend
        project.start_date = moment(project.start_date).format("MMM Do YYYY");
        project.end_date = project.end_date
          ? moment(project.end_date).format("MMM Do YYYY")
          : null; // Handle potential null end_date
      });
      console.log("Fetched projects for user", userId, ":", result.length); // Added: Log user ID and result count
      return res.json(result);
    });
  } catch (error) {
    console.error("Server error fetching projects:", error); // Added: Log server error
    res.status(500).json({ error: "Internal Server Error" }); // Added: Consistent error handling
  }
});

//______________________________________________Get Projects By ID________//
app.get("/projects/:id", isAuthenticated, (req, res) => {
  // Added: Authentication middleware
  const { id } = req.params;
  const userId = req.user.id; // Added: Get user ID from authenticated session

  // Added: Filter by project ID AND user_id
  const q = "SELECT * FROM projects WHERE id=? AND user_id = ?";

  db.query(q, [id, userId], (err, result) => {
    // Added: Pass userId to parameters
    if (err) {
      console.error("Error fetching project by ID:", err); // Added: Log error
      return res.status(500).json({ error: "Failed to fetch project" }); // Added: Consistent error handling
    }

    if (result.length === 0) {
      // Added: Return 404 if project not found or doesn't belong to the user
      return res.status(404).json({
        error: "Project not found or you do not have permission to access it",
      });
    }

    // Format date using moment //  "MMMM DoYYYY, h:mm:ss a"
    result.forEach((project) => {
      // Assuming these formats are for display; adjust if needed by frontend
      project.start_date = moment(project.start_date).format("YYYY-MM-DD");
      project.end_date = project.end_date
        ? moment(project.end_date).format("YYYY-MM-DD")
        : null; // Handle potential null end_date
    });
    console.log("Fetched project", id, "for user", userId); // Added: Log user ID
    res.json(result[0]); // Assuming id returns a single project
  });
});

//______________________________________________ Create Projects _______//
app.post("/projects", isAuthenticated, (req, res) => {
  // Added: Authentication middleware
  const userId = req.user.id; // Added: Get user ID from authenticated session

  const {
    name,
    description,
    location,
    start_date,
    end_date,
    status,
    budget,
    expenses, // expenses might be calculated or default to 0, depends on frontend/DB logic
  } = req.body;

  // Added: Add user_id to the list of columns and values
  const q = `INSERT INTO
  projects (
    user_id,       
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

  const value = [
    userId, // Added: user_id value
    name,
    description,
    location,
    start_date,
    end_date,
    status,
    budget,
    // expenses // Assuming expenses defaults to 0 or is handled by trigger/procedure, not passed in POST body
    0, // Setting default expenses to 0 on creation
  ];

  try {
    db.query(q, [value], (err, result) => {
      if (err) {
        console.error("Error creating project:", err); // Added: Log error
        // Check for specific errors like constraint violations if necessary
        if (err.code === "ER_NO_REFERENCED_ROW_2") {
          return res.status(400).json({ error: "Invalid data provided" }); // e.g., invalid user_id (shouldn't happen with isAuthenticated)
        }
        return res.status(500).json({ error: "Failed to create project" }); // Added: Consistent error handling
      }
      console.log("Project created by user", userId, ":", result.insertId); // Added: Log user ID
      // Added: Consistent success response with new project ID
      res.status(201).json({
        message: "Project created successfully",
        projectId: result.insertId,
      });
    });
  } catch (error) {
    console.error("Server error creating project:", error); // Added: Log server error
    res.status(500).json({ error: "Internal Server Error" }); // Added: Consistent error handling
  }
});

//______________________________________________ Update Projects ______//
app.put("/projects/:id", isAuthenticated, (req, res) => {
  // Added: Authentication middleware
  const { id } = req.params;
  const userId = req.user.id; // Added: Get user ID from authenticated session

  const {
    name,
    description,
    location,
    start_date,
    end_date,
    status,
    budget,
    expenses, // expenses might be calculated, include if the frontend allows updating it
  } = req.body;

  // Added: Ensure update is filtered by both id AND user_id
  const q = `UPDATE projects SET
    name=?,
    description=?,
    location=?,
    start_date=?,
    end_date=?,
    status=?,
    budget=?,
    expenses=?
  WHERE id=? AND user_id = ?`; // Added: Filter by user_id

  const value = [
    name,
    description,
    location,
    start_date,
    end_date,
    status,
    budget,
    expenses, // Include if frontend updates expenses
    id,
    userId, // Added: Pass userId to parameters
  ];

  db.query(q, value, (err, result) => {
    // Pass all values including id and userId
    if (err) {
      console.error("Error updating project:", err); // Added: Log error
      if (err.code === "ER_NO_REFERENCED_ROW_2") {
        return res.status(400).json({ error: "Invalid data provided" });
      }
      return res.status(500).json({ error: "Failed to update project" }); // Added: Consistent error handling
    }

    if (result.affectedRows === 0) {
      // Added: Return 404 if project not found or doesn't belong to the user
      return res.status(404).json({
        error: "Project not found or you do not have permission to update it",
      });
    }

    console.log("Project", id, "updated by user", userId); // Added: Log user ID
    res.json({ message: `Project with id ${id} is updated successfully` }); // Added: Consistent success response
  });
});

//______________________________________________ Delete Projects ______//
app.delete("/projects/:id", isAuthenticated, (req, res) => {
  // Added: Authentication middleware
  const { id } = req.params;
  const userId = req.user.id; // Added: Get user ID from authenticated session

  // Added: Ensure deletion is filtered by both id AND user_id
  const q = "DELETE FROM projects WHERE id=? AND user_id = ?";

  db.query(q, [id, userId], (err, result) => {
    // Added: Pass userId to parameters
    if (err) {
      console.error("Error deleting project:", err); // Added: Log error
      return res.status(500).json({ error: "Failed to delete project" }); // Added: Consistent error handling
    }

    if (result.affectedRows === 0) {
      // Added: Return 404 if project not found or doesn't belong to the user
      return res.status(404).json({
        error: "Project not found or you do not have permission to delete it",
      });
    }

    console.log("Project", id, "deleted by user", userId); // Added: Log user ID
    return res.json({
      message: `Project with id ${id} is deleted successfully`,
    }); // Added: Consistent success response
  });
});

//______________________________________________ get Specific Project Expenses ______//
app.get(`/projects/:id/expenses`, isAuthenticated, (req, res) => {
  // Added: Authentication middleware
  const { id } = req.params;
  const userId = req.user.id; // Added: Get user ID from authenticated session

  // Added: Filter the main projects table join by user_id
  const q = ` SELECT p.id     AS project_id,
              p.name          AS project_name,
       Coalesce(e.total_expenses, 0)
       + Coalesce(pr.total_resource_cost, 0) AS total_expenses
FROM   projects AS p
       LEFT JOIN (SELECT project_id,
                         Sum(amount) AS total_expenses
                  FROM   expenses
                  WHERE  project_id = ?
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
WHERE  p.id = ? AND p.user_id = ?; `; // Added: Filter by user_id on the projects table

  try {
    // Added: Pass userId to the query parameters
    db.query(q, [id, id, id, userId], (err, result) => {
      if (err) {
        console.error("Error fetching project expenses:", err); // Added: Log error
        return res
          .status(500)
          .json({ error: "Failed to fetch project expenses" }); // Added: Consistent error handling
      }
      if (result.length === 0) {
        // Added: Return 404 if project not found or doesn't belong to the user
        return res.status(404).json({
          error:
            "Project not found or you do not have permission to access its expenses",
        });
      }
      console.log(
        "Fetched expenses for project",
        id,
        "for user",
        userId,
        ":",
        result[0]
      ); // Added: Log user ID
      res.json(result[0]);
    });
  } catch (error) {
    console.error("Server error fetching project expenses:", error); // Added: Log server error
    res.status(500).json({ error: "Internal Server Error" }); // Added: Consistent error handling
  }
});

//______________________________________________ get Specific Project Expenses vs Budget ______//
app.get("/project-budget-expenses/:projectId", isAuthenticated, (req, res) => {
  // Added: Authentication middleware
  const projectId = req.params.projectId;
  const userId = req.user.id; // Added: Get user ID from authenticated session
  console.log("req.user", req.user);
  // Added: Filter budget query by user_id
  const budgetQuery =
    "SELECT budget FROM projects WHERE id = ? AND user_id = ?";
  // Added: Filter expenses query by user_id
  const expensesQuery =
    "SELECT expenses FROM projects WHERE id = ? AND user_id = ?";

  db.query(budgetQuery, [projectId, userId], (err, budgetResult) => {
    // Added: Pass userId
    if (err) {
      console.error("Error fetching project budget:", err); // Added: Log error
      res.status(500).json({ error: err.message });
      return;
    }

    // If project not found for this user, budgetResult will be empty
    if (budgetResult.length === 0) {
      return res.status(404).json({
        error:
          "Project not found or you do not have permission to access its budget",
      });
    }

    db.query(expensesQuery, [projectId, userId], (err, expensesResult) => {
      // Added: Pass userId
      if (err) {
        console.error(
          "Error fetching project expenses for budget comparison:",
          err
        ); // Added: Log error
        res.status(500).json({ error: err.message });
        return;
      }

      // expensesResult should also be empty if budgetResult was, but check defensively
      if (expensesResult.length === 0) {
        return res.status(404).json({
          error:
            "Project not found or you do not have permission to access its expenses",
        });
      }

      const budget = budgetResult[0]?.budget || 0;
      const expenses = expensesResult[0]?.expenses || 0;
      console.log(
        "User",
        userId,
        "Project",
        projectId,
        "Budget:",
        budget,
        "Expenses:",
        expenses
      ); // Added: Log user ID

      res.json({ budget, expenses });
    });
  });
});

//______________________________________________ get ALL Project Expenses vs Budget ______//
app.get("/projects-budget-expenses", isAuthenticated, (req, res) => {
  // Added: Authentication middleware
  const userId = req.user.id; // Added: Get user ID from authenticated session
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
             WHERE user_id = ? -- Added: Filter expenses by user_id
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
             WHERE pr.user_id = ? -- Added: Filter project_resources by user_id (assuming project_resources also has user_id)
            GROUP BY
                pr.project_id
        ) AS pr ON p.id = pr.project_id
    WHERE
        p.user_id = ?; -- Added: Filter projects by user_id
  `;

  // Added: Pass userId three times for the three WHERE clauses
  db.query(query, [userId, userId, userId], (err, results) => {
    if (err) {
      console.error("Error fetching all project budget vs expenses:", err); // Added: Log error
      res.status(500).json({ error: err.message });
      return;
    }
    console.log(
      "Fetched all project budget vs expenses for user",
      userId,
      ":",
      results.length
    ); // Added: Log user ID
    res.json(results);
  });
});

app.get("/projects-task-status", isAuthenticated, (req, res) => {
  // Added: Authentication middleware
  const userId = req.user.id; // Added: Get user ID from authenticated session

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
    WHERE p.user_id = ? 
  `;
  // Added: Filter by the user_id of the project
  db.query(query, [userId], (err, results) => {
    // Added: Pass userId
    if (err) {
      console.error("Error fetching project task status:", err); // Added: Log error
      res.status(500).json({ error: "Error fetching task data" }); // Added: Consistent error handling
    } else {
      results.forEach((task) => {
        task.start_date = moment(task.start_date).format("MMM Do YYYY"); // Assuming these formats are for display
        task.end_date = task.end_date
          ? moment(task.end_date).format("MMM Do YYYY")
          : null; // Handle potential null end_date
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

      console.log(
        "Fetched project task status for user",
        userId,
        ":",
        data.length,
        "projects"
      ); // Added: Log user ID
      res.json(data);
    }
  });
});

app.get("/count/projects", isAuthenticated, (req, res) => {
  // Added: Authentication middleware
  const userId = req.user.id; // Added: Get user ID from authenticated session
  // Added: Filter count by user_id
  const q = ` SELECT COUNT(*) as projectsCount FROM projects WHERE user_id = ? `;
  try {
    db.query(q, [userId], (err, result) => {
      // Added: Pass userId
      if (err) {
        console.error("Error fetching total projects count:", err); // Added: Log error
        return res
          .status(500)
          .json({ error: "Failed to fetch projects count" }); // Added: Consistent error handling
      }
      console.log(
        "Total projects count for user",
        userId,
        ":",
        result[0]?.projectsCount
      ); // Added: Log user ID
      res.json(result[0]);
    });
  } catch (error) {
    console.error("Server error fetching total projects count:", error); // Added: Log server error
    console.log(error); // Original console.log
    res.status(500).json({ error: "Internal Server Error" }); // Added: Consistent error handling
  }
});

app.get("/completed/projects", isAuthenticated, (req, res) => {
  // Added: Authentication middleware
  console.log("API endpoint hit: /completed/projects"); // Keep original log
  const userId = req.user.id; // Added: Get user ID from authenticated session

  if (!db) {
    console.error("Database connection not established");
    return res.status(500).json({ error: "Database connection failed" });
  }
  // Added: Filter count by user_id and status
  const query = `SELECT COUNT(*) as completedCount FROM projects WHERE status = "Completed" AND user_id = ?`;
  try {
    db.query(query, [userId], (err, result) => {
      // Added: Pass userId
      if (err) {
        console.error("Error executing query for completed projects:", err); // Added: More specific logging
        return res.status(500).json({
          error:
            "An error occurred while fetching the completed projects count", // Added: Consistent error message
        });
      }
      // Send the count of completed projects to the frontend
      console.log(
        "Projects with status 'Completed' for user",
        userId,
        ":",
        result[0]?.completedCount
      ); // Added: Log user ID and count
      res.json(result[0]);
    });
  } catch (error) {
    console.error("Server error fetching completed projects count:", error); // Added: Log server error
    console.log(error); // Original console.log
    res.status(500).json({ error: "Internal Server Error" }); // Added: Consistent error handling
  }
});

app.get("/pending/projects", isAuthenticated, (req, res) => {
  // Added: Authentication middleware
  const userId = req.user.id; // Added: Get user ID from authenticated session
  // Added: Filter count by user_id and status
  const q = `SELECT COUNT(*) as pendingCount FROM projects WHERE status="Pending" AND user_id = ?`;
  db.query(q, [userId], (err, result) => {
    // Added: Pass userId
    if (err) {
      console.error("Error executing query for pending projects:", err); // Added: More specific logging
      return res.status(500).json({
        error: "An error occurred while fetching the pending projects count", // Added: Consistent error message
      });
    }
    // Assuming 'result' is an array with one object containing the count
    console.log(
      "Projects with status 'pending' for user",
      userId,
      ":",
      result[0]?.pendingCount
    ); // Added: Log user ID and count
    res.json(result[0]);
  });
});

app.get("/ongoing/projects", isAuthenticated, (req, res) => {
  // Added: Authentication middleware
  const userId = req.user.id; // Added: Get user ID from authenticated session
  // Added: Filter count by user_id and status
  const q = ` SELECT COUNT(*) as ongoingCount FROM projects WHERE status="Ongoing" AND user_id = ? `;
  try {
    db.query(q, [userId], (err, result) => {
      // Added: Pass userId
      if (err) {
        console.error("Error fetching ongoing projects count:", err); // Added: Log error
        return res
          .status(500)
          .json({ error: "Failed to fetch ongoing projects count" }); // Added: Consistent error handling
      }
      console.log(
        "Projects with status 'ongoing' for user",
        userId,
        ":",
        result[0]?.ongoingCount
      ); // Added: Log user ID and count
      res.json(result[0]);
    });
  } catch (error) {
    console.error("Server error fetching ongoing projects count:", error); // Added: Log server error
    console.log(error); // Original console.log
    res.status(500).json({ error: "Internal Server Error" }); // Added: Consistent error handling
  }
});

// Add this route after your other project routes
// Note: This route fetches employees assigned to a *specific project*.
// We need to ensure the project itself belongs to the user.
// The employee record also has a user_id in your schema. This implies employees might also be user-specific.
// The query below filters employees by project_id and assumes the project_id is valid for the user.
// An alternative (more strict) interpretation is that an employee is only visible to a user if *both* the employee *and* the project they are assigned to belong to that user.
// The current query filters by project_id and assumes the project check handles user ownership.
// Let's filter by employee's user_id and project_id to be explicit about user-owned employees within a user-owned project context.
app.get("/projects/:id/employees", isAuthenticated, (req, res) => {
  // Added: Authentication middleware
  const { id } = req.params; // Project ID
  const userId = req.user.id; // Added: Get user ID from authenticated session

  // Added: Verify that the project exists AND belongs to the user first
  const verifyProjectQuery = `SELECT 1 FROM projects WHERE id = ? AND user_id = ?`;
  db.query(verifyProjectQuery, [id, userId], (err, projectResult) => {
    if (err) {
      console.error(
        "Error verifying project ownership for employee fetch:",
        err
      );
      return res.status(500).json({ error: "Error verifying project access" });
    }
    if (projectResult.length === 0) {
      return res.status(404).json({
        error:
          "Project not found or you do not have permission to access its employees",
      });
    }

    // If project is verified, fetch employees assigned to this project *that also belong to this user*
    const query = `
         SELECT
           e.id,
           e.first_name,
           e.last_name,
           e.role,
           e.project_id
         FROM employees e
         WHERE e.project_id = ? AND e.user_id = ? -- Added: Filter employees by project_id AND user_id
       `;

    try {
      db.query(query, [id, userId], (err, result) => {
        // Added: Pass project ID and userId
        if (err) {
          console.error("Error fetching project employees:", err); // Added: Log error
          return res.status(500).json({
            error: "An error occurred while fetching project employees", // Added: Consistent error message
          });
        }

        // Transform the data for the frontend Select component
        const formattedEmployees = result.map((employee) => ({
          value: employee.id,
          label: `${employee.first_name} ${employee.last_name} (${employee.role})`,
        }));

        console.log(
          "Project",
          id,
          "employees for user",
          userId,
          ":",
          formattedEmployees.length
        ); // Added: Log user ID
        res.json(formattedEmployees);
      });
    } catch (error) {
      console.error("Server error while fetching project employees:", error); // Added: Log server error
      res.status(500).json({
        error: "Server error while fetching project employees", // Added: Consistent error message
      });
    }
  });
});
/*=========================================================================================================================================================
===========================================================================================================================================================
==============================================    CRUD Routes for Suppliers   =============================================================================
===========================================================================================================================================================
===========================================================================================================================================================
*/

//______________________________________________Get all Suppliers _____//
app.get("/suppliers", isAuthenticated, (req, res) => {
  // Added: Authentication middleware
  const userId = req.user.id; // Added: Get user ID from authenticated session

  try {
    // Added: Filter suppliers by user_id
    const q = "SELECT * FROM suppliers WHERE user_id = ?";
    db.query(q, [userId], (err, result) => {
      // Added: Pass userId to query parameters
      if (err) {
        console.error("Error fetching suppliers:", err); // Added: Log error
        return res.status(500).json({ error: "Failed to fetch suppliers" }); // Added: Consistent error handling
      }
      console.log("Fetched suppliers for user", userId, ":", result.length); // Added: Log user ID and count
      return res.json(result);
    });
  } catch (error) {
    console.error("Server error fetching suppliers:", error); // Added: Log server error
    res.status(500).json({ error: "Internal Server Error" }); // Added: Consistent error handling
  }
});

//______________________________________________Get Supplier By ID ____//
app.get("/suppliers/:id", isAuthenticated, (req, res) => {
  // Added: Authentication middleware
  const { id } = req.params;
  const userId = req.user.id; // Added: Get user ID from authenticated session

  // Added: Filter by supplier ID AND user_id
  const q = "SELECT * FROM suppliers WHERE id=? AND user_id = ?";

  try {
    db.query(q, [id, userId], (err, result) => {
      // Added: Pass userId to parameters
      if (err) {
        console.error("Error fetching supplier by ID:", err); // Added: Log error
        return res.status(500).json({ error: "Failed to fetch supplier" }); // Added: Consistent error handling
      }
      if (result.length === 0) {
        // Added: Return 404 if supplier not found or doesn't belong to the user
        return res.status(404).json({
          error:
            "Supplier not found or you do not have permission to access it",
        });
      }
      console.log("Fetched supplier", id, "for user", userId); // Added: Log user ID
      res.json(result[0]); // Assuming id returns a single supplier
    });
  } catch (error) {
    console.error("Server error fetching supplier by ID:", error); // Added: Log server error
    console.log(error); // Original console.log
    res.status(500).json({ error: "Internal Server Error" }); // Added: Consistent error handling
  }
});

//______________________________________________ Create Suppliers _____//
app.post("/suppliers", isAuthenticated, (req, res) => {
  // Added: Authentication middleware
  const userId = req.user.id; // Added: Get user ID from authenticated session
  const { name, phone, email, address } = req.body;

  // Added: Add user_id to the list of columns and values
  const q =
    "INSERT INTO suppliers (user_id, name, phone, email, address) values (?, ?, ?, ?, ?)";

  // Added: Add userId to the values array
  const values = [userId, name, phone, email, address];

  try {
    db.query(q, values, (err, result) => {
      // Pass all values including userId
      if (err) {
        console.error("Error creating supplier:", err); // Added: Log error
        // Check for specific errors like constraint violations if necessary
        if (err.code === "ER_NO_REFERENCED_ROW_2") {
          return res.status(400).json({ error: "Invalid data provided" }); // e.g., invalid user_id (shouldn't happen with isAuthenticated)
        }
        return res.status(500).json({ error: "Failed to create supplier" }); // Added: Consistent error handling
      }
      console.log("Supplier created by user", userId, ":", result.insertId); // Added: Log user ID
      // Added: Consistent success response with new supplier ID
      res.status(201).json({
        message: "New supplier added successfully",
        supplierId: result.insertId,
      });
    });
  } catch (error) {
    console.error("Server error creating supplier:", error); // Added: Log server error
    console.log(error); // Original console.log
    res.status(500).json({ error: "Internal Server Error" }); // Added: Consistent error handling
  }
});

//______________________________________________Update Supplier _______//
app.put("/suppliers/:id", isAuthenticated, (req, res) => {
  // Added: Authentication middleware
  const { id } = req.params;
  const userId = req.user.id; // Added: Get user ID from authenticated session

  const { name, phone, email, address } = req.body;

  // Added: Ensure update is filtered by both id AND user_id
  const q =
    "UPDATE suppliers SET name=? , phone=?, email =? , address=? WHERE id=? AND user_id = ?";

  // Added: Add userId to the values array
  const values = [name, phone, email, address, id, userId];

  try {
    db.query(q, values, (err, result) => {
      // Pass all values including id and userId
      if (err) {
        console.error("Error updating supplier:", err); // Added: Log error
        if (err.code === "ER_NO_REFERENCED_ROW_2") {
          return res.status(400).json({ error: "Invalid data provided" });
        }
        return res.status(500).json({ error: "Failed to update supplier" }); // Added: Consistent error handling
      }

      if (result.affectedRows === 0) {
        // Added: Return 404 if supplier not found or doesn't belong to the user
        return res.status(404).json({
          error:
            "Supplier not found or you do not have permission to update it",
        });
      }

      console.log("Supplier", id, "updated by user", userId); // Added: Log user ID
      res.json({ message: `Supplier with id ${id} is updated successfully` }); // Added: Consistent success response
    });
  } catch (error) {
    console.error("Server error updating supplier:", error); // Added: Log server error
    console.log(error); // Original console.log
    res.status(500).json({ error: "Internal Server Error" }); // Added: Consistent error handling
  }
});

//______________________________________________Delete supplier ______//
app.delete("/suppliers/:id", isAuthenticated, (req, res) => {
  // Added: Authentication middleware
  const { id } = req.params;
  const userId = req.user.id; // Added: Get user ID from authenticated session

  console.log("Attempting to delete supplier", id, "for user", userId); // Added: Log user ID

  // Added: Ensure deletion is filtered by both id AND user_id
  const q = "DELETE FROM suppliers WHERE id=? AND user_id = ?";

  try {
    db.query(q, [id, userId], (err, result) => {
      // Added: Pass userId to parameters
      if (err) {
        console.error("Error deleting supplier:", err); // Added: Log error
        return res.status(500).json({ error: "Failed to delete supplier" }); // Added: Consistent error handling
      }

      if (result.affectedRows === 0) {
        // Added: Return 404 if supplier not found or doesn't belong to the user
        return res.status(404).json({
          error:
            "Supplier not found or you do not have permission to delete it",
        });
      }

      console.log("Supplier", id, "deleted by user", userId); // Added: Log user ID
      return res.json({
        message: `Supplier with id ${id} is deleted successfully`,
      }); // Added: Consistent success response
    });
  } catch (error) {
    console.error("Server error deleting supplier:", error); // Added: Log server error
    console.log(error); // Original console.log
    res.status(500).json({ error: "Internal Server Error" }); // Added: Consistent error handling
  }
});
/*=========================================================================================================================================================
===========================================================================================================================================================
==============================================    CRUD Routes for Inventory   =============================================================================
===========================================================================================================================================================
===========================================================================================================================================================
*/

//______________________________________________Get All Inventory _____//
app.get("/inventory", isAuthenticated, (req, res) => {
  // Added: Authentication middleware
  const userId = req.user.id; // Added: Get user ID from authenticated session

  try {
    // Added: Filter inventory by user_id
    const q = "SELECT * FROM inventory WHERE user_id = ?";
    db.query(q, [userId], (err, result) => {
      // Added: Pass userId to query parameters
      if (err) {
        console.error("Error fetching inventory:", err); // Added: Log error
        return res.status(500).json({ error: "Failed to fetch inventory" }); // Added: Consistent error handling
      }
      console.log("Fetched inventory for user", userId, ":", result.length); // Added: Log user ID and count
      return res.json(result);
    });
  } catch (error) {
    console.error("Server error fetching inventory:", error); // Added: Log server error
    console.log(error); // Original console.log
    res.status(500).json({ error: "Internal Server Error" }); // Added: Consistent error handling
  }
});

//______________________________________________Get Inventory By ID ____//
app.get("/inventory/:id", isAuthenticated, (req, res) => {
  // Added: Authentication middleware
  const { id } = req.params;
  const userId = req.user.id; // Added: Get user ID from authenticated session

  // Added: Filter by inventory ID AND user_id
  const q = "SELECT * FROM inventory WHERE id=? AND user_id = ?";

  try {
    db.query(q, [id, userId], (err, result) => {
      // Added: Pass userId to parameters
      if (err) {
        console.error("Error fetching inventory by ID:", err); // Added: Log error
        return res.status(500).json({ error: "Failed to fetch inventory" }); // Added: Consistent error handling
      }
      if (result.length === 0) {
        // Added: Return 404 if inventory item not found or doesn't belong to the user
        return res.status(404).json({
          error:
            "Inventory item not found or you do not have permission to access it",
        });
      }
      console.log("Fetched inventory item", id, "for user", userId); // Added: Log user ID
      res.json(result[0]); // Assuming id returns a single item
    });
  } catch (error) {
    console.error("Server error fetching inventory by ID:", error); // Added: Log server error
    console.log(error); // Original console.log
    res.status(500).json({ error: "Internal Server Error" }); // Added: Consistent error handling
  }
});

//______________________________________________Create Inventory _______//
app.post("/inventory", isAuthenticated, (req, res) => {
  // Added: Authentication middleware
  const userId = req.user.id; // Added: Get user ID from authenticated session
  const { item_name, quantity, pricePerUnit, supplier_id } = req.body;
  console.log(userId, item_name, quantity, pricePerUnit, supplier_id); // Original console.log

  // Added: Add user_id to the list of columns and values
  const q =
    "INSERT INTO inventory (user_id, item_name, quantity, pricePerUnit, supplier_id) VALUES(?, ?, ?, ?, ?)";

  // Added: Add userId to the values array
  const values = [userId, item_name, quantity, pricePerUnit, supplier_id];

  try {
    db.query(q, values, (err, result) => {
      // Pass all values including userId (Note: original code passed [value] which is incorrect if value is already an array of values, corrected to just values)
      if (err) {
        console.error("Error creating inventory item:", err); // Added: Log error
        // Check for specific errors like constraint violations if necessary (e.g., invalid supplier_id or user_id)
        if (err.code === "ER_NO_REFERENCED_ROW_2") {
          return res.status(400).json({
            error: "Invalid data provided (e.g., invalid supplier ID)",
          });
        }
        return res
          .status(500)
          .json({ error: "Failed to create inventory item" }); // Added: Consistent error handling
      }

      console.log(
        "Inventory item created by user",
        userId,
        ":",
        result.insertId
      ); // Added: Log user ID
      // Added: Consistent success response with new inventory ID
      res.status(201).json({
        message: "Inventory item added successfully",
        inventoryId: result.insertId,
      });
    });
  } catch (error) {
    console.error("Server error creating inventory item:", error); // Added: Log server error
    console.log(error); // Original console.log
    res.status(500).json({ error: "Internal Server Error" }); // Added: Consistent error handling
  }
});

//______________________________________________Update Inventory _______//
app.put("/inventory/:id", isAuthenticated, (req, res) => {
  // Added: Authentication middleware
  const { id } = req.params;
  const userId = req.user.id; // Added: Get user ID from authenticated session

  const { supplier_id, item_name, quantity, pricePerUnit } = req.body;

  // Added: Ensure update is filtered by both id AND user_id
  const q =
    "UPDATE inventory SET supplier_id=? , item_name=?, quantity=?, pricePerUnit=? WHERE id= ? AND user_id = ?";

  // Added: Add userId to the values array
  const values = [supplier_id, item_name, quantity, pricePerUnit, id, userId];
  console.log("Update inventory values", values); // Original console.log

  try {
    db.query(q, values, (err, result) => {
      // Pass all values including id and userId
      if (err) {
        console.error("Error updating inventory item:", err); // Added: Log error
        if (err.code === "ER_NO_REFERENCED_ROW_2") {
          return res.status(400).json({
            error: "Invalid data provided (e.g., invalid supplier ID)",
          });
        }
        return res
          .status(500)
          .json({ error: "Failed to update inventory item" }); // Added: Consistent error handling
      }

      if (result.affectedRows === 0) {
        // Added: Return 404 if inventory item not found or doesn't belong to the user
        return res.status(404).json({
          error:
            "Inventory item not found or you do not have permission to update it",
        });
      }

      console.log("Inventory item", id, "updated by user", userId); // Added: Log user ID
      res.json({
        message: `Inventory item with id ${id} is updated successfully`,
      }); // Added: Consistent success response
    });
  } catch (error) {
    console.error("Server error updating inventory item:", error); // Added: Log server error
    console.log(error); // Original console.log
    res.status(500).json({ error: "Internal Server Error" }); // Added: Consistent error handling
  }
});

//______________________________________________Delete Inventory _______//
app.delete("/inventory/:id", isAuthenticated, (req, res) => {
  // Added: Authentication middleware
  const { id } = req.params;
  const userId = req.user.id; // Added: Get user ID from authenticated session

  // Added: Ensure deletion is filtered by both id AND user_id
  const q = "DELETE FROM inventory WHERE id=? AND user_id = ?";

  try {
    db.query(q, [id, userId], (err, result) => {
      // Added: Pass userId to parameters
      if (err) {
        console.error("Error deleting inventory item:", err); // Added: Log error
        // Note: Deleting an inventory item might be restricted if it's referenced by project_resources
        if (err.code === "ER_ROW_IS_REFERENCED_2") {
          return res.status(409).json({
            error: "Cannot delete inventory item as it is used in a project.",
          }); // 409 Conflict
        }
        return res
          .status(500)
          .json({ error: "Failed to delete inventory item" }); // Added: Consistent error handling
      }

      if (result.affectedRows === 0) {
        // Added: Return 404 if inventory item not found or doesn't belong to the user
        return res.status(404).json({
          error:
            "Inventory item not found or you do not have permission to delete it",
        });
      }

      console.log("Inventory item", id, "deleted by user", userId); // Added: Log user ID
      res.json({
        message: `Inventory item with id ${id} is deleted successfully`,
      }); // Added: Consistent success response
    });
  } catch (err) {
    // Original catch variable name
    console.error("Server error deleting inventory item:", err); // Added: Log server error
    console.log(err); // Original console.log
    res.status(500).json({ error: "Internal Server Error" }); // Added: Consistent error handling
  }
});
/*=========================================================================================================================================================
===========================================================================================================================================================
==============================================    CRUD Routes for Employees   =============================================================================
===========================================================================================================================================================
===========================================================================================================================================================
*/

//______________________________________________get all employees ________//
app.get("/employees", isAuthenticated, (req, res) => {
  // Added: Authentication middleware
  const { project_id, search } = req.query; // Extract project_id and search from query parameters
  const userId = req.user.id; // Added: Get user ID from authenticated session

  // Added: Start query by filtering by user_id
  let q = "SELECT * FROM employees WHERE user_id = ?";
  let params = [userId]; // Added: Add userId to parameters

  // Add project_id filter if present
  if (project_id) {
    q += " AND project_id = ?";
    params.push(project_id);
  }
  // Add search functionality if present
  if (search) {
    q += ` AND (first_name LIKE ? OR last_name LIKE ?)`; // Added: Search first or last name
    params.push(`%${search}%`, `%${search}%`); // Added: Add search terms to parameters
  }

  q += ` ORDER BY id DESC`; // Added: Add a default order by clause

  try {
    db.query(q, params, (err, result) => {
      // Pass dynamic query and parameters
      if (err) {
        console.error("Error fetching employees:", err); // Added: Log error
        return res.status(500).json({ error: "Internal Server Error" }); // Added: Consistent error handling
      }
      result.forEach((employee) => {
        employee.date_hired = moment(employee.date_hired).format("YYYY-MM-DD"); // Assuming this format is needed by frontend
      });
      console.log(
        "Fetched employees for user",
        userId,
        "Project ID:",
        project_id || "All",
        "Search:",
        search || "None",
        ":",
        result.length
      ); // Added: Log user ID and filters
      return res.json(result);
    });
  } catch (error) {
    console.error("Server error fetching employees:", error); // Added: Log server error
    console.log(error); // Original console.log
    res.status(500).json({ error: "Internal Server Error" }); // Added: Consistent error handling
  }
});

//______________________________________________ Get employees By ID ___//
app.get("/employees/:id", isAuthenticated, (req, res) => {
  // Added: Authentication middleware
  const { id } = req.params;
  const userId = req.user.id; // Added: Get user ID from authenticated session

  // Added: Filter by employee ID AND user_id
  const q = "SELECT * FROM employees WHERE id=? AND user_id = ?";
  try {
    db.query(q, [id, userId], (err, result) => {
      // Added: Pass userId to parameters
      if (err) {
        console.error("Error fetching employee by ID:", err); // Added: Log error
        return res.status(500).json({ error: "Failed to fetch employee" }); // Added: Consistent error handling
      }
      if (result.length === 0) {
        // Added: Return 404 if employee not found or doesn't belong to the user
        return res.status(404).json({
          error:
            "Employee not found or you do not have permission to access it",
        });
      }
      result.forEach((employee) => {
        employee.date_hired = moment(employee.date_hired).format("MMM DoYYYY"); // Assuming this format is needed by frontend
      });
      console.log("Fetched employee wow", id, "for user", userId); // Added: Log user ID
      res.json(result[0]); // Assuming id returns a single employee
    });
  } catch (error) {
    console.error("Server error fetching employee by ID:", error); // Added: Log server error
    console.log(error); // Original console.log
    res.status(500).json({ error: "Internal Server Error" }); // Added: Consistent error handling
  }
});

//______________________________________________ Create employees ______//
app.post("/employees", isAuthenticated, async (req, res) => {
  // Added: Authentication middleware, Made async for project check
  const userId = req.user.id; // Added: Get user ID from authenticated session
  const {
    first_name,
    last_name,
    role,
    phone,
    email,
    address,
    salary,
    project_id,
    date_hired,
  } = req.body;

  // Added: Optional: Verify if the project_id, if provided, belongs to the current user
  if (project_id) {
    const verifyProjectQuery = `SELECT 1 FROM projects WHERE id = ? AND user_id = ?`;
    try {
      const projectResult = await db
        .promise()
        .query(verifyProjectQuery, [project_id, userId]);
      if (projectResult[0].length === 0) {
        return res.status(400).json({
          error: "Invalid project ID or project does not belong to you",
        }); // 400 Bad Request
      }
    } catch (error) {
      console.error(
        "Error verifying project ownership during employee creation:",
        error
      );
      return res.status(500).json({ error: "Error verifying project" });
    }
  }

  // Added: Add user_id to the list of columns and values
  const q = `INSERT INTO
  employees (
    user_id,      
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

  const value = [
    userId, // Added: user_id value
    first_name,
    last_name,
    role,
    phone,
    email,
    address,
    salary,
    project_id,
    date_hired,
  ];
  console.log("Employee creation values", value); // Original console.log

  try {
    db.query(q, [value], (err, result) => {
      // Pass values
      if (err) {
        console.error("Error creating employee:", err); // Added: Log error
        // Check for specific errors like constraint violations if necessary (e.g., invalid project_id handled above)
        if (err.code === "ER_DUP_ENTRY") {
          return res
            .status(400)
            .json({ error: "Duplicate entry (e.g., email already exists)" });
        }
        return res.status(500).json({ error: "Failed to create employee" }); // Added: Consistent error handling
      }
      console.log("Employee created by user", userId, ":", result.insertId); // Added: Log user ID
      // Added: Consistent success response with new employee ID
      res.status(201).json({
        message: "Employee created successfully",
        employeeId: result.insertId,
      });
    });
  } catch (error) {
    console.error("Server error creating employee:", error); // Added: Log server error
    console.log(error); // Original console.log
    res.status(500).json({ error: "Internal Server Error" }); // Added: Consistent error handling
  }
});

//______________________________________________ Update employees ______//
app.put("/employees/:id", isAuthenticated, async (req, res) => {
  // Added: Authentication middleware, Made async for project check
  const { id } = req.params;
  const userId = req.user.id; // Added: Get user ID from authenticated session
  const {
    first_name,
    last_name,
    role,
    phone,
    email,
    address,
    salary,
    project_id,
    date_hired,
  } = req.body;

  // Added: Optional: Verify if the project_id, if provided, belongs to the current user
  if (project_id) {
    const verifyProjectQuery = `SELECT 1 FROM projects WHERE id = ? AND user_id = ?`;
    try {
      const projectResult = await db
        .promise()
        .query(verifyProjectQuery, [project_id, userId]);
      if (projectResult[0].length === 0) {
        return res.status(400).json({
          error: "Invalid project ID or project does not belong to you",
        }); // 400 Bad Request
      }
    } catch (error) {
      console.error(
        "Error verifying project ownership during employee update:",
        error
      );
      return res.status(500).json({ error: "Error verifying project" });
    }
  }

  // Added: Ensure update is filtered by both id AND user_id
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
  id = ? AND user_id = ?`; // Added: Filter by user_id

  const value = [
    first_name,
    last_name,
    role,
    phone,
    email,
    address,
    salary,
    project_id,
    date_hired,
    id,
    userId, // Added: Pass userId to parameters
  ];
  console.log("Update employee values", value); // Original console.log

  try {
    db.query(q, value, (err, result) => {
      // Pass all values including id and userId
      if (err) {
        console.error("Error updating employee:", err); // Added: Log error
        if (err.code === "ER_DUP_ENTRY") {
          return res
            .status(400)
            .json({ error: "Duplicate entry (e.g., email already exists)" });
        }
        if (err.code === "ER_NO_REFERENCED_ROW_2") {
          // Should be caught by the explicit check above, but keeping as a safeguard
          return res.status(400).json({
            error: "Invalid data provided (e.g., invalid project ID)",
          });
        }
        return res.status(500).json({ error: "Failed to update employee" }); // Added: Consistent error handling
      }

      if (result.affectedRows === 0) {
        // Added: Return 404 if employee not found or doesn't belong to the user
        return res.status(404).json({
          error:
            "Employee not found or you do not have permission to update it",
        });
      }

      console.log("Employee", id, "updated by user", userId); // Added: Log user ID
      res.json({ message: `Employee with id "${id}" updated successfully!!` }); // Added: Consistent success response
    });
  } catch (error) {
    console.error("Server error updating employee:", error); // Added: Log server error
    console.log(error); // Original console.log
    res.status(500).json({ error: "Internal Server Error" }); // Added: Consistent error handling
  }
});
//______________________________________________ Delete employees _____//
app.delete("/employees/:id", isAuthenticated, (req, res) => {
  // Added: Authentication middleware
  const { id } = req.params;
  const userId = req.user.id; // Added: Get user ID from authenticated session

  console.log("Attempting to delete employee", id, "for user", userId); // Added: Log user ID

  // Added: Ensure deletion is filtered by both id AND user_id
  const q = "DELETE FROM employees WHERE id=? AND user_id = ?";

  try {
    db.query(q, [id, userId], (err, result) => {
      // Added: Pass userId to parameters
      if (err) {
        console.error("Error deleting employee:", err); // Added: Log error
        // Note: Deleting an employee might be restricted if they are assigned to tasks
        if (err.code === "ER_ROW_IS_REFERENCED_2") {
          return res.status(409).json({
            error: "Cannot delete employee as they are assigned to tasks.",
          }); // 409 Conflict
        }
        return res.status(500).json({ error: "Failed to delete employee" }); // Added: Consistent error handling
      }

      if (result.affectedRows === 0) {
        // Added: Return 404 if employee not found or doesn't belong to the user
        return res.status(404).json({
          error:
            "Employee not found or you do not have permission to delete it",
        });
      }

      console.log("Employee", id, "deleted by user", userId); // Added: Log user ID
      return res.json({
        message: `Employee with id "${id}" is deleted successfully`,
      }); // Added: Consistent success response
    });
  } catch (error) {
    // Original catch variable name
    console.error("Server error deleting employee:", error); // Added: Log server error
    console.log(error); // Original console.log
    res.status(500).json({ error: "Internal Server Error" }); // Added: Consistent error handling
  }
});
/*=========================================================================================================================================================
===========================================================================================================================================================
==============================================    CRUD Routes for Task   =============================================================================
===========================================================================================================================================================
===========================================================================================================================================================
*/

//______________________________________________get all Task ________//
app.get("/task", isAuthenticated, (req, res) => {
  // Added: Authentication middleware
  const {
    status,
    project_id,
    assigned_to,
    page = 1,
    limit = 10,
    sortField = "id",
    sortOrder = "DESC", // Changed default sort order to DESC for newest items first, adjust if needed
    search,
  } = req.query;
  const userId = req.user.id; // Added: Get user ID from authenticated session

  // Added: Start query by filtering by user_id
  let query = "SELECT * FROM tasks WHERE user_id = ?";
  let params = [userId]; // Added: Add userId to parameters

  // Add filters based on query parameters
  if (status) {
    query += ` AND status = ?`;
    params.push(status);
  }
  if (project_id) {
    query += ` AND project_id = ?`;
    params.push(project_id);
  }
  if (assigned_to) {
    query += ` AND assigned_to = ?`;
    params.push(assigned_to);
  }
  if (search) {
    query += ` AND name LIKE ?`; // Added: Search task name
    params.push(`%${search}%`);
  }

  // Add sorting
  // Basic validation for sortField to prevent SQL injection
  const allowedSortFields = [
    "id",
    "name",
    "status",
    "start_date",
    "end_date",
    "priority",
  ];
  const safeSortField = allowedSortFields.includes(sortField)
    ? sortField
    : "id";
  const safeSortOrder = sortOrder.toUpperCase() === "DESC" ? "DESC" : "ASC";

  query += ` ORDER BY ${safeSortField} ${safeSortOrder}`;

  // Add pagination
  const offset = (parseInt(page) - 1) * parseInt(limit);
  query += ` LIMIT ? OFFSET ?`;
  params.push(parseInt(limit), offset);

  // Execute the query
  db.query(query, params, (err, result) => {
    // Pass dynamic query and parameters
    if (err) {
      console.error("Error fetching tasks:", err); // Added: Log error
      return res.status(500).json({ error: "Failed to fetch tasks" }); // Added: Consistent error handling
    }

    // Format date fields
    result.forEach((task) => {
      task.start_date = moment(task.start_date).format("YYYY-MM-DD"); // Assuming this format is needed
      task.end_date = task.end_date
        ? moment(task.end_date).format("YYYY-MM-DD")
        : null; // Handle potential null end_date
    });
    console.log(
      "Fetched tasks for user",
      userId,
      "Filters:",
      req.query,
      ":",
      result.length,
      "items"
    ); // Added: Log user ID and filters
    res.json(result);
  });
});

//______________________________________________ Get Task By ID ___//
app.get("/task/:id", isAuthenticated, (req, res) => {
  // Added: Authentication middleware
  const { id } = req.params;
  const userId = req.user.id; // Added: Get user ID from authenticated session

  // Added: Filter by task ID AND user_id
  const q = "SELECT * FROM tasks WHERE id=? AND user_id = ?";

  try {
    db.query(q, [id, userId], (err, result) => {
      // Added: Pass userId to parameters
      if (err) {
        console.error("Error fetching task by ID:", err); // Added: Log error
        return res.status(500).json({ error: "Failed to fetch task" }); // Added: Consistent error handling
      }
      if (result.length === 0) {
        // Added: Return 404 if task not found or doesn't belong to the user
        return res.status(404).json({
          error: "Task not found or you do not have permission to access it",
        });
      }
      result.forEach((task) => {
        task.start_date = moment(task.start_date).format("YYYY-MM-DD"); // Assuming this format is needed
        task.end_date = task.end_date
          ? moment(task.end_date).format("YYYY-MM-DD")
          : null; // Handle potential null end_date
      });
      console.log("Fetched task", id, "for user", userId); // Added: Log user ID
      res.json(result[0]); // Assuming id returns a single task
    });
  } catch (error) {
    console.error("Server error fetching task by ID:", error); // Added: Log server error
    console.log(error); // Original console.log
    res.status(500).json({ error: "Internal Server Error" }); // Added: Consistent error handling
  }
});

//______________________________________________ Create Task ______//
app.post("/task", isAuthenticated, async (req, res) => {
  // Added: Authentication middleware, Made async for checks
  console.log("req.body", req.body); // Original console.log
  const userId = req.user.id; // Added: Get user ID from authenticated session
  const {
    project_id,
    name,
    description,
    assigned_to,
    start_date,
    end_date,
    status,
    priority,
  } = req.body;

  // Added: Verify if the project_id, if provided, belongs to the current user
  if (project_id) {
    const verifyProjectQuery = `SELECT 1 FROM projects WHERE id = ? AND user_id = ?`;
    try {
      const projectResult = await db
        .promise()
        .query(verifyProjectQuery, [project_id, userId]);
      if (projectResult[0].length === 0) {
        return res.status(400).json({
          error: "Invalid project ID or project does not belong to you",
        }); // 400 Bad Request
      }
    } catch (error) {
      console.error(
        "Error verifying project ownership during task creation:",
        error
      );
      return res.status(500).json({ error: "Error verifying project" });
    }
  }

  // Added: Verify if the assigned_to employee ID, if provided, belongs to the current user
  if (assigned_to) {
    const verifyEmployeeQuery = `SELECT 1 FROM employees WHERE id = ? AND user_id = ?`;
    try {
      const employeeResult = await db
        .promise()
        .query(verifyEmployeeQuery, [assigned_to, userId]);
      if (employeeResult[0].length === 0) {
        return res.status(400).json({
          error: "Invalid employee ID or employee does not belong to you",
        }); // 400 Bad Request
      }
    } catch (error) {
      console.error(
        "Error verifying employee ownership during task creation:",
        error
      );
      return res.status(500).json({ error: "Error verifying employee" });
    }
  }

  // Added: Add user_id to the list of columns and values
  const q =
    "INSERT INTO tasks (user_id, project_id, name, description, assigned_to, start_date, end_date, status, priority) VALUES (?)";

  const value = [
    userId, // Added: user_id value
    project_id,
    name,
    description,
    assigned_to,
    start_date,
    end_date,
    status,
    priority,
  ];
  console.log("Task creation values", value); // Original console.log

  try {
    db.query(q, [value], (err, result) => {
      // Pass values
      if (err) {
        console.error("Error creating task:", err); // Added: Log error
        if (err.code === "ER_NO_REFERENCED_ROW_2") {
          // Should be caught by explicit checks above, but keeping as safeguard
          return res.status(400).json({
            error:
              "Invalid data provided (e.g., invalid project or employee ID)",
          });
        }
        return res.status(500).json({ error: "Failed to create task" }); // Added: Consistent error handling
      }
      console.log("Task created by user", userId, ":", result.insertId); // Added: Log user ID
      // Added: Consistent success response with new task ID
      res.status(201).json({
        message: "Task created successfully",
        taskId: result.insertId,
      });
    });
  } catch (error) {
    console.error("Server error creating task:", error); // Added: Log server error
    console.log(error); // Original console.log
    res.status(500).json({ error: "Internal Server Error" }); // Added: Consistent error handling
  }
});

//______________________________________________ Update Task ______//
app.put("/task/:id", isAuthenticated, async (req, res) => {
  // Added: Authentication middleware, Made async for checks
  const { id } = req.params;
  const userId = req.user.id; // Added: Get user ID from authenticated session
  const {
    project_id,
    name,
    description,
    assigned_to,
    start_date,
    end_date,
    status,
    priority,
  } = req.body;
  console.log("Update task request body", req.body); // Original console.log

  // Added: Verify if the project_id, if provided, belongs to the current user
  if (project_id) {
    const verifyProjectQuery = `SELECT 1 FROM projects WHERE id = ? AND user_id = ?`;
    try {
      const projectResult = await db
        .promise()
        .query(verifyProjectQuery, [project_id, userId]);
      if (projectResult[0].length === 0) {
        return res.status(400).json({
          error: "Invalid project ID or project does not belong to you",
        }); // 400 Bad Request
      }
    } catch (error) {
      console.error(
        "Error verifying project ownership during task update:",
        error
      );
      return res.status(500).json({ error: "Error verifying project" });
    }
  }

  // Added: Verify if the assigned_to employee ID, if provided, belongs to the current user
  if (assigned_to) {
    const verifyEmployeeQuery = `SELECT 1 FROM employees WHERE id = ? AND user_id = ?`;
    try {
      const employeeResult = await db
        .promise()
        .query(verifyEmployeeQuery, [assigned_to, userId]);
      if (employeeResult[0].length === 0) {
        return res.status(400).json({
          error: "Invalid employee ID or employee does not belong to you",
        }); // 400 Bad Request
      }
    } catch (error) {
      console.error(
        "Error verifying employee ownership during task update:",
        error
      );
      return res.status(500).json({ error: "Error verifying employee" });
    }
  }

  // Added: Ensure update is filtered by both id AND user_id
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
  id = ? AND user_id = ?`; // Added: Filter by user_id

  const value = [
    project_id,
    name,
    description,
    assigned_to,
    start_date,
    end_date,
    status,
    priority,
    id,
    userId, // Added: Pass userId to parameters
  ];
  console.log("Update task values", value); // Original console.log

  try {
    db.query(q, value, (err, result) => {
      // Pass all values including id and userId
      if (err) {
        console.error("Error updating task:", err); // Added: Log error
        if (err.code === "ER_NO_REFERENCED_ROW_2") {
          // Should be caught by explicit checks above, but keeping as safeguard
          return res.status(400).json({
            error:
              "Invalid data provided (e.g., invalid project or employee ID)",
          });
        }
        return res.status(500).json({ error: "Failed to update task" }); // Added: Consistent error handling
      }

      if (result.affectedRows === 0) {
        // Added: Return 404 if task not found or doesn't belong to the user
        return res.status(404).json({
          error: "Task not found or you do not have permission to update it",
        });
      }

      console.log("Task", id, "updated by user", userId); // Added: Log user ID
      res.json({ message: `Task with id "${id}" updated successfully!!` }); // Added: Consistent success response
    });
  } catch (error) {
    console.error("Server error updating task:", error); // Added: Log server error
    console.log(error); // Original console.log
    res.status(500).json({ error: "Internal Server Error" }); // Added: Consistent error handling
  }
});
//______________________________________________ Delete Task _____//
app.delete("/task/:id", isAuthenticated, (req, res) => {
  // Added: Authentication middleware
  const { id } = req.params;
  const userId = req.user.id; // Added: Get user ID from authenticated session

  console.log("Attempting to delete task", id, "for user", userId); // Original console.log

  // Added: Ensure deletion is filtered by both id AND user_id
  const q = "DELETE FROM tasks WHERE id=? AND user_id = ?";

  try {
    db.query(q, [id, userId], (err, result) => {
      // Added: Pass userId to parameters
      if (err) {
        console.error("Error deleting task:", err); // Added: Log error
        return res.status(500).json({ error: "Failed to delete task" }); // Added: Consistent error handling
      }

      if (result.affectedRows === 0) {
        // Added: Return 404 if task not found or doesn't belong to the user
        return res.status(404).json({
          error: "Task not found or you do not have permission to delete it",
        });
      }

      console.log("Task", id, "deleted by user", userId); // Added: Log user ID
      return res.json({
        message: `Task with id "${id}" is deleted successfully`,
      }); // Added: Consistent success response
    });
  } catch (error) {
    // Original catch variable name
    console.error("Server error deleting task:", error); // Added: Log server error
    console.log(error); // Original console.log
    res.status(500).json({ error: "Internal Server Error" }); // Added: Consistent error handling
  }
});
/*=========================================================================================================================================================
===========================================================================================================================================================
==============================================    CRUD Routes for Expenses  =============================================================================
===========================================================================================================================================================
===========================================================================================================================================================
*/

//______________________________________________get all Expenses________//
app.get("/expenses", isAuthenticated, (req, res) => {
  // Added: Authentication middleware
  const userId = req.user.id; // Added: Get user ID from authenticated session
  // Added: Filter expenses by user_id
  const q = `SELECT * FROM expenses WHERE user_id = ? ORDER BY date DESC`; // Added: Filter and default order
  try {
    db.query(q, [userId], (err, result) => {
      // Added: Pass userId to query parameters
      if (err) {
        console.error("Error fetching expenses:", err); // Added: Log error
        return res.status(500).json({ error: "Failed to fetch expenses" }); // Added: Consistent error handling
      }

      result.forEach((expenses) => {
        expenses.date = moment(expenses.date).format("MMM DoYYYY"); // Assuming this format is needed
      });
      console.log("Fetched expenses for user", userId, ":", result.length); // Added: Log user ID and count

      return res.json(result);
    });
  } catch (error) {
    console.error("Server error fetching expenses:", error); // Added: Log server error
    console.log(error); // Original console.log
    res.status(500).json({ error: "Internal Server Error" }); // Added: Consistent error handling
  }
});
//______________________________________________ Get Expenses By ID ___//
app.get("/expenses/:id", isAuthenticated, (req, res) => {
  // Added: Authentication middleware
  const { id } = req.params;
  const userId = req.user.id; // Added: Get user ID from authenticated session

  // Added: Filter by expense ID AND user_id
  const q = "SELECT * FROM expenses WHERE id=? AND user_id = ?";
  try {
    db.query(q, [id, userId], (err, result) => {
      // Added: Pass userId to parameters
      if (err) {
        console.error("Error fetching expense by ID:", err); // Added: Log error
        return res.status(500).json({ error: "Failed to fetch expense" }); // Added: Consistent error handling
      }
      if (result.length === 0) {
        // Added: Return 404 if expense not found or doesn't belong to the user
        return res.status(404).json({
          error: "Expense not found or you do not have permission to access it",
        });
      }
      result.forEach((expenses) => {
        expenses.date = moment(expenses.date).format("YYYY-MM-DD"); // Assuming this format is needed
      });

      console.log("Fetched expense", id, "for user", userId, ":", result[0]); // Added: Log user ID
      res.json(result[0]); // Assuming id returns a single expense
    });
  } catch (error) {
    console.error("Server error fetching expense by ID:", error); // Added: Log server error
    console.log(error); // Original console.log
    res.status(500).json({ error: "Internal Server Error" }); // Added: Consistent error handling
  }
});

//______________________________________________ Create Expenses ______//
app.post("/expenses", isAuthenticated, async (req, res) => {
  // Added: Authentication middleware, Made async for project check
  const userId = req.user.id; // Added: Get user ID from authenticated session
  const { project_id, amount, description, date } = req.body;
  console.log("Expense creation values", req.body); // Original console.log

  // Added: Verify if the project_id, if provided, belongs to the current user
  if (project_id) {
    // project_id is nullable in schema, check only if provided
    const verifyProjectQuery = `SELECT 1 FROM projects WHERE id = ? AND user_id = ?`;
    try {
      const projectResult = await db
        .promise()
        .query(verifyProjectQuery, [project_id, userId]);
      if (projectResult[0].length === 0) {
        return res.status(400).json({
          error: "Invalid project ID or project does not belong to you",
        }); // 400 Bad Request
      }
    } catch (error) {
      console.error(
        "Error verifying project ownership during expense creation:",
        error
      );
      return res.status(500).json({ error: "Error verifying project" });
    }
  }
  // Added: Basic validation for required fields
  if (
    amount === undefined ||
    amount === null ||
    description === undefined ||
    description === null ||
    !date
  ) {
    return res
      .status(400)
      .json({ error: "Amount, description, and date are required." });
  }
  if (isNaN(amount) || parseFloat(amount) < 0) {
    return res.status(400).json({ error: "Valid amount is required." });
  }
  // Basic date format validation could be added here if needed

  // Added: Add user_id to the list of columns and values
  const q =
    "INSERT INTO expenses (user_id, project_id, amount, description, date) VALUES (?)";

  const value = [
    userId, // Added: user_id value
    project_id,
    amount,
    description,
    date,
  ];
  console.log("Insert expense values", value); // Added: Log final values

  try {
    db.query(q, [value], (err, result) => {
      // Pass values
      if (err) {
        console.error("Error creating expense:", err); // Added: Log error
        if (err.code === "ER_NO_REFERENCED_ROW_2") {
          // Should be caught by explicit check above, but keeping as safeguard
          return res.status(400).json({
            error: "Invalid data provided (e.g., invalid project ID)",
          });
        }
        return res.status(500).json({ error: "Failed to create expense" }); // Added: Consistent error handling
      }
      console.log("Expense created by user", userId, ":", result.insertId); // Added: Log user ID
      // Added: Consistent success response with new expense ID
      res.status(201).json({
        message: "Expense created successfully",
        expenseId: result.insertId,
      });
    });
  } catch (error) {
    console.error("Server error creating expense:", error); // Added: Log server error
    console.log(error); // Original console.log
    res.status(500).json({ error: "Internal Server Error" }); // Added: Consistent error handling
  }
});

//______________________________________________ Update Expenses ______//
app.put("/expenses/:id", isAuthenticated, async (req, res) => {
  // Added: Authentication middleware, Made async for project check
  const { id } = req.params;
  const userId = req.user.id; // Added: Get user ID from authenticated session
  const { project_id, amount, description, date } = req.body;
  console.log("Update expense request body", req.body); // Original console.log

  // Added: Verify if the project_id, if provided, belongs to the current user
  if (project_id) {
    // project_id is nullable, check only if provided in update
    const verifyProjectQuery = `SELECT 1 FROM projects WHERE id = ? AND user_id = ?`;
    try {
      const projectResult = await db
        .promise()
        .query(verifyProjectQuery, [project_id, userId]);
      if (projectResult[0].length === 0) {
        return res.status(400).json({
          error: "Invalid project ID or project does not belong to you",
        }); // 400 Bad Request
      }
    } catch (error) {
      console.error(
        "Error verifying project ownership during expense update:",
        error
      );
      return res.status(500).json({ error: "Error verifying project" });
    }
  }
  // Added: Basic validation for amount if provided in update
  if (
    amount !== undefined &&
    (amount === null || isNaN(amount) || parseFloat(amount) < 0)
  ) {
    return res
      .status(400)
      .json({ error: "Valid amount is required if provided." });
  }
  // Basic date format validation could be added here if date is provided in update

  // Added: Ensure update is filtered by both id AND user_id
  const q = `UPDATE expenses SET project_id=? , amount=? , description=?, date=?  WHERE id=? AND user_id = ?`; // Added: Filter by user_id

  const value = [
    project_id,
    amount,
    description,
    date,
    id,
    userId, // Added: Pass userId to parameters
  ];
  console.log("Update expense values", value); // Original console.log

  try {
    db.query(q, value, (err, result) => {
      // Pass all values including id and userId
      if (err) {
        console.error("Error updating expense:", err); // Added: Log error
        if (err.code === "ER_NO_REFERENCED_ROW_2") {
          // Should be caught by explicit check above, but keeping as safeguard
          return res.status(400).json({
            error: "Invalid data provided (e.g., invalid project ID)",
          });
        }
        return res.status(500).json({ error: "Failed to update expense" }); // Added: Consistent error handling
      }

      if (result.affectedRows === 0) {
        // Added: Return 404 if expense not found or doesn't belong to the user
        return res.status(404).json({
          error: "Expense not found or you do not have permission to update it",
        });
      }

      console.log("Expense", id, "updated by user", userId); // Added: Log user ID
      res.json({ message: `Expense with id "${id}" updated successfully!!` }); // Added: Consistent success response
    });
  } catch (error) {
    console.error("Server error updating expense:", error); // Added: Log server error
    console.log(error); // Original console.log
    res.status(500).json({ error: "Internal Server Error" }); // Added: Consistent error handling
  }
});
//______________________________________________ Delete Expenses _____//
app.delete("/expenses/:id", isAuthenticated, (req, res) => {
  // Added: Authentication middleware
  const { id } = req.params;
  const userId = req.user.id; // Added: Get user ID from authenticated session

  console.log("Attempting to delete expense", id, "for user", userId); // Original console.log

  // Added: Ensure deletion is filtered by both id AND user_id
  const q = "DELETE FROM expenses WHERE id=? AND user_id = ?";

  try {
    db.query(q, [id, userId], (err, result) => {
      // Added: Pass userId to parameters
      if (err) {
        console.error("Error deleting expense:", err); // Added: Log error
        // Note: Deleting an expense will trigger the after_expense_delete trigger.
        // Handle potential errors from the trigger if it uses SIGNAL SQLSTATE '45000'.
        if (err.sqlState === "45000") {
          // Assuming trigger uses SIGNAL SQLSTATE '45000'
          return res.status(400).json({ error: err.message }); // Return the trigger's error message
        }
        return res.status(500).json({ error: "Failed to delete expense" }); // Added: Consistent error handling
      }

      if (result.affectedRows === 0) {
        // Added: Return 404 if expense not found or doesn't belong to the user
        return res.status(404).json({
          error: "Expense not found or you do not have permission to delete it",
        });
      }

      console.log("Expense", id, "deleted by user", userId); // Added: Log user ID
      return res.json({
        message: `Expense with id "${id}" is deleted successfully`,
      }); // Added: Consistent success response
    });
  } catch (error) {
    // Original catch variable name
    console.error("Server error deleting expense:", error); // Added: Log server error
    console.log(error); // Original console.log
    res.status(500).json({ error: "Internal Server Error" }); // Added: Consistent error handling
  }
});
/*=========================================================================================================================================================
===========================================================================================================================================================
==============================================    CRUD Routes for Project Resourses  =============================================================================
===========================================================================================================================================================
===========================================================================================================================================================
*/

//______________________________________________get all Project Resources ________//
app.get("/projectResources", isAuthenticated, (req, res) => {
  // Added: Authentication middleware
  const { project_id, search } = req.query; // Extract project_id and search
  const userId = req.user.id; // Added: Get user ID from authenticated session

  // Added: Start building the query, filtering by project_resources.user_id
  let q = `SELECT project_resources.id,
                  projects.name AS project_name, -- Changed 'name' to 'project_name' for clarity
                  inventory.item_name,
                  project_resources.quantity_used
           FROM   project_resources
           INNER JOIN projects ON projects.id = project_resources.project_id
           INNER JOIN inventory ON inventory.id = project_resources.resource_id
           WHERE  project_resources.user_id = ? -- Added: Filter by user_id of the project resource
           `;
  let params = [userId]; // Added: Add userId to parameters

  // Add project_id filter if present
  if (project_id) {
    q += ` AND project_resources.project_id = ?`; // Added: Filter by project_id
    params.push(project_id);
  }
  // Add search functionality if present (search on item_name)
  if (search) {
    q += ` AND inventory.item_name LIKE ?`; // Added: Filter by inventory item name
    params.push(`%${search}%`);
  }

  q += ` ORDER BY project_resources.id DESC`; // Added: Default order by clause

  try {
    db.query(q, params, (err, result) => {
      // Pass dynamic query and parameters
      if (err) {
        console.error("Error fetching project resources:", err); // Added: Log error
        return res
          .status(500)
          .json({ error: "Failed to fetch project resources" }); // Added: Consistent error handling
      }

      console.log(
        "Fetched project resources for user",
        userId,
        "Project ID:",
        project_id || "All",
        "Search:",
        search || "None",
        ":",
        result.length,
        "items"
      ); // Added: Log user ID and filters
      return res.json(result);
    });
  } catch (error) {
    console.error("Server error fetching project resources:", error); // Added: Log server error
    console.log(error); // Original console.log
    res.status(500).json({ error: "Internal Server Error" }); // Added: Consistent error handling
  }
});

//______________________________________________ Get Project Resources By ID ___//
app.get("/projectResources/:id", isAuthenticated, (req, res) => {
  // Added: Authentication middleware
  const { id } = req.params;
  const userId = req.user.id; // Added: Get user ID from authenticated session

  // Added: Filter by project resource ID AND user_id
  const q = "SELECT * FROM project_resources WHERE id=? AND user_id = ?";

  try {
    db.query(q, [id, userId], (err, result) => {
      // Added: Pass userId to parameters
      if (err) {
        console.error("Error fetching project resource by ID:", err); // Added: Log error
        return res
          .status(500)
          .json({ error: "Failed to fetch project resource" }); // Added: Consistent error handling
      }

      if (result.length === 0) {
        // Added: Return 404 if resource not found or doesn't belong to the user
        return res.status(404).json({
          error:
            "Project resource not found or you do not have permission to access it",
        });
      }

      console.log(
        "Fetched project resource",
        id,
        "for user",
        userId,
        ":",
        result[0]
      ); // Added: Log user ID
      res.json(result[0]); // Assuming id returns a single resource
    });
  } catch (error) {
    console.error("Server error fetching project resource by ID:", error); // Added: Log server error
    console.log(error); // Original console.log
    res.status(500).json({ error: "Internal Server Error" }); // Added: Consistent error handling
  }
});

//______________________________________________ Create Project Resources ______//
app.post("/projectResources", isAuthenticated, async (req, res) => {
  // Added: Authentication middleware, Made async for checks
  const userId = req.user.id; // Added: Get user ID from authenticated session
  const {
    project_id,
    resource_id, // Inventory item ID
    quantity_used,
  } = req.body;
  console.log("Project resource creation values", req.body); // Original console.log

  // Added: Verify if the project_id belongs to the current user
  if (!project_id) {
    return res.status(400).json({ error: "Project ID is required" });
  }
  const verifyProjectQuery = `SELECT 1 FROM projects WHERE id = ? AND user_id = ?`;
  try {
    const projectResult = await db
      .promise()
      .query(verifyProjectQuery, [project_id, userId]);
    if (projectResult[0].length === 0) {
      return res.status(400).json({
        error: "Invalid project ID or project does not belong to you",
      }); // 400 Bad Request
    }
  } catch (error) {
    console.error(
      "Error verifying project ownership during project resource creation:",
      error
    );
    return res.status(500).json({ error: "Error verifying project" });
  }

  // Added: Verify if the resource_id (inventory item) belongs to the current user
  if (!resource_id) {
    return res
      .status(400)
      .json({ error: "Resource ID (inventory item ID) is required" });
  }
  const verifyInventoryQuery = `SELECT 1 FROM inventory WHERE id = ? AND user_id = ?`;
  try {
    const inventoryResult = await db
      .promise()
      .query(verifyInventoryQuery, [resource_id, userId]);
    if (inventoryResult[0].length === 0) {
      return res.status(400).json({
        error: "Invalid resource ID or inventory item does not belong to you",
      }); // 400 Bad Request
    }
  } catch (error) {
    console.error(
      "Error verifying inventory ownership during project resource creation:",
      error
    );
    return res.status(500).json({ error: "Error verifying inventory item" });
  }

  // Added: Basic validation for quantity_used
  if (
    quantity_used === undefined ||
    quantity_used === null ||
    quantity_used < 0
  ) {
    return res.status(400).json({ error: "Valid quantity used is required" });
  }

  // Added: Add user_id to the list of columns and values
  const q =
    "INSERT INTO project_resources (user_id, project_id, resource_id, quantity_used) VALUES (?)";

  const value = [
    userId, // Added: user_id value
    project_id,
    resource_id,
    quantity_used,
  ];
  console.log("Insert project resource values", value); // Added: Log final values

  try {
    db.query(q, [value], (err, result) => {
      // Pass values
      if (err) {
        console.error("Error creating project resource:", err); // Added: Log error
        // Check for specific errors like constraint violations (e.g., handled by triggers on project_resources)
        if (err.sqlState === "45000") {
          // Custom error from trigger check_and_update_inventory_before_insert
          return res.status(400).json({ error: err.message }); // Return the trigger's error message
        }
        if (err.code === "ER_NO_REFERENCED_ROW_2") {
          // Should be caught by explicit checks above, but keeping as safeguard
          return res.status(400).json({
            error:
              "Invalid data provided (e.g., invalid project or inventory ID)",
          });
        }
        return res
          .status(500)
          .json({ error: "Failed to create project resource" }); // Added: Consistent error handling
      }
      console.log(
        "Project resource created by user",
        userId,
        ":",
        result.insertId
      ); // Added: Log user ID
      // Added: Consistent success response with new resource ID
      res.status(201).json({
        message: "Project resource added successfully",
        projectResourceId: result.insertId,
      });
    });
  } catch (error) {
    console.error("Server error creating project resource:", error); // Added: Log server error
    console.log(error); // Original console.log
    res.status(500).json({ error: "Internal Server Error" }); // Added: Consistent error handling
  }
});

//______________________________________________ Update Project Resources ______//
app.put("/projectResources/:id", isAuthenticated, async (req, res) => {
  // Added: Authentication middleware, Made async for checks
  const { id } = req.params;
  const userId = req.user.id; // Added: Get user ID from authenticated session
  const {
    project_id,
    resource_id, // Inventory item ID
    quantity_used,
  } = req.body;
  console.log("Update project resource request body", req.body); // Original console.log

  // Added: Verify if the project_id belongs to the current user
  if (project_id) {
    // Check only if project_id is provided in the update
    const verifyProjectQuery = `SELECT 1 FROM projects WHERE id = ? AND user_id = ?`;
    try {
      const projectResult = await db
        .promise()
        .query(verifyProjectQuery, [project_id, userId]);
      if (projectResult[0].length === 0) {
        return res.status(400).json({
          error: "Invalid project ID or project does not belong to you",
        }); // 400 Bad Request
      }
    } catch (error) {
      console.error(
        "Error verifying project ownership during project resource update:",
        error
      );
      return res.status(500).json({ error: "Error verifying project" });
    }
  }

  // Added: Verify if the resource_id (inventory item) belongs to the current user
  if (resource_id) {
    // Check only if resource_id is provided in the update
    const verifyInventoryQuery = `SELECT 1 FROM inventory WHERE id = ? AND user_id = ?`;
    try {
      const inventoryResult = await db
        .promise()
        .query(verifyInventoryQuery, [resource_id, userId]);
      if (inventoryResult[0].length === 0) {
        return res.status(400).json({
          error: "Invalid resource ID or inventory item does not belong to you",
        }); // 400 Bad Request
      }
    } catch (error) {
      console.error(
        "Error verifying inventory ownership during project resource update:",
        error
      );
      return res.status(500).json({ error: "Error verifying inventory item" });
    }
  }
  // Added: Basic validation for quantity_used if provided
  if (
    quantity_used !== undefined &&
    (quantity_used === null || quantity_used < 0)
  ) {
    return res
      .status(400)
      .json({ error: "Valid quantity used is required if provided" });
  }

  // Added: Ensure update is filtered by both id AND user_id
  const q = `UPDATE project_resources SET project_id=? , resource_id=? , quantity_used=?  WHERE id=? AND user_id = ?`; // Added: Filter by user_id

  const value = [
    project_id,
    resource_id,
    quantity_used,
    id,
    userId, // Added: Pass userId to parameters
  ];
  console.log("Update project resource values", value); // Original console.log

  try {
    db.query(q, value, (err, result) => {
      // Pass all values including id and userId
      if (err) {
        console.error("Error updating project resource:", err); // Added: Log error
        if (err.sqlState === "45000") {
          // Custom error from trigger check_and_update_inventory_before_update
          return res.status(400).json({ error: err.message }); // Return the trigger's error message
        }
        if (err.code === "ER_NO_REFERENCED_ROW_2") {
          // Should be caught by explicit checks above, but keeping as safeguard
          return res.status(400).json({
            error:
              "Invalid data provided (e.g., invalid project or inventory ID)",
          });
        }
        return res
          .status(500)
          .json({ error: "Failed to update project resource" }); // Added: Consistent error handling
      }

      if (result.affectedRows === 0) {
        // Added: Return 404 if resource not found or doesn't belong to the user
        return res.status(404).json({
          error:
            "Project resource not found or you do not have permission to update it",
        });
      }

      console.log("Project resource", id, "updated by user", userId); // Added: Log user ID
      res.json({
        message: `Project resource with id "${id}" updated successfully!!`,
      }); // Added: Consistent success response
    });
  } catch (error) {
    console.error("Server error updating project resource:", error); // Added: Log server error
    console.log(error); // Original console.log
    res.status(500).json({ error: "Internal Server Error" }); // Added: Consistent error handling
  }
});
//______________________________________________ Delete Project Resources _____//
app.delete("/projectResources/:id", isAuthenticated, (req, res) => {
  // Added: Authentication middleware
  const { id } = req.params;
  const userId = req.user.id; // Added: Get user ID from authenticated session

  console.log("Attempting to delete project resource", id, "for user", userId); // Original console.log

  // Added: Ensure deletion is filtered by both id AND user_id
  const q = "DELETE FROM project_resources WHERE id=? AND user_id = ?";

  try {
    db.query(q, [id, userId], (err, result) => {
      // Added: Pass userId to parameters
      if (err) {
        console.error("Error deleting project resource:", err); // Added: Log error
        // Note: Deleting a project resource might trigger updates or other logic via triggers.
        // Error handling for trigger failures would depend on how the trigger reports errors.
        // The provided schema has triggers that call a stored procedure, which might throw errors.
        if (err.sqlState === "45000") {
          // Assuming trigger uses SIGNAL SQLSTATE '45000'
          return res.status(400).json({ error: err.message }); // Return the trigger's error message
        }
        return res
          .status(500)
          .json({ error: "Failed to delete project resource" }); // Added: Consistent error handling
      }

      if (result.affectedRows === 0) {
        // Added: Return 404 if resource not found or doesn't belong to the user
        return res.status(404).json({
          error:
            "Project resource not found or you do not have permission to delete it",
        });
      }

      console.log("Project resource", id, "deleted by user", userId); // Added: Log user ID
      return res.json({
        message: `Project resource with id "${id}" is deleted successfully`,
      }); // Added: Consistent success response
    });
  } catch (error) {
    // Original catch variable name
    console.error("Server error deleting project resource:", error); // Added: Log server error
    console.log(error); // Original console.log
    res.status(500).json({ error: "Internal Server Error" }); // Added: Consistent error handling
  }
});

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const crypto = require("crypto");

const {
    pool,
    testDatabaseConnection
} = require("./db");

const app = express();

const PORT = 3000;


// =====================================================
// PATHS
// =====================================================

const frontendPath = path.resolve(
    __dirname,
    "..",
    "frontend"
);

const frontendIndex = path.join(
    frontendPath,
    "index.html"
);

const adminPath = path.join(
    frontendPath,
    "admin"
);

const adminIndex = path.join(
    adminPath,
    "index.html"
);

const uploadDirectory = path.join(
    __dirname,
    "uploads"
);


// =====================================================
// STARTUP INFORMATION
// =====================================================

console.log("");
console.log("======================================");
console.log("       TECHNOVA REGISTRATION");
console.log("======================================");

console.log(
    "📂 Frontend:",
    frontendPath
);

console.log(
    "📄 Frontend index:",
    frontendIndex
);

console.log(
    "📊 Admin index:",
    adminIndex
);

console.log(
    "📁 Uploads:",
    uploadDirectory
);

console.log("======================================");


// =====================================================
// CHECK FRONTEND
// =====================================================

if (!fs.existsSync(frontendPath)) {

    console.error(
        "❌ Frontend folder does not exist:"
    );

    console.error(
        frontendPath
    );

    process.exit(1);
}


if (!fs.existsSync(frontendIndex)) {

    console.error(
        "❌ frontend/index.html not found:"
    );

    console.error(
        frontendIndex
    );

    process.exit(1);
}


if (!fs.existsSync(adminPath)) {

    console.warn(
        "⚠️ Admin folder does not exist:"
    );

    console.warn(
        adminPath
    );

} else {

    console.log(
        "✅ Admin folder found"
    );

}


if (!fs.existsSync(adminIndex)) {

    console.warn(
        "⚠️ Admin index.html not found:"
    );

    console.warn(
        adminIndex
    );

} else {

    console.log(
        "✅ Admin index.html found"
    );

}


// =====================================================
// CREATE UPLOAD DIRECTORY
// =====================================================

if (!fs.existsSync(uploadDirectory)) {

    fs.mkdirSync(
        uploadDirectory,
        {
            recursive: true
        }
    );

    console.log(
        "📁 Upload directory created"
    );

}


// =====================================================
// MIDDLEWARE
// =====================================================

app.use(
    cors()
);

app.use(
    express.json()
);

app.use(
    express.urlencoded({
        extended: true
    })
);


// Helmet without CSP restrictions
app.use(
    helmet({
        contentSecurityPolicy: false,
        crossOriginResourcePolicy: false
    })
);


// =====================================================
// SERVE FRONTEND
// =====================================================

app.use(
    express.static(
        frontendPath
    )
);


// =====================================================
// SERVE UPLOADED FILES
// =====================================================

app.use(
    "/uploads",
    express.static(
        uploadDirectory
    )
);


// =====================================================
// HOME PAGE
// =====================================================

app.get(
    "/",
    (req, res) => {

        res.sendFile(
            frontendIndex
        );

    }
);


// =====================================================
// ADMIN DASHBOARD
// =====================================================

app.get(
    "/admin",
    (req, res) => {

        if (
            !fs.existsSync(adminIndex)
        ) {

            return res.status(404).send(`
                <!DOCTYPE html>

                <html>

                <head>

                    <title>Admin Not Found</title>

                </head>

                <body>

                    <h1>
                        Admin Dashboard Not Found
                    </h1>

                    <p>
                        Expected file:
                    </p>

                    <p>
                        ${adminIndex}
                    </p>

                </body>

                </html>
            `);

        }

        res.sendFile(
            adminIndex
        );

    }
);


// =====================================================
// ADMIN DASHBOARD WITH TRAILING SLASH
// =====================================================

app.get(
    "/admin/",
    (req, res) => {

        if (
            !fs.existsSync(adminIndex)
        ) {

            return res.status(404).send(`
                <!DOCTYPE html>

                <html>

                <head>

                    <title>Admin Not Found</title>

                </head>

                <body>

                    <h1>
                        Admin Dashboard Not Found
                    </h1>

                    <p>
                        Expected file:
                    </p>

                    <p>
                        ${adminIndex}
                    </p>

                </body>

                </html>
            `);

        }

        res.sendFile(
            adminIndex
        );

    }
);


// =====================================================
// TEST ROUTE
// =====================================================

app.get(
    "/test",
    (req, res) => {

        res.status(200).send(`
            <!DOCTYPE html>

            <html>

            <head>

                <meta charset="UTF-8">

                <title>
                    TECHNOVA Server Test
                </title>

                <style>

                    body {
                        font-family: Arial;
                        background: #f5f7fb;
                        padding: 50px;
                    }

                    .box {
                        max-width: 700px;
                        margin: auto;
                        background: white;
                        padding: 30px;
                        border-radius: 15px;
                        box-shadow:
                            0 5px 25px
                            rgba(0,0,0,.08);
                    }

                    h1 {
                        color: #16a34a;
                    }

                    p {
                        color: #555;
                    }

                </style>

            </head>

            <body>

                <div class="box">

                    <h1>
                        ✅ TECHNOVA SERVER IS WORKING
                    </h1>

                    <p>
                        Express.js is running successfully.
                    </p>

                    <p>
                        PostgreSQL connection is handled separately.
                    </p>

                    <p>
                        Server:
                        http://localhost:${PORT}
                    </p>

                </div>

            </body>

            </html>
        `);

    }
);


// =====================================================
// MULTER CONFIGURATION
// =====================================================

const storage =
    multer.diskStorage({

        destination:
            function (
                req,
                file,
                cb
            ) {

                cb(
                    null,
                    uploadDirectory
                );

            },

        filename:
            function (
                req,
                file,
                cb
            ) {

                const uniqueName =
                    Date.now() +
                    "-" +
                    crypto
                        .randomBytes(6)
                        .toString("hex") +
                    path.extname(
                        file.originalname
                    );

                cb(
                    null,
                    uniqueName
                );

            }

    });


const fileFilter =
    function (
        req,
        file,
        cb
    ) {

        const allowedTypes = [

            "image/jpeg",
            "image/png",
            "image/jpg",
            "application/pdf"

        ];


        if (
            allowedTypes.includes(
                file.mimetype
            )
        ) {

            cb(
                null,
                true
            );

        } else {

            cb(
                new Error(
                    "Only JPG, PNG and PDF files are allowed."
                ),
                false
            );

        }

    };


const upload =
    multer({

        storage: storage,

        limits: {

            fileSize:
                5 * 1024 * 1024

        },

        fileFilter:
            fileFilter

    });


// =====================================================
// REGISTER PARTICIPANT
// =====================================================

app.post(
    "/api/register",
    upload.single(
        "paymentScreenshot"
    ),

    async (
        req,
        res
    ) => {

        try {

            const {

                fullName,
                email,
                phone,
                collegeName,
                department,
                yearOfStudy,
                eventName,
                participationType,
                teamName,
                teamMembers,
                transactionId

            } = req.body;


            // -----------------------------------------
            // VALIDATION
            // -----------------------------------------

            if (

                !fullName ||
                !email ||
                !phone ||
                !collegeName ||
                !department ||
                !yearOfStudy ||
                !eventName ||
                !participationType ||
                !transactionId

            ) {

                return res.status(
                    400
                ).json({

                    success: false,

                    message:
                        "Please fill all required fields."

                });

            }


            // -----------------------------------------
            // REGISTRATION NUMBER
            // -----------------------------------------

            const registrationNumber =
                "TECH" +
                Date.now()
                    .toString()
                    .slice(-8);


            // -----------------------------------------
            // PAYMENT SCREENSHOT
            // -----------------------------------------

            const paymentScreenshot =
                req.file
                    ? req.file.filename
                    : null;


            // -----------------------------------------
            // DATABASE QUERY
            // -----------------------------------------

            const query = `

                INSERT INTO registrations

                (

                    registration_number,
                    full_name,
                    email,
                    phone,
                    college_name,
                    department,
                    year_of_study,
                    event_name,
                    participation_type,
                    team_name,
                    team_members,
                    transaction_id,
                    payment_screenshot,
                    registration_fee

                )

                VALUES

                (

                    $1,
                    $2,
                    $3,
                    $4,
                    $5,
                    $6,
                    $7,
                    $8,
                    $9,
                    $10,
                    $11,
                    $12,
                    $13,
                    $14

                )

                RETURNING *;

            `;


            const values = [

                registrationNumber,

                fullName,

                email,

                phone,

                collegeName,

                department,

                yearOfStudy,

                eventName,

                participationType,

                teamName ||
                    null,

                teamMembers ||
                    null,

                transactionId,

                paymentScreenshot,

                250.00

            ];


            const result =
                await pool.query(
                    query,
                    values
                );


            // -----------------------------------------
            // SUCCESS RESPONSE
            // -----------------------------------------

            return res.status(
                201
            ).json({

                success: true,

                message:
                    "Registration successful!",

                registrationNumber:
                    result.rows[0]
                        .registration_number

            });


        } catch (error) {

            console.error(
                "❌ Registration error:"
            );

            console.error(
                error
            );


            return res.status(
                500
            ).json({

                success: false,

                message:
                    "Registration failed. Please try again."

            });

        }

    }
);


// =====================================================
// GET ALL REGISTRATIONS
// =====================================================

app.get(
    "/api/registrations",

    async (
        req,
        res
    ) => {

        try {

            const result =
                await pool.query(`

                    SELECT *

                    FROM registrations

                    ORDER BY created_at DESC

                `);


            return res.json({

                success: true,

                registrations:
                    result.rows

            });


        } catch (error) {

            console.error(
                "❌ Fetch registrations error:"
            );

            console.error(
                error
            );


            return res.status(
                500
            ).json({

                success: false,

                message:
                    "Unable to fetch registrations."

            });

        }

    }
);


// =====================================================
// GET SINGLE REGISTRATION
// =====================================================

app.get(
    "/api/registrations/:registrationNumber",

    async (
        req,
        res
    ) => {

        try {

            const {
                registrationNumber
            } = req.params;


            const result =
                await pool.query(

                    `

                    SELECT *

                    FROM registrations

                    WHERE registration_number = $1

                    `,

                    [
                        registrationNumber
                    ]

                );


            if (
                result.rows.length === 0
            ) {

                return res.status(
                    404
                ).json({

                    success: false,

                    message:
                        "Registration not found."

                });

            }


            return res.json({

                success: true,

                registration:
                    result.rows[0]

            });


        } catch (error) {

            console.error(
                "❌ Single registration error:"
            );

            console.error(
                error
            );


            return res.status(
                500
            ).json({

                success: false,

                message:
                    "Server error."

            });

        }

    }
);


// =====================================================
// ERROR HANDLING
// =====================================================

app.use(
    (
        error,
        req,
        res,
        next
    ) => {

        console.error(
            "❌ Server Error:"
        );

        console.error(
            error
        );


        if (
            error instanceof
            multer.MulterError
        ) {

            return res.status(
                400
            ).json({

                success: false,

                message:
                    "File upload error: " +
                    error.message

            });

        }


        if (error) {

            return res.status(
                400
            ).json({

                success: false,

                message:
                    error.message

            });

        }


        next();

    }
);


// =====================================================
// START SERVER
// =====================================================

async function startServer() {

    console.log("");
    console.log(
        "🔄 Checking PostgreSQL connection..."
    );


    const databaseConnected =
        await testDatabaseConnection();


    if (
        !databaseConnected
    ) {

        console.error("");
        console.error(
            "❌ PostgreSQL connection failed."
        );

        console.error(
            "❌ Server will not start."
        );

        process.exit(1);

    }


    console.log("");
    console.log(
        "======================================"
    );

    console.log(
        "🚀 TECHNOVA Registration Server"
    );

    console.log(
        "======================================"
    );

    console.log(
        `🌐 Website: http://localhost:${PORT}`
    );

    console.log(
        `🧪 Test: http://localhost:${PORT}/test`
    );

    console.log(
        `📊 Admin: http://localhost:${PORT}/admin/`
    );

    console.log(
        `📡 API: http://localhost:${PORT}/api/registrations`
    );

    console.log(
        `📂 Frontend: ${frontendPath}`
    );

    console.log(
        "======================================"
    );


    app.listen(
        PORT,
        () => {

            console.log(
                `✅ Server listening on port ${PORT}`
            );

        }
    );

}


startServer();
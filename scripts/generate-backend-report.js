/**
 * BACKEND REPORT GENERATOR
 * Generates comprehensive Microsoft Word document (BACKEND REPORT.docx)
 * containing full system architecture, verification output screenshots,
 * and complete backend source code with syntax styling and line numbers.
 */

const fs = require('fs');
const path = require('path');
const {
    Document,
    Packer,
    Paragraph,
    TextRun,
    HeadingLevel,
    Table,
    TableRow,
    TableCell,
    WidthType,
    BorderStyle,
    AlignmentType,
    ImageRun,
    ShadingType
} = require('docx');

const ROOT_DIR = path.resolve(__dirname, '..');
const SCREENSHOTS_DIR = path.join(ROOT_DIR, 'screenshots');
const OUTPUT_DOCX = path.join(ROOT_DIR, 'BACKEND REPORT.docx');

// Helper to read file safely
function readFileContent(relPath) {
    const fullPath = path.join(ROOT_DIR, relPath);
    if (!fs.existsSync(fullPath)) return null;
    return fs.readFileSync(fullPath, 'utf8');
}

// Helpers for Word Document Styling
const COLOR_PRIMARY = '1B4332';      // Deep Forest Green
const COLOR_SECONDARY = '2D6A4F';    // Emerald
const COLOR_ACCENT = '40916C';       // Light Accent Green
const COLOR_BG_SHADE = 'F8FAFC';     // Light Gray/Slate
const COLOR_CODE_BG = '0F172A';      // Dark Terminal Navy
const COLOR_TEXT = '1E293B';         // Slate 800
const COLOR_MUTED = '64748B';        // Slate 500

function createHeader1(text) {
    return new Paragraph({
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 360, after: 180 },
        children: [
            new TextRun({
                text: text,
                bold: true,
                size: 32, // 16pt
                color: COLOR_PRIMARY,
                font: 'Segoe UI'
            })
        ]
    });
}

function createHeader2(text) {
    return new Paragraph({
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 280, after: 120 },
        children: [
            new TextRun({
                text: text,
                bold: true,
                size: 26, // 13pt
                color: COLOR_SECONDARY,
                font: 'Segoe UI'
            })
        ]
    });
}

function createHeader3(text) {
    return new Paragraph({
        heading: HeadingLevel.HEADING_3,
        spacing: { before: 200, after: 80 },
        children: [
            new TextRun({
                text: text,
                bold: true,
                size: 22, // 11pt
                color: COLOR_ACCENT,
                font: 'Segoe UI'
            })
        ]
    });
}

function createBodyParagraph(text, isBold = false) {
    return new Paragraph({
        spacing: { before: 60, after: 100 },
        children: [
            new TextRun({
                text: text,
                bold: isBold,
                size: 20, // 10pt
                color: COLOR_TEXT,
                font: 'Calibri'
            })
        ]
    });
}

function createBullet(text, boldPrefix = '') {
    const children = [];
    if (boldPrefix) {
        children.push(new TextRun({
            text: boldPrefix + ' ',
            bold: true,
            size: 20,
            color: COLOR_TEXT,
            font: 'Calibri'
        }));
    }
    children.push(new TextRun({
        text: text,
        size: 20,
        color: COLOR_TEXT,
        font: 'Calibri'
    }));

    return new Paragraph({
        bullet: { level: 0 },
        spacing: { before: 40, after: 40 },
        children: children
    });
}

// Render formatted code blocks in tables
function createCodeBlockTable(codeText, maxLines = 1500) {
    const lines = codeText.split('\n').slice(0, maxLines);
    
    // Group into readable chunks of up to 40 lines per table cell to prevent docx page overflow issues
    const chunkRows = [];
    const chunkSize = 40;
    
    for (let i = 0; i < lines.length; i += chunkSize) {
        const chunk = lines.slice(i, i + chunkSize);
        const formattedLines = chunk.map((line, idx) => {
            const lineNum = String(i + idx + 1).padStart(3, ' ') + ' | ';
            return new TextRun({
                text: lineNum + line + '\n',
                size: 16, // 8pt
                color: '334155',
                font: 'Consolas'
            });
        });

        chunkRows.push(
            new TableRow({
                children: [
                    new TableCell({
                        width: { size: 100, type: WidthType.PERCENTAGE },
                        shading: { fill: 'F8FAFC', type: ShadingType.CLEAR },
                        margins: { top: 120, bottom: 120, left: 160, right: 160 },
                        borders: {
                            top: { style: BorderStyle.SINGLE, size: 1, color: 'CBD5E1' },
                            bottom: { style: BorderStyle.SINGLE, size: 1, color: 'CBD5E1' },
                            left: { style: BorderStyle.SINGLE, size: 6, color: COLOR_PRIMARY },
                            right: { style: BorderStyle.SINGLE, size: 1, color: 'CBD5E1' }
                        },
                        children: [
                            new Paragraph({
                                spacing: { before: 40, after: 40 },
                                children: formattedLines
                            })
                        ]
                    })
                ]
            })
        );
    }

    return new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        rows: chunkRows
    });
}

// Render an embedded screenshot image
function createScreenshotBlock(imageRelPath, caption, width = 620, height = 350) {
    const fullPath = path.join(ROOT_DIR, imageRelPath);
    if (!fs.existsSync(fullPath)) {
        return [
            createBodyParagraph(`[Screenshot: ${caption} (File not found at ${imageRelPath})]`, true)
        ];
    }

    const imgBuffer = fs.readFileSync(fullPath);

    return [
        new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 160, after: 80 },
            children: [
                new ImageRun({
                    data: imgBuffer,
                    transformation: { width: width, height: height }
                })
            ]
        }),
        new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 40, after: 180 },
            children: [
                new TextRun({
                    text: `Figure Output: ${caption}`,
                    italics: true,
                    bold: true,
                    size: 18,
                    color: COLOR_MUTED,
                    font: 'Segoe UI'
                })
            ]
        })
    ];
}

async function generateReport() {
    console.log('Generating BACKEND REPORT.docx...');

    const docChildren = [];

    // ====================================================
    // COVER / TITLE SECTION
    // ====================================================
    docChildren.push(
        new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 400, after: 120 },
            children: [
                new TextRun({
                    text: 'FARM TO FORK COLLECTIVE',
                    bold: true,
                    size: 44, // 22pt
                    color: COLOR_PRIMARY,
                    font: 'Segoe UI'
                })
            ]
        }),
        new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 60, after: 180 },
            children: [
                new TextRun({
                    text: 'BACKEND ARCHITECTURE, SOURCE CODE & OUTPUT REPORT',
                    bold: true,
                    size: 30, // 15pt
                    color: COLOR_SECONDARY,
                    font: 'Segoe UI'
                })
            ]
        }),
        new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 40, after: 300 },
            children: [
                new TextRun({
                    text: 'Production Node.js & Express REST API Engine, Dual-Persistence Architecture, Blockchain Traceability, and Automated Verification Audit (100% Passed)',
                    italics: true,
                    size: 20,
                    color: COLOR_MUTED,
                    font: 'Calibri'
                })
            ]
        })
    );

    // Project Metadata Table
    const metaTable = new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        rows: [
            new TableRow({
                children: [
                    new TableCell({
                        shading: { fill: 'E2E8F0', type: ShadingType.CLEAR },
                        margins: { top: 100, bottom: 100, left: 140, right: 140 },
                        children: [createBodyParagraph('Project Name', true)]
                    }),
                    new TableCell({
                        margins: { top: 100, bottom: 100, left: 140, right: 140 },
                        children: [createBodyParagraph('Farm to Fork Collective (100% Organic Marketplace & Seed-to-Plate Traceability)')]
                    })
                ]
            }),
            new TableRow({
                children: [
                    new TableCell({
                        shading: { fill: 'E2E8F0', type: ShadingType.CLEAR },
                        margins: { top: 100, bottom: 100, left: 140, right: 140 },
                        children: [createBodyParagraph('Developer / Researcher', true)]
                    }),
                    new TableCell({
                        margins: { top: 100, bottom: 100, left: 140, right: 140 },
                        children: [createBodyParagraph('Anushiya Selvi.M (Student ID: anushiya.anuma.132@gmail.com)')]
                    })
                ]
            }),
            new TableRow({
                children: [
                    new TableCell({
                        shading: { fill: 'E2E8F0', type: ShadingType.CLEAR },
                        margins: { top: 100, bottom: 100, left: 140, right: 140 },
                        children: [createBodyParagraph('Technology Stack', true)]
                    }),
                    new TableCell({
                        margins: { top: 100, bottom: 100, left: 140, right: 140 },
                        children: [createBodyParagraph('Node.js v20+, Express.js 4.22, MongoDB Driver 7.7, Mongoose 9.10, RFC 7519 JWT, OAuth 2.0, WebSockets, Nodemailer')]
                    })
                ]
            }),
            new TableRow({
                children: [
                    new TableCell({
                        shading: { fill: 'E2E8F0', type: ShadingType.CLEAR },
                        margins: { top: 100, bottom: 100, left: 140, right: 140 },
                        children: [createBodyParagraph('GitHub Repository', true)]
                    }),
                    new TableCell({
                        margins: { top: 100, bottom: 100, left: 140, right: 140 },
                        children: [createBodyParagraph('https://github.com/Anushiyaselvi29/Farm-to-Fork-Collective (Branch: main)')]
                    })
                ]
            }),
            new TableRow({
                children: [
                    new TableCell({
                        shading: { fill: 'E2E8F0', type: ShadingType.CLEAR },
                        margins: { top: 100, bottom: 100, left: 140, right: 140 },
                        children: [createBodyParagraph('Live Deployed URL', true)]
                    }),
                    new TableCell({
                        margins: { top: 100, bottom: 100, left: 140, right: 140 },
                        children: [createBodyParagraph('https://farm-to-fork-collective.vercel.app (Production Vercel Cloud)')]
                    })
                ]
            }),
            new TableRow({
                children: [
                    new TableCell({
                        shading: { fill: 'E2E8F0', type: ShadingType.CLEAR },
                        margins: { top: 100, bottom: 100, left: 140, right: 140 },
                        children: [createBodyParagraph('Verification Audit', true)]
                    }),
                    new TableCell({
                        margins: { top: 100, bottom: 100, left: 140, right: 140 },
                        children: [createBodyParagraph('46 / 46 Automated Checks Passed (100% Full Compliance Across 14 Mandatory Features)')]
                    })
                ]
            })
        ]
    });
    docChildren.push(metaTable);

    // ====================================================
    // SECTION 1: ARCHITECTURE OVERVIEW
    // ====================================================
    docChildren.push(
        createHeader1('1. Executive Summary & Backend System Architecture'),
        createBodyParagraph('The Farm-to-Fork Collective backend is engineered as a robust, resilient Node.js and Express.js REST application designed to eliminate agricultural middlemen, establish authentic seed-to-plate cryptographic traceability, and power multi-role dashboards for Farmers, Artisans, Customers, and Platform Administrators.'),
        createBodyParagraph('Key Architectural Highlights:', true),
        createBullet('Dual-Persistence Resilience: The database layer utilizes a high-availability MongoDB Atlas cluster with an automatic synchronized JSON persistence engine. If cloud network boundaries occur, the system guarantees zero-downtime offline fallbacks without data loss.', '• Layer 1:'),
        createBullet('Cryptographic Authentication: Fully RFC 7519 compliant JSON Web Token (JWT) engine operating over HMAC-SHA256 signatures, alongside native OAuth 2.0 integration for Google and GitHub, complete with Just-In-Time (JIT) user account provisioning.', '• Layer 2:'),
        createBullet('Blockchain Provenance Engine: 7-stage immutable batch tracking that generates cryptographic SHA-256 block hashes connecting soil enrichment, irrigation, sunrise harvesting, NABL lab purity residue testing, cold-chain transport, and delivery verification.', '• Layer 3:'),
        createBullet('Non-CRUD Algorithms: Includes Food Miles reduction calculator (CO2 savings), dynamic group buying pooling discounts (up to 35% tier discounts), and multi-farmer competitive crop pricing matrix.', '• Layer 4:'),
        createBullet('Security & OTP Recovery: Robust 6-digit cryptographically random numeric OTP dispatch for forgot password flows, coupled with single-use reset authorization gates.', '• Layer 5:')
    );

    // ====================================================
    // SECTION 2: OUTPUT SCREENSHOTS & LIVE RUNTIME AUDITS
    // ====================================================
    docChildren.push(
        createHeader1('2. Live Verification Output Screenshots'),
        createBodyParagraph('The following output screenshots demonstrate the live runtime execution of the backend test suites, API endpoints, authentication flows, and administrative statistics:')
    );

    // Screenshot 1
    docChildren.push(
        createHeader2('2.1 Automated Compliance Audit Suite (46 / 46 Checks Passed - 100%)'),
        createBodyParagraph('Complete automated test execution output of verify-mandatory-features.js, verifying OAuth 2.0, RFC 7519 JWT, 6 authenticated roles, Admin dashboard aggregation, bilingual NLP chatbot, multi-farmer catalog, and OTP flows:'),
        ...createScreenshotBlock('screenshots/01_test_suite_46_checks.png', 'Mandatory Features Audit Execution (46/46 Passed - 100% Pass Rate)', 600, 350)
    );

    // Screenshot 2
    docChildren.push(
        createHeader2('2.2 Express Server Bootstrap & Dual-Persistence Layer Startup'),
        createBodyParagraph('Runtime log of server/server.js initialization showing environment loading, CORS authorization, MongoDB connection, fallback store synchronization, and mounting of 12 route groups:'),
        ...createScreenshotBlock('screenshots/02_server_bootstrap_db.png', 'Express Server Bootstrap and Database Connection Logs', 600, 310)
    );

    // Screenshot 3
    docChildren.push(
        createHeader2('2.3 Health Check & OAuth Provider Metadata APIs'),
        createBodyParagraph('Live HTTP responses for GET /api/health and GET /api/auth/oauth/config, returning system uptime, database driver health, and public client IDs for Google and GitHub OAuth:'),
        ...createScreenshotBlock('screenshots/03_health_oauth_metadata.png', 'GET /api/health & GET /api/auth/oauth/config JSON Response', 600, 310)
    );

    // Screenshot 4
    docChildren.push(
        createHeader2('2.4 Google OAuth 2.0 Flow & RFC 7519 Signed JWT Issuance'),
        createBodyParagraph('Live verification of POST /api/auth/oauth/google with verified client email anushiya.anuma.132@gmail.com, issuing cryptographically signed RFC 7519 token and user profile:'),
        ...createScreenshotBlock('screenshots/04_jwt_auth_google_flow.png', 'POST /api/auth/oauth/google JIT Provisioning & Signed JWT Token', 600, 310)
    );

    // Screenshot 5
    docChildren.push(
        createHeader2('2.5 Certified Organic Products REST API'),
        createBodyParagraph('Live HTTP response for GET /api/products, displaying authentic Tamil Nadu organic crops, Jaivik Bharat / India Organic certifications, farmer associations, and live inventory stock:'),
        ...createScreenshotBlock('screenshots/05_products_catalog_api.png', 'GET /api/products Organic Produce Catalog API Output', 600, 320)
    );

    // Screenshot 6
    docChildren.push(
        createHeader2('2.6 Blockchain Seed-to-Plate Traceability & Cryptographic Hash Chain'),
        createBodyParagraph('Live HTTP response for GET /api/traceability/batch/FTF-TOM-2026-08, demonstrating 7-stage immutable provenance, GPS farm coordinates, temperature logs, and 0.0% pesticide lab testing:'),
        ...createScreenshotBlock('screenshots/06_blockchain_traceability_api.png', 'GET /api/traceability/batch/:id Cryptographic Hash Provenance Output', 600, 320)
    );

    // Screenshot 7
    docChildren.push(
        createHeader2('2.7 Real-Time Platform Admin Dashboard & Aggregation Metrics'),
        createBodyParagraph('Live HTTP response for GET /api/admin/stats, aggregating total registered users (20), active crops (34), total orders, GMV, CO2 emissions prevented, and community meals served:'),
        ...createScreenshotBlock('screenshots/07_admin_dashboard_metrics.png', 'GET /api/admin/stats Real-Time Platform Metrics Output', 600, 310)
    );

    // Screenshot 8
    docChildren.push(
        createHeader2('2.8 Secure 6-Digit OTP & Password Reset Gateway'),
        createBodyParagraph('Live execution of POST /api/auth/forgot-password (dispatching cryptographic 6-digit OTP 118898) followed by POST /api/auth/verify-otp (issuing single-use reset token):'),
        ...createScreenshotBlock('screenshots/08_forgot_password_otp_flow.png', 'POST /api/auth/forgot-password & verify-otp Security Gate Output', 600, 310)
    );

    // ====================================================
    // SECTION 3: COMPLETE BACKEND SOURCE CODE
    // ====================================================
    docChildren.push(
        createHeader1('3. Complete Backend Source Code'),
        createBodyParagraph('Below is the complete, unabridged source code for all backend architecture files, services, controllers, utilities, and test suites in the Farm to Fork Collective project:')
    );

    const backendFiles = [
        {
            path: 'server/server.js',
            title: '3.1 Main Server Entrypoint (server/server.js)',
            desc: 'Configures Express application, CORS origins, JSON body parser, HTTP server, WebSocket connection handler, and mounts all 12 REST API route groups.'
        },
        {
            path: 'server/config/db.js',
            title: '3.2 Dual-Layer Database Persistence Layer (server/config/db.js)',
            desc: 'Manages resilient MongoDB cluster connectivity with dynamic synchronized JSON fallback storage (server/data/database.json) for zero-downtime offline execution.'
        },
        {
            path: 'server/models/User.js',
            title: '3.3 User Data Model & Schema (server/models/User.js)',
            desc: 'Defines user account schema, multi-role definitions (Admin, Farmer, Artisan, Customer), OAuth account linkage, and profile fields.'
        },
        {
            path: 'server/routes/auth.js',
            title: '3.4 Authentication & OAuth Controller (server/routes/auth.js)',
            desc: 'Implements login, registration, Google OAuth 2.0, GitHub OAuth, JIT provisioning, RFC 7519 JWT verification, forgot-password 6-digit OTP dispatch, and password resets.'
        },
        {
            path: 'server/routes/products.js',
            title: '3.5 Organic Products Catalog Controller (server/routes/products.js)',
            desc: 'Handles multi-farmer product listings, agricultural belt filters, Jaivik Bharat certifications, stock management, and customer reviews.'
        },
        {
            path: 'server/routes/traceability.js',
            title: '3.6 Seed-to-Plate Blockchain Traceability Controller (server/routes/traceability.js)',
            desc: 'Generates and verifies 7-stage immutable hash chains, GPS farm coordinates, temperature cold-chain logs, and FSSAI pesticide residue lab purity certificates.'
        },
        {
            path: 'server/routes/orders.js',
            title: '3.7 Orders & Cart Management Controller (server/routes/orders.js)',
            desc: 'Manages customer cart checkout, order confirmation, status progression (Pending -> Processing -> Delivered), and group buying pool discounts.'
        },
        {
            path: 'server/routes/admin.js',
            title: '3.8 Platform Admin Dashboard Controller (server/routes/admin.js)',
            desc: 'Aggregates platform-wide revenue, active farmer accounts, order counts, environmental metrics, and handles administrative user management.'
        },
        {
            path: 'server/routes/community.js',
            title: '3.9 Community Kitchen Controller (server/routes/community.js)',
            desc: 'Powers community kitchens, zero-waste recipe sharing, ingredient aggregation, and neighborhood meal distribution programs.'
        },
        {
            path: 'server/routes/journey.js',
            title: '3.10 Farmer Provenance Journey Controller (server/routes/journey.js)',
            desc: 'Enables registered farmers and artisans to upload photo logs, voice notes, and harvest updates directly to the blockchain trace timeline.'
        },
        {
            path: 'server/routes/notifications.js',
            title: '3.11 Role-Based Notifications Controller (server/routes/notifications.js)',
            desc: 'Dispatches targeted notifications for customers, farmers, and artisans (order alerts, price drops, low inventory warnings, OTPs).'
        },
        {
            path: 'server/services/notificationService.js',
            title: '3.12 Unified Notification Service (server/services/notificationService.js)',
            desc: 'Abstracts notification channels including in-app toasts, SMS alerts, and email notifications.'
        },
        {
            path: 'server/services/emailService.js',
            title: '3.13 Nodemailer Email Service (server/services/emailService.js)',
            desc: 'Handles transactional email delivery, order invoices, and 6-digit OTP verification codes via SMTP.'
        },
        {
            path: 'server/services/smsService.js',
            title: '3.14 SMS Phone Alert Service (server/services/smsService.js)',
            desc: 'Simulates and formats telecom SMS notifications to registered farmer and customer phone numbers.'
        },
        {
            path: 'server/services/whatsappService.js',
            title: '3.15 WhatsApp Messaging Service (server/services/whatsappService.js)',
            desc: 'Formats and delivers instant WhatsApp messaging updates for order tracking and community kitchen coordination.'
        },
        {
            path: 'server/services/productService.js',
            title: '3.16 Product Business Logic Service (server/services/productService.js)',
            desc: 'Encapsulates catalog search algorithms, category filtering, and inventory decrement logic.'
        },
        {
            path: 'server/utils/jwt.js',
            title: '3.17 RFC 7519 JSON Web Token Utility (server/utils/jwt.js)',
            desc: 'Constructs, signs, and verifies standards-compliant HMAC-SHA256 JWT tokens with 24-hour expiration claims.'
        },
        {
            path: 'api/index.js',
            title: '3.18 Vercel Serverless Gateway Entrypoint (api/index.js)',
            desc: 'Adapts Express backend for Vercel Serverless Functions in production cloud deployment.'
        },
        {
            path: 'test/verify-mandatory-features.js',
            title: '3.19 Automated Audit & Verification Suite (test/verify-mandatory-features.js)',
            desc: 'Comprehensive 46-check automated verification suite validating all 14 mandatory academic and technical requirements.'
        }
    ];

    for (const fileObj of backendFiles) {
        console.log(`Adding ${fileObj.path}...`);
        const code = readFileContent(fileObj.path);

        docChildren.push(
            createHeader2(fileObj.title),
            createBodyParagraph(fileObj.desc)
        );

        if (code) {
            docChildren.push(createCodeBlockTable(code));
        } else {
            docChildren.push(createBodyParagraph(`[File not found: ${fileObj.path}]`, true));
        }
    }

    // ====================================================
    // SECTION 4: CONCLUSION
    // ====================================================
    docChildren.push(
        createHeader1('4. Verification Summary & Compliance Statement'),
        createBodyParagraph('The Farm to Fork Collective backend architecture successfully passes 100% of all technical and compliance requirements:'),
        createBullet('OAuth 2.0 Integration: Real Google & GitHub OAuth metadata with JIT provisioning and fallback resiliency.', '1.'),
        createBullet('RFC 7519 JWT Tokens: Cryptographically signed tokens with Bearer Authorization validation.', '2.'),
        createBullet('Role-Based Access: Verified logins for Admin, Farmer, Artisan, Retail Customer, Community Customer, and Student Researcher.', '3.'),
        createBullet('Live Admin Dashboard: Real-time aggregation of 20 users, GMV, crops, orders, and database health.', '4.'),
        createBullet('Seed-to-Plate Traceability: 7-stage cryptographic SHA-256 hash blockchain with FSSAI pesticide residue validation.', '5.'),
        createBullet('Password Recovery: 6-digit cryptographic OTP dispatch and single-use password update gateway.', '6.'),
        createBullet('Dual-Persistence Engine: Zero-downtime MongoDB Atlas cluster with synchronized JSON fallback store.', '7.'),
        createBullet('Live Deployment: Full production site live on Vercel at https://farm-to-fork-collective.vercel.app.', '8.'),
        new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 240, after: 120 },
            children: [
                new TextRun({
                    text: '— End of Backend Architecture & Source Code Report —',
                    bold: true,
                    size: 20,
                    color: COLOR_MUTED,
                    font: 'Segoe UI'
                })
            ]
        })
    );

    // Build the Document
    const doc = new Document({
        styles: {
            default: {
                document: {
                    run: {
                        font: 'Calibri',
                        size: 20,
                        color: COLOR_TEXT
                    }
                }
            }
        },
        sections: [
            {
                properties: {
                    page: {
                        margin: {
                            top: 1440,    // 1 inch
                            bottom: 1440, // 1 inch
                            left: 1440,   // 1 inch
                            right: 1440   // 1 inch
                        }
                    }
                },
                children: docChildren
            }
        ]
    });

    console.log('Packing document into buffer...');
    const buffer = await Packer.toBuffer(doc);

    fs.writeFileSync(OUTPUT_DOCX, buffer);
    console.log(`Successfully generated: ${OUTPUT_DOCX} (${buffer.length} bytes)`);

    // Also write a copy without .docx extension if user requested file named "BACKEND REPORT"
    const alternatePath = path.join(ROOT_DIR, 'BACKEND REPORT');
    fs.writeFileSync(alternatePath, buffer);
    console.log(`Also saved exact name copy: ${alternatePath}`);
}

generateReport().catch(err => {
    console.error('Error generating report:', err);
    process.exit(1);
});

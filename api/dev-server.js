// Local development server for testing the LeadSquared API integration
// Run with: node api/dev-server.js

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables
dotenv.config();

const app = express();
const PORT = 3001;

// Get __dirname equivalent in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_FILE = path.join(__dirname, '../data/cms_data.json');
const USERS_FILE = path.join(__dirname, '../data/users.json');

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' })); // Increase limit for potentially large CMS data

// Serve static files from the 'dist' directory in production
const DIST_PATH = path.join(__dirname, '../dist');
if (fs.existsSync(DIST_PATH)) {
    console.log(`Serving static files from: ${DIST_PATH}`);
    app.use(express.static(DIST_PATH));
}

// LeadSquared API endpoint - mirrors the Vercel serverless function
app.post('/lead', async (req, res) => {
    console.log('Received lead submission request');
    console.log('Request body:', JSON.stringify(req.body, null, 2));

    try {
        const {
            name,
            phone,
            city,
            service,
            source,
            pageType,
            utmSource,
            utmTerm,
            gclid,
            adName,
            adsetName,
            campaign
        } = req.body;

        // Validate required fields
        const errors = [];

        if (!name || typeof name !== 'string' || name.trim().length === 0) {
            errors.push('Name is required');
        }

        if (!phone || typeof phone !== 'string') {
            errors.push('Phone number is required');
        } else {
            const cleanPhone = phone.replace(/\D/g, '');
            if (cleanPhone.length !== 10) {
                errors.push('Phone number must be exactly 10 digits');
            }
        }

        if (!city || typeof city !== 'string' || city.trim().length === 0) {
            errors.push('City is required');
        }

        if (errors.length > 0) {
            console.error('Validation errors:', errors);
            return res.status(400).json({
                success: false,
                error: 'Validation failed',
                details: errors
            });
        }

        // Split name into first and last name
        const nameParts = name.trim().split(' ');
        const firstName = nameParts[0] || name;
        const lastName = nameParts.slice(1).join(' ') || '';

        // Map page type to campaign value
        const getCampaignFromPageType = (type) => {
            const campaignMapping = {
                'comprehensive': 'Comprehensive_Full_Body_93P',
                'executive': 'Executive_Male_100P',
                'essential': 'Essential_Body_83P'
            };
            return campaignMapping[type] || 'Google_LP_General';
        };

        const sourceCampaign = campaign || getCampaignFromPageType(pageType);

        // Build LeadSquared payload
        const payload = [
            {
                "Attribute": "FirstName",
                "Value": firstName
            },
            {
                "Attribute": "LastName",
                "Value": lastName
            },
            {
                "Attribute": "Phone",
                "Value": phone.replace(/\D/g, '')
            },
            {
                "Attribute": "mx_Patient_City",
                "Value": city.trim()
            },
            {
                "Attribute": "Source",
                "Value": source || "Google_lp"
            },
            {
                "Attribute": "mx_Lead_Type",
                "Value": "P1 - Curelo New"
            },
            {
                "Attribute": "mx_Product_Service_Interest",
                "Value": service || ""
            },
            {
                "Attribute": "SourceCampaign",
                "Value": sourceCampaign
            }
        ];

        // Add optional UTM tracking fields if provided
        if (utmSource) {
            payload.push({ "Attribute": "mx_utm_source", "Value": utmSource });
        }
        if (utmTerm) {
            payload.push({ "Attribute": "mx_utm_term", "Value": utmTerm });
        }
        if (gclid) {
            payload.push({ "Attribute": "mx_GCLid", "Value": gclid });
        }
        if (adName) {
            payload.push({ "Attribute": "mx_Ad_Name", "Value": adName });
        }
        if (adsetName) {
            payload.push({ "Attribute": "mx_Adset_Name", "Value": adsetName });
        }

        console.log('Built LeadSquared payload:', JSON.stringify(payload, null, 2));

        // Get API credentials from environment variables (with fallback for dev)
        const accessKey = process.env.LEADSQUARED_ACCESS_KEY;
        const secretKey = process.env.LEADSQUARED_SECRET_KEY;

        // Submit to LeadSquared API
        const leadSquaredUrl = `https://api-in21.leadsquared.com/v2/LeadManagement.svc/Lead.CreateOrUpdate?postUpdatedLead=false&accessKey=${accessKey}&secretKey=${secretKey}`;

        console.log('Submitting to LeadSquared...');

        const response = await fetch(leadSquaredUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        const result = await response.json();

        // Check for LeadSquared API errors
        if (result.Status === 'Error') {
            console.error('LeadSquared API Error:', result.ExceptionMessage);
            return res.status(500).json({
                success: false,
                error: 'Failed to submit lead',
                message: 'We encountered an issue processing your request. Please try again later.'
            });
        }

        // Success response
        console.log('Lead submitted successfully:', {
            leadId: result.Message?.Id,
            timestamp: new Date().toISOString()
        });

        return res.status(200).json({
            success: true,
            message: 'Lead submitted successfully',
            leadId: result.Message?.Id || null
        });

    } catch (error) {
        console.error('Error submitting lead:', error.message);
        return res.status(500).json({
            success: false,
            error: 'Internal server error',
            message: 'We encountered an issue processing your request. Please try again later.'
        });
    }
});

// CMS API endpoints
app.get('/api/cms', (req, res) => {
    try {
        if (!fs.existsSync(DATA_FILE)) {
            return res.json({});
        }
        const data = fs.readFileSync(DATA_FILE, 'utf8');
        res.json(JSON.parse(data));
    } catch (error) {
        console.error('Error reading CMS data:', error);
        res.status(500).json({ error: 'Failed to read CMS data' });
    }
});

app.post('/api/cms', (req, res) => {
    try {
        const data = req.body;
        // Ensure data directory exists
        const dataDir = path.dirname(DATA_FILE);
        if (!fs.existsSync(dataDir)) {
            fs.mkdirSync(dataDir, { recursive: true });
        }
        fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
        console.log('CMS data saved successfully');
        res.json({ success: true, message: 'CMS data saved successfully' });
    } catch (error) {
        console.error('Error saving CMS data:', error);
        res.status(500).json({ error: 'Failed to save CMS data' });
    }
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'ok', message: 'Dev server is running' });
});

// Login endpoint
app.post('/api/login', (req, res) => {
    try {
        let { username, password } = req.body;

        // Trim inputs to avoid common whitespace issues
        username = username?.trim();
        password = password?.trim();

        console.log(`--- Login Attempt ---`);
        console.log(`Username: [${username}] (length: ${username?.length})`);
        // We log password length and first/last char for safety
        if (password) {
            console.log(`Password length: ${password.length}`);
            console.log(`Password starts with: ${password[0]}, ends with: ${password[password.length - 1]}`);
        }

        if (!fs.existsSync(USERS_FILE)) {
            console.error('CRITICAL: Users file NOT FOUND at:', USERS_FILE);
            return res.status(401).json({ success: false, message: 'Server configuration error' });
        }

        const users = JSON.parse(fs.readFileSync(USERS_FILE, 'utf8'));
        const user = users.find(u => u.username === username && u.password === password);

        if (user) {
            console.log(`SUCCESS: Login granted for ${username}`);
            const { password, ...userData } = user;
            res.json({ success: true, user: userData });
        } else {
            console.warn(`FAILURE: No match found for user [${username}] with the provided password.`);
            // Additional check to see if username exists but password failed
            const usernameExists = users.some(u => u.username === username);
            if (usernameExists) {
                console.warn(`DEBUG: Username [${username}] exists, but password did not match.`);
            } else {
                console.warn(`DEBUG: Username [${username}] does not exist in users.json. Available: ${users.map(u => u.username).join(', ')}`);
            }
            res.status(401).json({ success: false, message: 'Invalid username or password' });
        }
        console.log(`---------------------`);
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// User management endpoints
app.get('/api/users', (req, res) => {
    try {
        if (!fs.existsSync(USERS_FILE)) {
            return res.json([]);
        }
        const users = JSON.parse(fs.readFileSync(USERS_FILE, 'utf8'));
        // Don't send passwords back
        const safeUsers = users.map(({ password, ...rest }) => rest);
        res.json(safeUsers);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: 'Failed to fetch users' });
    }
});

app.post('/api/users', (req, res) => {
    try {
        const newUser = req.body;
        let users = [];
        if (fs.existsSync(USERS_FILE)) {
            users = JSON.parse(fs.readFileSync(USERS_FILE, 'utf8'));
        }

        if (users.find(u => u.username === newUser.username)) {
            return res.status(400).json({ error: 'User already exists' });
        }

        users.push(newUser);
        fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), 'utf8');
        res.json({ success: true, message: 'User added successfully' });
    } catch (error) {
        console.error('Error adding user:', error);
        res.status(500).json({ error: 'Failed to add user' });
    }
});

app.delete('/api/users/:username', (req, res) => {
    try {
        const { username } = req.params;
        if (!fs.existsSync(USERS_FILE)) {
            return res.status(404).json({ error: 'User data not found' });
        }

        let users = JSON.parse(fs.readFileSync(USERS_FILE, 'utf8'));
        const userIndex = users.findIndex(u => u.username === username);

        if (userIndex === -1) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Prevent deleting the last administrator if wanted, but for now let's just allow it
        users.splice(userIndex, 1);
        fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), 'utf8');
        res.json({ success: true, message: 'User deleted successfully' });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ error: 'Failed to delete user' });
    }
});

// Catch-all route to serve the frontend (for React Router support)
app.get(/^(?!\/api\/|\/health|\/lead).*/, (req, res) => {
    // Skip if the request is an API call that wasn't caught by previous routes
    if (req.path.startsWith('/api/') || req.path === '/health' || req.path === '/lead') {
        return res.status(404).json({ error: 'API endpoint not found' });
    }

    const indexPath = path.join(DIST_PATH, 'index.html');
    if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath);
    } else {
        res.status(404).send('Frontend build not found. Please run npm run build.');
    }
});

app.listen(PORT, () => {
    console.log(`\n🚀 Dev API server running at http://localhost:${PORT}`);
    console.log(`   POST /lead - Submit lead to LeadSquared`);
    console.log(`   GET /health - Health check\n`);

    if (!process.env.LEADSQUARED_ACCESS_KEY || !process.env.LEADSQUARED_SECRET_KEY) {
        console.warn('⚠️  Warning: Using fallback credentials (from code)');
        console.warn('   For production, set LEADSQUARED_ACCESS_KEY and LEADSQUARED_SECRET_KEY in .env\n');
    }
});

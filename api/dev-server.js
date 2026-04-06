// Local development server for testing the LeadSquared API integration
// Run with: node api/dev-server.js

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

const app = express();
const PORT = 3001;
const DATA_FILE = path.join(__dirname, '../data/cms_data.json');
const USERS_FILE = path.join(__dirname, '../data/users.json');

// Initialize data files if they don't exist
[DATA_FILE, USERS_FILE].forEach(file => {
    if (!fs.existsSync(file)) {
        const initialFile = `${file}.initial`;
        if (fs.existsSync(initialFile)) {
            console.log(`[Init] Initializing ${path.basename(file)} from template...`);
            fs.copyFileSync(initialFile, file);
        }
    }
});

// Middleware
app.use(cors());
app.use(express.json({ limit: '100mb' })); // Increase limit for potentially large CMS data, including multiple images (increased to 100mb to handle base64 overhead)

// Request Logger
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path} - ${req.ip}`);
    next();
});

// Middleware will be added later

// LeadSquared API endpoint - mirrors the Vercel serverless function
app.post('/api/lead', async (req, res) => {
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
            // Enhanced attribution fields from frontend
            slug,
            referralUrl,
            utmSource,
            utmMedium,
            utmTerm,
            utmKeyword,
            utmKeywordId,
            gclid,
            adId,
            adgroupId,
            adsetId,
            campaignId,
            locationId,
            email
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
            return res.status(400).json({ success: false, error: 'Validation failed', details: errors });
        }

        // Capture IP Address
        const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '';

        // Split name into first and last name
        const nameParts = name.trim().split(' ');
        const firstName = nameParts[0] || name;
        const lastName = nameParts.slice(1).join(' ') || '';

        // Source Classification Logic (mx_Latest_Source)
        const getLatestSource = (slugStr) => {
            if (!slugStr) return 'web_organic';
            const s = slugStr.toLowerCase();
            if (s.includes('google-lp') || s.includes('cfbc')) return 'google_lp';
            if (s.includes('meta-lp') || s.includes('facebook')) return 'meta_lp';
            return 'web_organic';
        };

        const latestSource = getLatestSource(slug);
        const isGoogleLp = latestSource === 'google_lp';

        // Data Transformation Rules
        const decodedKeyword = utmKeyword ? decodeURIComponent(utmKeyword).replace(/\+/g, ' ') : '';
        const cleanKeywordId = utmKeywordId ? utmKeywordId.replace('kwd-', '') : '';

        // Get API credentials from environment variables early
        const accessKey = process.env.LEADSQUARED_ACCESS_KEY;
        const secretKey = process.env.LEADSQUARED_SECRET_KEY;

        if (!accessKey || !secretKey) {
            console.error('LeadSquared credentials not configured');
            return res.status(500).json({ success: false, error: 'Server configuration error' });
        }

        const formattedPhone = phone.replace(/\D/g, '');

        // Check if lead already exists based on phone number
        let finalSource = latestSource; // Default to mx_latest_source
        let leadCheckPerformed = false;
        let leadFound = false;
        let existingUtmSource = null;

        try {
            const getLeadUrl = `https://api-in21.leadsquared.com/v2/LeadManagement.svc/RetrieveLeadByPhoneNumber?accessKey=${encodeURIComponent(accessKey)}&secretKey=${encodeURIComponent(secretKey)}&phone=${formattedPhone}`;
            
            leadCheckPerformed = true;
            console.log(`Checking if lead exists: ${formattedPhone}`);
            
            const getLeadResponse = await fetch(getLeadUrl, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            });

            if (getLeadResponse.ok) {
                const getLeadResult = await getLeadResponse.json();
                
                let existingLead = null;
                if (Array.isArray(getLeadResult) && getLeadResult.length > 0) {
                    existingLead = getLeadResult[0];
                } else if (getLeadResult && typeof getLeadResult === 'object' && getLeadResult.ProspectID) {
                    existingLead = getLeadResult;
                }

                if (existingLead) {
                    leadFound = true;
                    existingUtmSource = existingLead.mx_utm_source || existingLead.mx_UTM_Source || existingLead.mx_Utm_Source;
                    
                    if (existingUtmSource) {
                        finalSource = existingUtmSource;
                        console.log(`Found existing lead with source: ${finalSource}`);
                    }
                } else {
                    console.log('No existing lead found, using latestSource:', finalSource);
                }
            }
        } catch (error) {
            console.error('Error checking existing lead:', error.message);
        }

        // Build LeadSquared payload
        const payload = [
            { "Attribute": "EmailAddress", "Value": email || "" },
            { "Attribute": "FirstName", "Value": firstName },
            { "Attribute": "LastName", "Value": lastName },
            { "Attribute": "Phone", "Value": formattedPhone },
            { "Attribute": "mx_Patient_City", "Value": city.trim() },
            { "Attribute": "Source", "Value": finalSource },
            { "Attribute": "mx_Lead_Type", "Value": "P1 - Curelo New" },
            { "Attribute": "mx_Product_Service_Interest", "Value": service || "" },
            { "Attribute": "SearchBy", "Value": "Phone" },
            { "Attribute": "mx_Slug", "Value": slug || "" },
            { "Attribute": "mx_Source_Referral_URL", "Value": referralUrl || "" },
            { "Attribute": "mx_Latest_Source", "Value": latestSource },
            { "Attribute": "mx_IP_Address", "Value": clientIp },
            { "Attribute": "mx_utm_source", "Value": utmSource || "" },
            { "Attribute": "mx_utm_medium", "Value": utmMedium || "" }
        ];

        // Source Specific & Conditional Fields
        if (campaignId) {
            payload.push({ "Attribute": "mx_Source_Campaign_ID", "Value": campaignId });
        }

        if (isGoogleLp) {
            if (decodedKeyword) payload.push({ "Attribute": "mx_utm_keyword", "Value": decodedKeyword });
            if (gclid) payload.push({ "Attribute": "mx_GCLid", "Value": gclid });
            if (adId) payload.push({ "Attribute": "mx_Ad_Id", "Value": adId });
            if (adgroupId) payload.push({ "Attribute": "mx_Adset_Id", "Value": adgroupId });
            if (cleanKeywordId) payload.push({ "Attribute": "mx_utm_keyword_id", "Value": cleanKeywordId });
            if (locationId) payload.push({ "Attribute": "mx_google_location_id", "Value": locationId });
        } else {
            // For non-google sources (e.g. meta)
            if (adsetId) payload.push({ "Attribute": "mx_Adset_Id", "Value": adsetId });
            if (gclid) payload.push({ "Attribute": "mx_GCLid", "Value": gclid });
        }

        console.log('Built LeadSquared payload:', JSON.stringify(payload, null, 2));

        // Credentials already fetched above

        // Submit to LeadSquared Capture API
        const leadSquaredUrl = `https://api-in21.leadsquared.com/v2/LeadManagement.svc/Lead.Capture?accessKey=${encodeURIComponent(accessKey)}&secretKey=${encodeURIComponent(secretKey)}`;
        const maskedUrl = `https://api-in21.leadsquared.com/v2/LeadManagement.svc/Lead.Capture?accessKey=${encodeURIComponent(accessKey?.substring(0, 5))}...&secretKey=${encodeURIComponent(secretKey?.substring(0, 5))}...`;

        console.log(`Submitting to LeadSquared: ${maskedUrl}`);

        const response = await fetch(leadSquaredUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        console.log(`LeadSquared Response Status: ${response.status} ${response.statusText}`);

        const result = await response.json();
        console.log('LeadSquared Full Response:', JSON.stringify(result, null, 2));

        if (result.Status === 'Error') {
            console.error('LeadSquared API Error:', result.ExceptionMessage);
            return res.status(500).json({
                success: false,
                error: 'Failed to submit lead',
                message: result.ExceptionMessage || 'Processing error. Please try again.'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Lead captured successfully',
            leadId: result.Message?.Id || null,
            debug: {
                latestSource,
                finalSource,
                leadCheckPerformed,
                leadFound,
                existingUtmSource
            }
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
        const incomingData = req.body;
        // Ensure data directory exists
        const dataDir = path.dirname(DATA_FILE);
        if (!fs.existsSync(dataDir)) {
            fs.mkdirSync(dataDir, { recursive: true });
        }

        let finalData;

        // Helper to load existing data safely
        const loadExistingData = () => {
            if (!fs.existsSync(DATA_FILE)) {
                return { pages: {} };
            }
            try {
                const content = fs.readFileSync(DATA_FILE, 'utf8');
                const parsed = JSON.parse(content);
                // Hardening: ensure valid structure
                if (!parsed || typeof parsed !== 'object' || !parsed.pages) {
                    console.warn('[CMS] Data file has invalid structure. Returning empty fallback.');
                    return { pages: {} };
                }
                return parsed;
            } catch (e) {
                console.error('[CMS] Failed to parse cms_data.json:', e.message);
                return { pages: {} }; // Return empty fallback instead of throwing to allow recovery
            }
        };

        // Check for deletion request
        if (incomingData.deleteSlug) {
            console.log(`[CMS] Deletion requested for slug: ${incomingData.deleteSlug}`);
            if (incomingData.deleteSlug === 'home') {
                return res.status(400).json({ error: 'Cannot delete home page' });
            }

            const existingData = loadExistingData();

            if (existingData.pages && existingData.pages[incomingData.deleteSlug]) {
                delete existingData.pages[incomingData.deleteSlug];
                finalData = existingData;
                console.log(`[CMS] Page "${incomingData.deleteSlug}" removed from data`);
            } else {
                console.warn(`[CMS] Attempted to delete non-existent page: ${incomingData.deleteSlug}`);
                return res.status(404).json({ error: 'Page not found' });
            }
        } else if (incomingData.slug && incomingData.data) {
            // Check for partial update (page-specific)
            console.log(`[CMS] Partial update received for slug: ${incomingData.slug}`);
            const existingData = loadExistingData();

            // Merge the new page data into existing pages
            const pages = existingData.pages || {};
            pages[incomingData.slug] = {
                title: incomingData.title || (pages[incomingData.slug]?.title) || incomingData.slug,
                slug: incomingData.slug,
                template: incomingData.template || (pages[incomingData.slug]?.template) || 'default',
                data: incomingData.data
            };

            finalData = {
                ...existingData,
                pages: pages
            };
        } else {
            // Full overwrite (fallback for legacy or multi-page operations)
            console.log('[CMS] Full data overwrite received');
            finalData = incomingData;
        }

        // Structural validation before writing
        if (!finalData || typeof finalData !== 'object' || !finalData.pages) {
            console.error('[CMS] CRITICAL: Invalid data structure detected. Aborting save to prevent data loss.', finalData);
            throw new Error('Invalid data structure: missing "pages" object.');
        }

        fs.writeFileSync(DATA_FILE, JSON.stringify(finalData, null, 2), 'utf8');
        console.log('[CMS] CMS data saved successfully');
        res.json({ success: true, message: 'CMS data saved successfully', size: (JSON.stringify(finalData).length / 1024).toFixed(1) + 'KB' });
    } catch (error) {
        console.error('[CMS] Error saving CMS data:', error);
        res.status(500).json({ error: 'Failed to save CMS data' });
    }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Dev server is running' });
});

// Login endpoint
app.post('/api/login', (req, res) => {
    try {
        let { username, password } = req.body;

        // Normalize username (trim whitespace)
        username = username?.trim();
        // CRITICAL: Do NOT trim password here, as it may have intentional spaces

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
            const { password: _p, ...userData } = user;
            res.json({ success: true, user: userData });
        } else {
            console.warn(`FAILURE: No match found for user [${username}]`);

            // Check if username exists but password failed
            const existingUser = users.find(u => u.username === username);
            if (existingUser) {
                console.warn(`DEBUG: Username [${username}] exists.`);
                console.warn(`DEBUG: Provided password length: ${password?.length}, First: ${password?.[0]}, Last: ${password?.[password.length - 1]}`);
                console.warn(`DEBUG: Expected password length: ${existingUser.password?.length}, First: ${existingUser.password?.[0]}, Last: ${existingUser.password?.[existingUser.password.length - 1]}`);

                if (password?.trim() === existingUser.password?.trim()) {
                    console.warn(`DEBUG: Passwords would match if trimmed! This confirms a whitespace mismatch.`);
                }
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

        if (users.find(u => u.username === newUser.username?.trim())) {
            return res.status(400).json({ error: 'User already exists' });
        }

        // Normalize username on creation
        const normalizedUser = {
            ...newUser,
            username: newUser.username?.trim()
        };

        users.push(normalizedUser);
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

// CMS data persistence helpers
function saveCmsData(data) {
    const dataDir = path.dirname(DATA_FILE);
    if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
}

// Serve static files and handle SPA routing
const DIST_PATH = path.join(__dirname, '../dist');
if (fs.existsSync(DIST_PATH)) {
    console.log(`Serving static files from: ${DIST_PATH}`);
    app.use(express.static(DIST_PATH));

    // Catch-all route to serve the frontend (for React Router support)
    app.get(/^(?!\/api\/|\/health).*/, (req, res) => {
        const indexPath = path.join(DIST_PATH, 'index.html');
        if (fs.existsSync(indexPath)) {
            res.sendFile(indexPath);
        } else {
            res.status(404).send('Frontend build not found.');
        }
    });
}

app.listen(PORT, '0.0.0.0', () => {
    console.log(`\n🚀 Dev API server running at http://localhost:${PORT}`);
    console.log(`   POST /api/lead - Submit lead to LeadSquared`);
    console.log(`   GET /api/health - Health check\n`);

    if (!process.env.LEADSQUARED_ACCESS_KEY || !process.env.LEADSQUARED_SECRET_KEY) {
        console.warn('⚠️  Warning: Using fallback credentials (from code)');
        console.warn('   For production, set LEADSQUARED_ACCESS_KEY and LEADSQUARED_SECRET_KEY in .env\n');
    }
});

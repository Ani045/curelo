// Local development server for testing the LeadSquared API integration
// Run with: node api/dev-server.js

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

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

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'ok', message: 'Dev server is running' });
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

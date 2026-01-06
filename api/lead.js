// Vercel Serverless Function for LeadSquared Lead Submission
// This function securely handles form submissions without exposing API keys

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // CORS headers for local development and production
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

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

    // Get API credentials from environment variables
    const accessKey = process.env.LEADSQUARED_ACCESS_KEY;
    const secretKey = process.env.LEADSQUARED_SECRET_KEY;

    if (!accessKey || !secretKey) {
      console.error('LeadSquared credentials not configured');
      return res.status(500).json({
        success: false,
        error: 'Server configuration error'
      });
    }

    // Submit to LeadSquared API
    const leadSquaredUrl = `https://api-in21.leadsquared.com/v2/LeadManagement.svc/Lead.CreateOrUpdate?postUpdatedLead=false&accessKey=${accessKey}&secretKey=${secretKey}`;

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
}

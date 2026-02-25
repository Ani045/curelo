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
      locationId
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

    // Build LeadSquared payload
    const payload = [
      { "Attribute": "FirstName", "Value": firstName },
      { "Attribute": "LastName", "Value": lastName },
      { "Attribute": "Phone", "Value": phone.replace(/\D/g, '') },
      { "Attribute": "mx_Patient_City", "Value": city.trim() },
      { "Attribute": "Source", "Value": source || "Google_lp" },
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

    // Get API credentials
    const accessKey = process.env.LEADSQUARED_ACCESS_KEY;
    const secretKey = process.env.LEADSQUARED_SECRET_KEY;

    if (!accessKey || !secretKey) {
      console.error('LeadSquared credentials not configured');
      return res.status(500).json({ success: false, error: 'Server configuration error' });
    }

    // Submit to LeadSquared Capture API
    const leadSquaredUrl = `https://api-in21.leadsquared.com/v2/LeadManagement.svc/Lead.Capture?accessKey=${accessKey}&secretKey=${secretKey}`;

    const response = await fetch(leadSquaredUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const result = await response.json();

    if (result.Status === 'Error') {
      console.error('LeadSquared API Error:', result.ExceptionMessage);
      return res.status(500).json({
        success: false,
        error: 'Failed to submit lead',
        message: 'Processing error. Please try again.'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Lead captured successfully',
      leadId: result.Message?.Id || null
    });

  } catch (error) {
    console.error('Error submitting lead:', error.message);
    return res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
}

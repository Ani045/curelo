
const API_URL = 'http://localhost:3001/api/cms';

async function testUpload(sizeMB) {
    console.log(`\n--- Testing ${sizeMB}MB payload ---`);
    // Generate base64 data
    const data = 'A'.repeat(sizeMB * 1024 * 1024);
    const payload = {
        pages: {
            home: {
                title: 'Home',
                slug: 'home',
                data: {
                    hero: {
                        desktopBanner: `data:image/jpeg;base64,${data}`
                    }
                }
            }
        }
    };

    console.log('Sending payload to ' + API_URL);
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        console.log('Status:', response.status);
        const text = await response.text();
        if (response.status === 200) {
            console.log('Success: CMS data saved successfully');
        } else {
            console.log('Error output (first 200 chars):', text.substring(0, 200));
        }
    } catch (error) {
        console.error('Test failed:', error.message);
    }
}

async function runTests() {
    await testUpload(11); // Should now pass (was failing at 10)
    await testUpload(51); // Should fail (new limit is 50)
}

runTests();

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const USERS_FILE = path.join(__dirname, 'data/users.json');

console.log('Checking Users File Path:', USERS_FILE);

if (!fs.existsSync(USERS_FILE)) {
    console.error('FAIL: users.json NOT FOUND!');
    process.exit(1);
}

try {
    const users = JSON.parse(fs.readFileSync(USERS_FILE, 'utf8'));
    const admin = users.find(u => u.username === 'admin');

    if (admin) {
        console.log('SUCCESS: admin user found.');
        console.log('Password Match Test:', admin.password === 'curelo@2026' ? 'PASSED' : 'FAILED');
        console.log('Role:', admin.role);
    } else {
        console.error('FAIL: admin user not found in users.json');
    }
} catch (e) {
    console.error('FAIL: Could not parse users.json', e.message);
}

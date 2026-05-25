require('dotenv').config({ path: '.env.local' });
const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

async function main() {
    const connectionString = process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL;

    if (!connectionString) {
        console.error('❌ Error: DATABASE_URL_UNPOOLED or DATABASE_URL not found in .env.local');
        process.exit(1);
    }

    const outputFile = path.join(process.cwd(), 'neon_backup.sql');
    console.log(`📦 Preparing backup of Neon database...`);
    console.log(`🔗 Target file: ${outputFile}`);

    // Check if pg_dump is available in the path
    let hasPgDump = false;
    try {
        execSync('pg_dump --version', { stdio: 'ignore' });
        hasPgDump = true;
    } catch (e) {
        // pg_dump not found in system PATH
    }

    if (!hasPgDump) {
        console.warn('⚠️  Warning: "pg_dump" command not found in your system PATH.');
        console.log('To run this script, you need to have PostgreSQL client tools installed locally.');
        console.log('\nAlternatives:');
        console.log('1. Install PostgreSQL tools locally and add them to your PATH.');
        console.log('2. Or run pg_dump directly specifying the full path to pg_dump.exe. Example:');
        console.log('   "C:\\Program Files\\PostgreSQL\\17\\bin\\pg_dump.exe"');
        console.log('\nHere is the exact command you should run manually if you prefer:');
        console.log(`pg_dump "${connectionString}" --no-owner --no-privileges -f "${outputFile}"`);
        process.exit(1);
    }

    try {
        console.log('🚀 Running pg_dump...');
        // --no-owner and --no-privileges are critical when migrating to a VPS database with different users
        execSync(`pg_dump "${connectionString}" --no-owner --no-privileges -f "${outputFile}"`, {
            stdio: 'inherit'
        });
        console.log('✅ Backup created successfully! File saved as: neon_backup.sql');
    } catch (error) {
        console.error('❌ Error running pg_dump:', error.message);
    }
}

main();

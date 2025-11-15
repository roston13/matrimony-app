const db = require('./db');

console.log('Testing database connectivity...\n');

// Test 1: Check if connection is established
db.query('SELECT 1 as test', (err, results) => {
    if (err) {
        console.error('❌ Database connection failed:', err.message);
        process.exit(1);
    } else {
        console.log('✅ Database connection successful!');
        
        // Test 2: Check if database exists and show tables
        db.query('SHOW TABLES', (err, tables) => {
            if (err) {
                console.error('❌ Error checking tables:', err.message);
                process.exit(1);
            } else {
                console.log('\n📊 Available tables:');
                if (tables.length === 0) {
                    console.log('   ⚠️  No tables found. Database might be empty.');
                } else {
                    tables.forEach((table, index) => {
                        const tableName = Object.values(table)[0];
                        console.log(`   ${index + 1}. ${tableName}`);
                    });
                }
                
                // Test 3: Check users table structure if it exists
                db.query('SELECT COUNT(*) as count FROM users', (err, result) => {
                    if (err) {
                        console.log('\n⚠️  Users table does not exist or has issues.');
                    } else {
                        console.log(`\n👥 Users table: ${result[0].count} user(s) found`);
                    }
                    
                    // Close connection
                    db.end((err) => {
                        if (err) {
                            console.error('Error closing connection:', err.message);
                        } else {
                            console.log('\n✅ Database connection closed successfully.');
                        }
                        process.exit(0);
                    });
                });
            }
        });
    }
});





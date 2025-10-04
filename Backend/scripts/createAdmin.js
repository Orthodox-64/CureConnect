const mongoose = require('mongoose');
const User = require('../models/userModel');
require('dotenv').config();

// Admin credentials
const ADMIN_CREDENTIALS = {
    name: "CureConnect Admin",
    contact: "admin@cureconnect.com",
    password: "CureConnect@2025",
    role: "admin"
};

// Connect to database
const createAdmin = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        
        console.log('✅ Connected to MongoDB');

        // Check if admin already exists
        const existingAdmin = await User.findOne({ role: 'admin' });
        if (existingAdmin) {
            console.log('❌ Admin account already exists:');
            console.log(`   Email: ${existingAdmin.contact}`);
            console.log(`   Name: ${existingAdmin.name}`);
            console.log(`   Created: ${existingAdmin.createdAt}`);
            process.exit(1);
        }

        // Create admin user
        const admin = await User.create({
            name: ADMIN_CREDENTIALS.name,
            contact: ADMIN_CREDENTIALS.contact,
            password: ADMIN_CREDENTIALS.password,
            role: ADMIN_CREDENTIALS.role,
            avatar: {
                public_id: "",
                url: "",
            }
        });

        console.log('🎉 Admin account created successfully!');
        console.log('=====================================');
        console.log(`👤 Name: ${admin.name}`);
        console.log(`📧 Email: ${admin.contact}`);
        console.log(`🔑 Password: ${ADMIN_CREDENTIALS.password}`);
        console.log(`🆔 User ID: ${admin._id}`);
        console.log(`📅 Created: ${admin.createdAt}`);
        console.log('=====================================');
        console.log('');
        console.log('🔐 IMPORTANT: Save these credentials securely!');
        console.log('💡 You can now login at: http://localhost:3000/admin/login');
        console.log('');

    } catch (error) {
        console.error('❌ Error creating admin:', error.message);
        if (error.code === 11000) {
            console.log('💡 Admin with this email already exists');
        }
    } finally {
        mongoose.connection.close();
        process.exit(0);
    }
};

// Run the script
createAdmin();

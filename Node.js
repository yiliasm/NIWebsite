const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// serve static files
app.use(express.static(path.join(__dirname, 'public')));

// static data
const staticData = {
    services: [
        {
            id: 1,
            name: 'Roof Installation',
            description: 'We offer top-quality roof installations guaranteeing year-round protection for your home.',
            icon: '🏠',
            
        },
        {
            id: 2,
            name: 'Siding Installation',
            description: 'We specialize in professional siding installations improving your home\'s exterior appearance while ensuring long-term protection.',
            icon: '🏗️',
            
        },
        {
            id: 3,
            name: 'Gutter Installation',
            description: 'We deliver expert gutter installations ensuring efficient water management and protecting your home from potential damage.',
            icon: '🌧️',
            
        }
    ],
    testimonials: [
        {
            id: 1,
            text: 'N & I Roofing made the insurance claim process so easy. They handled everything professionally and my new roof looks amazing!',
            author: 'Sarah Johnson',
            role: 'Homeowner'
        },
        {
            id: 2,
            text: 'After a severe storm damaged our roof, N & I Roofing helped us navigate the insurance process and installed a beautiful new roof. Highly recommend!',
            author: 'Michael Davis',
            role: 'Property Owner'
        },
        {
            id: 3,
            text: 'The team at N & I Roofing was prompt, professional, and did excellent work on our siding installation. Our home looks brand new!',
            author: 'Jennifer Wilson',
            role: 'Homeowner'
        }
    ]
};

// API

// get all services
app.get('/api/services', (req, res) => {
    try {
        res.json({
            success: true,
            data: staticData.services,
            message: 'Services retrieved successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error retrieving services',
            error: error.message
        });
    }
});

// get all testimonials
app.get('/api/testimonials', (req, res) => {
    try {
        res.json({
            success: true,
            data: staticData.testimonials,
            message: 'Testimonials retrieved successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error retrieving testimonials',
            error: error.message
        });
    }
});

// submit contact form 
app.post('/api/contact', (req, res) => {
    try {
        const { name, email, phone, message, service } = req.body;
        
        // if valid
        if (!name || !email || !message) {
            return res.status(400).json({
                success: false,
                message: 'Name, email, and message are required fields'
            });
        }
        
        // how to make sure an email address is valid
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: 'Please provide a valid email address'
            });
        }
        
        // contact form submission
        console.log('Contact form submitted:', {
            name,
            email,
            phone: phone || 'Not provided',
            message,
            service: service || 'General inquiry',
            timestamp: new Date().toISOString()
        });
        
        res.status(201).json({
            success: true,
            message: 'Contact form submitted successfully',
            data: {
                name,
                email,
                status: 'received'
            }
        });
        
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error submitting contact form',
            error: error.message
        });
    }
});

// get quote calculation
app.get('/api/quote', (req, res) => {
    try {
        const { service, squareFootage } = req.query;
        
        if (!service || !squareFootage) {
            return res.status(400).json({
                success: false,
                message: 'Service and square footage are required for quote calculation'
            });
        }
        
        // quick quote calculation
        let basePrice = 0;
        
        switch (service.toLowerCase()) {
            case 'roofing':
            case 'roof installation':
                basePrice = 8;
                break;
            case 'siding':
            case 'siding installation':
                basePrice = 12;
                break;
            case 'gutters':
            case 'gutter installation':
                basePrice = 15;
                break;
            default:
                basePrice = 10;
        }
        
        const estimatedCost = Math.round(basePrice * parseInt(squareFootage));
        
        res.json({
            success: true,
            data: {
                service,
                squareFootage: parseInt(squareFootage),
                estimatedCost,
                disclaimer: 'This is an estimate only. Final pricing may vary based on specific requirements.'
            },
            message: 'Quote calculated successfully'
        });
        
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error calculating quote',
            error: error.message
        });
    }
});

// health check 
app.get('/api/health', (req, res) => {
    res.json({
        success: true,
        message: 'N & I Roofing API is running',
        timestamp: new Date().toISOString(),
        version: '1.0.0'
    });
});

// handle non API routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Something went wrong!',
        error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
    });
});

// server
app.listen(PORT, () => {
    console.log(`🚀 N & I Roofing Server running on port ${PORT}`);
    console.log(`📍 API Base URL: http://localhost:${PORT}/api`);
    console.log(`🌐 Frontend URL: http://localhost:${PORT}`);
    console.log(`\n📋 Available API Endpoints:`);
    console.log(`   GET  /api/health`);
    console.log(`   GET  /api/services`);
    console.log(`   GET  /api/testimonials`);
    console.log(`   POST /api/contact`);
    console.log(`   GET  /api/quote`);
});

module.exports = app;
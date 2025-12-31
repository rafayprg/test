const express = require('express');
const path = require('path');
const app = express();

// --- 1. Middleware ---
// Required to parse the data you type into the HTML form
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve all your HTML, CSS, and JS from the 'src' folder
app.use(express.static(path.join(__dirname, "src")));

// --- 2. Routes ---

// Serve the Home Page (index.html)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'src', 'index.html'));
});

// Serve the Order Page (order.html)
app.get('/order', (req, res) => {
    res.sendFile(path.join(__dirname, 'src', 'order.html'));
});

// --- 3. The Order API (Email Notification Only) ---
app.post('/create-order', async (req, res) => {
    console.log("Form Data Received:", req.body);

    const { productName, productPrice, customerName, customerPhone, customerAddress } = req.body;

    try {
        // Use the built-in fetch in Node.js v22 to send to Formspree
        const response = await fetch('https://formspree.io/f/xwpwkeya', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                _subject: `New Order: ${productName}`,
                "Customer": customerName,
                "Phone": customerPhone,
                "Product": productName,
                "Price": productPrice,
                "Address": customerAddress
            })
        });

       if (response.ok) {
            // Success Page Design
            res.send(`
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <style>
                 body { 
    background-color: #111; 
    color: #fff; 
    font-family: sans-serif; 
    display: flex; 
    justify-content: center; 
    align-items: center; 
    min-height: 100vh; 
    margin: 0; 
    padding: 15px;
}

.card { 
    background: #1a1a1a; 
    padding: 30px;
    border-radius: 15px; 
    text-align: center; 
    border: 1px solid #d4af37; 
    width: 100%; 
    max-width: 450px; 
    box-sizing: border-box; 
}

h1 { color: #d4af37; margin-bottom: 20px; font-size: 24px; }

.details { 
    text-align: left; 
    margin: 20px 0; 
    border-top: 1px solid #333; 
    padding-top: 20px; 
    font-size: 15px; 
    line-height: 1.6;
}

.btn { 
    background: #d4af37; 
    color: #000; 
    padding: 15px 30px; 
    text-decoration: none; 
    border-radius: 25px; 
    font-weight: bold; 
    display: block;
    margin-top: 20px; 
}
                </style>
            </head>
            <body>
                <div class="card">
                    <h1>Order Received!</h1>
                    <p>Thank you, <b>${customerName}</b>. Your order for <b>${productName}</b> has been placed successfully.</p>
                    <p>We will contact you shortly on <b>${customerPhone}</b> for verification.</p>
                    <div class="details">
                        <p><b>Address:</b> ${customerAddress}</p>
                        <p><b>Price:</b> $${productPrice}</p>
                    </div>
                    <a href="/" class="btn">Back to Store</a>
                </div>
            </body>
            </html>
            `);
        } else {
            res.status(500).send("Email notification failed. Please check Formspree.");
        }
    } catch (error) {
        console.error("Fetch Error:", error);
        res.status(500).send("Internal Server Error");
    }
});

app.listen(3000, () => {
    console.log('Server is fixed and running: http://localhost:3000');
});

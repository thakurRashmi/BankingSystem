
const express = require('express');
const axios = require('axios');
const https = require('https');
const fs = require('fs');

const app = express();
const port = 3000;

// Inside Memory 
let accounts = {
    "Rashmi": 5000,
    "SenderBankInternalAccount": 10000 
};

const httpsOptions = {
    key: fs.readFileSync('server.key'),
    cert: fs.readFileSync('server.crt')
};

app.post('/transfer', async (req, res) => {
    const { receiverBankUrl, receiverAccount, amount } = req.body;
    const sender = "Rashmi"; 
    const transactionId = Math.random().toString(36).substr(2, 9); 
  
    if (accounts[sender] >= amount) 
    {
        accounts[sender] -= amount;
        const agent = new https.Agent({ rejectUnauthorized: false });
        
        // Mitigation Technique: Secure Communication (HTTPS)
        try {
            const response = await axios.post(`${receiverBankUrl}/credit`, {
                transactionId,
                sender,
                amount
            }, { httpsAgent: agent });

            if (response.status === 200) {
                res.json({ message: 'Transfer successful' });
            } else {
                accounts[sender] += amount;
                res.status(500).json({ message: 'Transfer failed at receiver bank' });
            }
        } catch (error) {
            
            // Mitigation Technique: Retry and Recovery Mechanisms
            console.error(`Error transferring money: ${error.message}`);
            accounts[sender] += amount;
            res.status(500).json({ message: 'Transfer failed due to network error' });
        }
    } else {
        res.status(400).json({ message: 'Insufficient funds' });
    }
});

const server = https.createServer(httpsOptions, app);
server.listen(port, () => {
    console.log(`Bank A (Sender's Bank) is listening at https://localhost:${port}`);
});

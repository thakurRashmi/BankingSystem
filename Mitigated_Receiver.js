
const express = require('express');
const https = require('https');
const fs = require('fs');

const app = express();
const port = 4000;

// Inside Memory
let accounts = {
    "ReceiverInternalAccount": 15000, 
    "Riya": 7000,
    "Rashmi": 2000
};

const httpsOptions = {
    key: fs.readFileSync('server.key'),
    cert: fs.readFileSync('server.crt')
};

app.post('/credit', async (req, res) => {
    const { transactionId, sender, amount } = req.body;
    const receiver = "Riya"; 
  
    if (accounts[receiver]) {
        accounts[receiver] += amount;
        res.json({ message: 'Amount credited successfully' });
    } else
    {
        console.log(`Receiver account ${receiver} not found. Rolling back transaction.`);
        
        // Mitigation Technique: Transaction Atomicity (Rollback)
        accounts[sender] += amount;
        res.status(404).json({ message: 'Receiver not found' });
    }
});

const server = https.createServer(httpsOptions, app);
server.listen(port, () => {
    console.log(`Bank B (Receiver's Bank) is listening at https://localhost:${port}`);
});

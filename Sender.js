const express = require('express');
const axios = require('axios');

const app = express();
const port = 3000;


let accounts = {
    "Rashmi": 5000,
    "Riya": 3000
};


app.post('/transfer', async (req, res) => {
    const { receiverBankUrl, receiverAccount, amount } = req.body;
    const sender = "Rashmi"; 

    if (accounts[sender] >= amount) {
        accounts[sender] -= amount;

        try {
            const response = await axios.post(`${receiverBankUrl}/credit`, {
                receiver: receiverAccount,
                amount: amount
            });

            if (response.status === 200) {
                res.json({ message: 'Transfer successful' });
            } else {
                accounts[sender] += amount;
                res.status(500).json({ message: 'Transfer failed at receiver bank' });
            }
        } catch (error) {
            accounts[sender] += amount;
            res.status(500).json({ message: 'Transfer failed due to network error' });
        }
    } else {
        res.status(400).json({ message: 'Insufficient funds' });
    }
});

app.listen(port, () => {
    console.log(`Bank A (Sender's Bank) is listening at http://localhost:${port}`);
});

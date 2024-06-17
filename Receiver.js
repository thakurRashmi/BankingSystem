const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = 4000;

let accounts = {
    "Rashmi": 5000,
    "Riya": 3000
};

app.use(bodyParser.json());

app.post('/credit', (req, res) => {
    const { receiver, amount } = req.body;

    if (accounts[receiver]) 
    {
        accounts[receiver] += amount;
        res.json({ message: 'Amount credited successfully' });
    } else {
        res.status(404).json({ message: 'Receiver not found' });
    }
});

app.listen(port, () => {
    console.log(`Bank B (Receiver's Bank) is listening at http://localhost:${port}`);
});

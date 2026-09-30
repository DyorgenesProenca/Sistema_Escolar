import express from 'express';

const app = express();
app.use(express.json());

let users = [
    { id: 1, name: 'John Doe', email: 'john.doe@example.com', age: 30 },
    { id: 2, name: 'Jane Smith', email: 'jane.smith@example.com', age: 25 }
];

app.get('/users', (req, res) => {
    res.json(users);
});

app.post('/users', (req, res) => {
    const { name, email, age } = req.body;
    const newUser = { id: users.length + 1, name, email, age };
    users.push(newUser);
    res.status(201).json(newUser);
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
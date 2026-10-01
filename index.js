import express from 'express';
import cors from 'cors';
import routes from './Routes/index.js'; // Importa o centralizador de rotas

const app = express();
app.use(express.json());
app.use(cors());

// Usa todas as rotas unificadas
app.use(routes);

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});

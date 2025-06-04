//express configs
import express from 'express';
import { userRoutes } from './routes/routes';

const app = express();
const PORT = 3000;

app.use(express.json());
app.use('/users', userRoutes);

app.get('/', (req: express.Request, res: express.Response) => {
res.send('API rodando com Express!');
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});


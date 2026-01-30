//.env
import dotenv from 'dotenv';
dotenv.config();

//express configs
import express from 'express';

//imports routes
import { userRoutes } from './routes/routes';
import authRoutes from "./routes/authRoutes";
import cors from 'cors';

//inicializando servidor com express
const app = express();
const PORT = process.env.PORT || 3000;

//inicializando cors
app.use(cors());

app.use(express.json());
app.use('/users', userRoutes);
app.use('/auth', authRoutes);
app.use('/escritor', userRoutes);
app.use('/posts', userRoutes);

app.get('/', (req: express.Request, res: express.Response) => {
res.send('API rodando com Express!');
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});


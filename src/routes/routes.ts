import express from "express";
import axios from 'axios';
import { AxiosError } from 'axios';
import { CreateCustomerController } from "../controllers/CreateCustomerController";
import { ListCostumersController } from "../controllers/ListCustomersController";
import { DeleteCustomerController } from "../controllers/DeleteCustomerController";
import { login } from "../controllers/authController";
import { validatePassword } from "../middlewares/validatePassword";

export const userRoutes = express.Router();

userRoutes.get('/', (req: express.Request, res: express.Response) => {
    res.send('API rodando com Express!');
  });

userRoutes.post('/customer', validatePassword, async (req, res) => {
    return new CreateCustomerController().handle(req, res);
});

userRoutes.get('/customers', async (req, res) => {
    return new ListCostumersController().handle(req, res);
});

userRoutes.delete('/customer', async (req, res) => {
    return new DeleteCustomerController().handle(req, res);
});

userRoutes.post('/escritor', async (req, res) => {
    const { topic } = req.body;
    console.log("🔑 Chave da IA:", process.env.API_KEY);


    if (!topic) {
        return res.status(400).json({ message: 'O campo "topic" é obrigatório.' });
      }

      try {
        const response = await axios.post(
          'https://api.groq.com/openai/v1/chat/completions',
          {
            model: 'gemma2-9b-it', 
            messages: [
              {
                role: 'system',
                content: 'Você é um assistente que gera textos criativos para posts de redes sociais.',
              },
              {
                role: 'user',
                content: `Crie um post criativo sobre o tema: "${topic}".`,
              },
            ],
            max_tokens: 300,
            temperature: 0.8,
          },
          {
            headers: {
              'Authorization': `Bearer ${process.env.API_KEY}`,
              'Content-Type': 'application/json',
            },
          }
        );

        const generatedText = response.data.choices[0].message.content;
        console.log('Texto gerado pela IA:', generatedText);
        res.status(200).json({ post: generatedText });

    } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error('❌ Erro da API Groq:', error.response?.data || error.message);
          res.status(500).json({ message: 'Erro ao gerar o post com Axios' });
        } else {
          console.error('❌ Erro desconhecido:', error);
          res.status(500).json({ message: 'Erro desconhecido ao gerar o post' });
        }
      }
    });
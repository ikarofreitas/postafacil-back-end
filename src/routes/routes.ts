import express from "express";
import axios from 'axios';
import { CreateCustomerController } from "../controllers/CreateCustomerController";
import { ListCostumersController } from "../controllers/ListCustomersController";
import { DeleteCustomerController } from "../controllers/DeleteCustomerController";
import { ScheduledPostsController } from "../controllers/ScheduledPostsController";
import { validatePassword } from "../middlewares/validatePassword";
import { PostNotificationController } from "../controllers/PostNotificationController";
import { mockAuth } from "../middlewares/mockAuth";

export const userRoutes = express.Router();
const scheduledPostsController = new ScheduledPostsController();
const notificationController = new PostNotificationController();

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

// Posts agendados (calendário)
userRoutes.post('/scheduled-posts', mockAuth, (req, res) => scheduledPostsController.create(req, res));
userRoutes.get('/scheduled-posts', mockAuth, (req, res) => scheduledPostsController.listByCustomer(req, res));
userRoutes.get('/scheduled-posts/check-due', mockAuth, (req, res) => scheduledPostsController.checkDuePosts(req, res));
userRoutes.get('/scheduled-posts/:id',  mockAuth, (req, res) => scheduledPostsController.getById(req, res));
userRoutes.patch('/scheduled-posts/:id',  mockAuth, (req, res) => scheduledPostsController.update(req, res));
userRoutes.delete('/scheduled-posts/:id',  mockAuth, (req, res) => scheduledPostsController.delete(req, res));

// Rotas de notificação dos posts agendados
userRoutes.get(
  "/notifications",
  (req, res) => notificationController.list(req, res)
);

userRoutes.patch(
  "/notifications/:id/read",
  (req, res) => notificationController.markAsRead(req, res)
);

userRoutes.patch(
  "/notifications/read-all",
  (req, res) => notificationController.markAllAsRead(req, res)
);

userRoutes.get(
  "/notifications/unread-count",
  (req, res) => notificationController.unreadCount(req, res)
);

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
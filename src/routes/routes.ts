import express from "express";
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


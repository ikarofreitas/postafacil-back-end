import { Request, Response } from "express";
import { ListCustomersService } from "../services/ListCustomersService";

class ListCostumersController {
    async handle(req: Request, res: Response){
        const listCustomersService = new ListCustomersService();

        const customers = await listCustomersService.execute();
        res.send(customers);
    }
}

export { ListCostumersController };
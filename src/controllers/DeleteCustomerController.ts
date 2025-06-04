import { Request, Response } from "express";
import { DeleteCustomerService } from "../services/DeleteCustomerService";

class DeleteCustomerController {
    async handle(req: Request, res: Response){
        
        const { id } = req.query as { id: string };
        const customerService = new DeleteCustomerService();
        const customer = await customerService.execute({ id });

        res.send(customer);
    }
}

export { DeleteCustomerController };
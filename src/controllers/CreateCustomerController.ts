import { Request, Response } from "express";
import { CreateCustomerService } from "../services/CreateCustumerService";

class CreateCustomerController {
    async handle(req: Request, res: Response){

        const {name, email, password} = req.body as { name: string, email: string, password: string };
        console.log(name, email, password);


        const CustomerService = new CreateCustomerService();
        try{
            const customer = await CustomerService.execute({ name, email, password });
            res.status(201).send(customer);  
        }catch (error: any) {
            res.status(400).json({ error: error.message});
        }
    }
}

export {CreateCustomerController};
import { Request, Response } from "express";
import { CreateCustomerService } from "../services/CreateCustumerService";

class CreateCustomerController {
    async handle(req: Request, res: Response){

        const {name, email} = req.body as { name: string, email: string };
        console.log(name, email);


        const CustomerService = new CreateCustomerService();
        const customer = await CustomerService.execute({ name, email });

        res.send(customer);
    }

}

export {CreateCustomerController};
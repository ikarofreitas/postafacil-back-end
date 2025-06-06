import prismaClient from "../prisma";

interface CreateCustomerProps {
    name: string;
    email: string;
    password: string;
}

class CreateCustomerService {
    async execute({name, email, password}: CreateCustomerProps){

        if(!name || !email || !password){
            throw new Error("Nome e email são obrigatórios");
        }

        const customer = await prismaClient.customer.create({
            data: {
                name,
                email,
                password,
                status: true
            }
        })
        
        return customer;
    }
    
}

export { CreateCustomerService };
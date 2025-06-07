import prismaClient from "../prisma";
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';


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
    try{
        const customer = await prismaClient.customer.create({
            data: {
                name,
                email,
                password,
                status: true
            }
        })
        
        return customer;
    } catch (error) {
        if(error instanceof PrismaClientKnownRequestError){
            if(error.code === "P2002"){
                throw new Error("Email já cadastrado");
            }
        }
        throw new Error('Erro ao cadastrar usuário');
    }
    }
    
}

export { CreateCustomerService };
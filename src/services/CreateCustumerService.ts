import { PrismaClient } from "../generated/prisma"; // ou '@prisma/client'
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

interface CustomerRequest {
  name: string;
  email: string;
  password: string;
}

export class CreateCustomerService {
  async execute({ name, email, password }: CustomerRequest) {
    const existingCustomer = await prisma.customer.findUnique({ where: { email } });

    if (existingCustomer) {
      throw new Error("Cliente já cadastrado com esse e-mail");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const customer = await prisma.customer.create({
      data: {
        name,
        email,
        password: hashedPassword,
        status: true,
      },
    });

    return {
      id: customer.id,
      name: customer.name,
      email: customer.email,
      status: customer.status,
    };
  }
}

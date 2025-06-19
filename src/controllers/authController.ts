import { Request, Response } from 'express';
import { PrismaClient } from '../generated/prisma'; // ou '@prisma/client' se usar o padrão
import bcrypt from 'bcrypt';
import { generateToken } from '../utils/generationToken';

const prisma = new PrismaClient();

export const login = async (req: Request, res: Response) => {
    const { email, senha } = req.body;
    console.log("📥 Dados recebidos:", { email, senha });
  
    try {
      const customer = await prisma.customer.findUnique({ where: { email } });
      console.log("🔍 Customer encontrado:", customer);
  
      if (!customer) {
        return res.status(404).json({ message: "Cliente não encontrado" });
      }
  
      const senhaCorreta = await bcrypt.compare(senha, customer.password);
      console.log("🔐 Senha correta?", senhaCorreta);
  
      if (!senhaCorreta) {
        return res.status(401).json({ message: "Senha incorreta" });
      }
  
      const token = generateToken(customer.id);
      console.log("🎫 Token gerado:", token);
  
      return res.status(200).json({
        message: "Login realizado com sucesso",
        token,
        user: {
          id: customer.id,
          nome: customer.name,
          email: customer.email,
        },
      });
    } catch (error) {
      console.error("❌ Erro no login:", error);
      return res.status(500).json({ message: "Erro interno ao fazer login" });
    }
  };
  

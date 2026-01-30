import { Request, Response } from "express";
import { ScheduledPostsService } from "../services/ScheduledPostsService";
import { PostStatus } from "../generated/prisma";

class ScheduledPostsController {
  private service = new ScheduledPostsService();

  async create(req: Request, res: Response) {
    try {
      const { customerId, title, content, hashtags, imageUrl, scheduledAt } = req.body;
      const post = await this.service.create({
        customerId,
        title,
        content,
        hashtags,
        imageUrl,
        scheduledAt,
      });
      return res.status(201).json(post);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Erro ao agendar post.";
      return res.status(400).json({ error: message });
    }
  }

  async listByCustomer(req: Request, res: Response) {
    try {
      const { customerId, startDate, endDate, status } = req.query;

      if (!customerId || typeof customerId !== "string") {
        return res.status(400).json({ error: "customerId é obrigatório na query." });
      }

      const filters: { startDate?: Date; endDate?: Date; status?: PostStatus } = {};
      if (startDate && typeof startDate === "string") filters.startDate = new Date(startDate);
      if (endDate && typeof endDate === "string") filters.endDate = new Date(endDate);
      if (status && typeof status === "string" && Object.values(PostStatus).includes(status as PostStatus)) {
        filters.status = status as PostStatus;
      }

      const posts = await this.service.listByCustomer(customerId, Object.keys(filters).length ? filters : undefined);
      return res.status(200).json(posts);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Erro ao listar posts.";
      return res.status(400).json({ error: message });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const customerId = (req.query.customerId as string) || (req.body?.customerId as string);

      if (!customerId) {
        return res.status(400).json({ error: "customerId é obrigatório (query ou body)." });
      }

      const post = await this.service.getById(id, customerId);
      return res.status(200).json(post);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Post não encontrado.";
      return res.status(404).json({ error: message });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { customerId, title, content, hashtags, imageUrl, scheduledAt, status } = req.body;

      if (!customerId) {
        return res.status(400).json({ error: "customerId é obrigatório no body." });
      }

      const post = await this.service.update(id, customerId, {
        title,
        content,
        hashtags,
        imageUrl,
        scheduledAt,
        status,
      });
      return res.status(200).json(post);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Erro ao atualizar post.";
      return res.status(400).json({ error: message });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const customerId = (req.query.customerId as string) || (req.body?.customerId as string);

      if (!customerId) {
        return res.status(400).json({ error: "customerId é obrigatório (query ou body)." });
      }

      const result = await this.service.delete(id, customerId);
      return res.status(200).json(result);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Erro ao remover post.";
      return res.status(404).json({ error: message });
    }
  }

  /**
   * Endpoint para processar posts que já passaram da data agendada (marca como DUE e cria notificação).
   * Em produção pode ser chamado por um cron/job; aqui exposto para testes.
   */
  async checkDuePosts(req: Request, res: Response) {
    try {
      const { customerId } = req.query;

      if (!customerId || typeof customerId !== "string") {
        return res.status(400).json({ error: "customerId é obrigatório na query." });
      }

      const result = await this.service.checkDuePosts(customerId);
      return res.status(200).json(result);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Erro ao verificar posts vencidos.";
      return res.status(500).json({ error: message });
    }
  }
}

export { ScheduledPostsController };

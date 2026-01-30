/// <reference path="../@types/express/index.d.ts" />
import { Request, Response } from "express";
import { PostNotificationService } from "../services/PostNotificationService";

class PostNotificationController {
  private service = new PostNotificationService();

  /**
   * Lista todas as notificações do usuário logado
   */
  async list(req: Request, res: Response) {
    try {
        if (!req.user) {
            return res.status(401).json({ error: "Não autenticado" });
          }
      const customerId = req.user.id;

      const notifications = await this.service.listByCustomer(customerId);
      return res.status(200).json(notifications);
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : "Erro ao listar notificações.";
      return res.status(500).json({ error: message });
    }
  }

  /**
   * Marca uma notificação específica como lida
   */
  async markAsRead(req: Request, res: Response) {
    try {
        if (!req.user) {
            return res.status(401).json({ error: "Não autenticado" });
          }
      const customerId = req.user.id;
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({ error: "id da notificação é obrigatório." });
      }

      const updated = await this.service.markAsRead(id, customerId);

      if (updated.count === 0) {
        return res.status(404).json({ error: "Notificação não encontrada." });
      }

      return res.status(204).send();
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : "Erro ao marcar notificação como lida.";
      return res.status(500).json({ error: message });
    }
  }

  /**
   * Marca TODAS as notificações como lidas
   * (opcional, mas UX excelente)
   */
  async markAllAsRead(req: Request, res: Response) {
    try {
        if (!req.user) {
            return res.status(401).json({ error: "Não autenticado" });
          }
      const customerId = req.user.id;

      const result = await this.service.markAllAsRead(customerId);
      return res.status(200).json({ updated: result.count });
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : "Erro ao marcar notificações como lidas.";
      return res.status(500).json({ error: message });
    }
  }

  /**
   * Retorna quantidade de notificações não lidas
   * Ideal para badge 🔔
   */
  async unreadCount(req: Request, res: Response) {
    try {
        if (!req.user) {
            return res.status(401).json({ error: "Não autenticado" });
          }
      const customerId = req.user.id;

      const count = await this.service.countUnread(customerId);
      return res.status(200).json({ unread: count });
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : "Erro ao contar notificações.";
      return res.status(500).json({ error: message });
    }
  }
}

export { PostNotificationController };

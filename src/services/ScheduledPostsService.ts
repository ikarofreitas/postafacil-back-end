import prismaClient from "../prisma";
import { PostStatus } from "../generated/prisma";
import { PostNotificationService } from "./PostNotificationService";

interface CreateScheduledPostProps {
  customerId: string;
  title: string;
  content: string;
  hashtags?: string;
  imageUrl?: string;
  scheduledAt: Date;
}

interface ListByCustomerFilters {
  startDate?: Date;
  endDate?: Date;
  status?: PostStatus;
}

interface UpdateScheduledPostProps {
  title?: string;
  content?: string;
  hashtags?: string;
  imageUrl?: string;
  scheduledAt?: Date;
  status?: PostStatus;
}

class ScheduledPostsService {
  async create(data: CreateScheduledPostProps) {
    const { customerId, title, content, hashtags, imageUrl, scheduledAt } = data;

    if (!customerId || !title || !content || !scheduledAt) {
      throw new Error("customerId, title, content e scheduledAt são obrigatórios.");
    }

    const scheduledAtDate = typeof scheduledAt === "string" ? new Date(scheduledAt) : scheduledAt;
    if (isNaN(scheduledAtDate.getTime())) {
      throw new Error("scheduledAt deve ser uma data válida.");
    }

    if (scheduledAtDate <= new Date()) {
      throw new Error("scheduledAt deve ser uma data futura.");
    }

    return prismaClient.scheduledPost.create({
      data: {
        customerId,
        title,
        content,
        hashtags: hashtags ?? null,
        imageUrl: imageUrl ?? null,
        scheduledAt: scheduledAtDate,
        status: PostStatus.SCHEDULED,
      },
    });
  }

  async listByCustomer(customerId: string, filters?: ListByCustomerFilters) {
    if (!customerId) {
      throw new Error("customerId é obrigatório.");
    }

    const where: {
      customerId: string;
      scheduledAt?: { gte?: Date; lte?: Date };
      status?: PostStatus;
    } = { customerId };

    if (filters?.startDate || filters?.endDate) {
      where.scheduledAt = {};
      if (filters.startDate) {
        const start = typeof filters.startDate === "string" ? new Date(filters.startDate) : filters.startDate;
        where.scheduledAt.gte = start;
      }
      if (filters.endDate) {
        const end = typeof filters.endDate === "string" ? new Date(filters.endDate) : filters.endDate;
        where.scheduledAt.lte = end;
      }
    }

    if (filters?.status) {
      where.status = filters.status;
    }

    return prismaClient.scheduledPost.findMany({
      where,
      orderBy: { scheduledAt: "asc" },
    });
  }

  async getById(id: string, customerId: string) {
    if (!id || !customerId) {
      throw new Error("id e customerId são obrigatórios.");
    }

    const post = await prismaClient.scheduledPost.findFirst({
      where: { id, customerId },
    });

    if (!post) {
      throw new Error("Post agendado não encontrado.");
    }

    return post;
  }

  async update(id: string, customerId: string, data: UpdateScheduledPostProps) {
    await this.getById(id, customerId);

    const payload: {
      title?: string;
      content?: string;
      hashtags?: string | null;
      imageUrl?: string | null;
      scheduledAt?: Date;
      status?: PostStatus;
    } = {};

    if (data.title !== undefined) payload.title = data.title;
    if (data.content !== undefined) payload.content = data.content;
    if (data.hashtags !== undefined) payload.hashtags = data.hashtags ?? null;
    if (data.imageUrl !== undefined) payload.imageUrl = data.imageUrl ?? null;
    if (data.status !== undefined) payload.status = data.status;
    if (data.scheduledAt !== undefined) {
      const d = typeof data.scheduledAt === "string" ? new Date(data.scheduledAt) : data.scheduledAt;
      if (isNaN(d.getTime())) throw new Error("scheduledAt deve ser uma data válida.");
      payload.scheduledAt = d;
    }

    return prismaClient.scheduledPost.update({
      where: { id },
      data: payload,
    });
  }

  async delete(id: string, customerId: string) {
    await this.getById(id, customerId);

    await prismaClient.scheduledPost.delete({
      where: { id },
    });

    return { message: "Post agendado removido com sucesso." };
  }

  /**
   * Marca posts agendados cuja data já passou como DUE e cria notificação para o cliente.
   * Pode ser chamado por um cron/job em intervalos.
   */
  async checkDuePosts(customerId: string) {
    const duePosts = await prismaClient.scheduledPost.findMany({
      where: {
        customerId,
        status: PostStatus.SCHEDULED,
        scheduledAt: { lte: new Date() },
      },
    });

    const notificationService = new PostNotificationService();

    for (const post of duePosts) {
      await prismaClient.scheduledPost.update({
        where: { id: post.id },
        data: { status: PostStatus.DUE },
      });

      await notificationService.createPostDueNotification(customerId, post.title);
    }

    return { processed: duePosts.length };
  }
}

export { ScheduledPostsService };

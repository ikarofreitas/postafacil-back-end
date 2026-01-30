import prismaClient from "../prisma";
import { NotificationType } from "../generated/prisma";

class PostNotificationService {
  async createPostDueNotification(customerId: string, postTitle: string) {
    return prismaClient.notification.create({
      data: {
        customerId,
        type: NotificationType.POST_DUE,
        title: "Post agendado para hoje 📅",
        message: `Seu post "${postTitle}" está pronto para publicar.`,
      },
    });
  }

  async listByCustomer(customerId: string) {
    return prismaClient.notification.findMany({
      where: { customerId },
      orderBy: { createdAt: "desc" },
    });
  }

  async markAsRead(notificationId: string, customerId: string) {
    return prismaClient.notification.updateMany({
      where: {
        id: notificationId,
        customerId,
        read: false,
      },
      data: { read: true },
    });
  }

  async markAllAsRead(customerId: string) {
    return prismaClient.notification.updateMany({
      where: {
        customerId,
        read: false,
      },
      data: { read: true },
    });
  }

  async countUnread(customerId: string) {
    return prismaClient.notification.count({
      where: {
        customerId,
        read: false,
      },
    });
  }
}

export { PostNotificationService };

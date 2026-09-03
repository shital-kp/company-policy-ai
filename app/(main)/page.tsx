import ClientChat from "@/app/components/ClientChat/ClientChat";
import HomeWelcomeSection from '@/app/components/HomeWelcomeSection/HomeWelcomeSection';
import styles from "./page.module.scss";

type PageProps = {
  searchParams: Promise<{
    chatId?: string;
  }>;
};

export default async function ChatPage({
  searchParams,
}: PageProps) {
  const { chatId } = await searchParams;

  let selectedChat = null;

  if (chatId) {
    selectedChat = await prisma.chat.findUnique({
      where: {
        id: chatId,
      },
      include: {
        messages: {
          orderBy: {
            createdAt: "asc",
          },
        },
      },
    });
  }

  return (
    <div className={styles.mainContent}>
      <ClientChat
        welcome={<HomeWelcomeSection />}
        selectedChat={selectedChat}
      />
    </div>

  );
}
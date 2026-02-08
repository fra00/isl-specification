export function MessageInput(props: { onSend: (content: string) => void }): React.Element;

export function MessageBubble(props: {
  message: {
    id: string;
    senderId: string;
    recipientId: string;
    content: string;
    timestamp: number;
    type: 'USER' | 'BOT';
  };
  isOwnMessage: boolean;
}): React.Element;

export function ChatWindow(props: {
  messages?: Array<{
    id: string;
    senderId: string;
    recipientId: string;
    content: string;
    timestamp: number;
    type: 'USER' | 'BOT';
  }>;
  onSendMessage: (content: string) => void;
  currentUserId: string; // Added to fulfill MessageBubble's 'isOwnMessage' contract
}): React.Element;

export function ContactList(props: {
  contacts?: Array<{
    id: string;
    name: string;
    status: 'ONLINE' | 'OFFLINE';
  }>;
  onSelectContact: (contactId: string) => void;
}): React.Element;
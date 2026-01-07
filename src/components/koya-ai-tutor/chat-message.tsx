// @/components/koya-ai-tutor/chat-message.tsx
import { Bot, Lightbulb, UserCircle } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import type { Message } from './tutor-view';

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const { role, content } = message;
  const isUser = role === 'user';
  const isHint = role === 'hint';

  const Icon = isUser ? UserCircle : isHint ? Lightbulb : Bot;
  const avatarBg = isUser ? 'bg-transparent' : isHint ? 'bg-yellow-400/20' : 'bg-primary';
  const avatarText = isUser ? 'text-accent' : isHint ? 'text-yellow-500' : 'text-primary-foreground';
  
  const messageStyles = cn(
    'max-w-md rounded-2xl p-4 whitespace-pre-wrap shadow-sm',
    isUser
      ? 'rounded-br-none bg-primary text-primary-foreground'
      : 'rounded-bl-none',
    isHint
      ? 'border-yellow-300 bg-yellow-50 text-foreground'
      : 'bg-primary text-primary-foreground',
    !isUser && !isHint && 'bg-primary text-primary-foreground'
  );


  return (
    <div
      className={cn(
        'flex items-end gap-3',
        isUser ? 'justify-end' : 'justify-start'
      )}
    >
      {!isUser && (
        <Avatar className="h-9 w-9 border-2">
          <AvatarFallback className={cn(avatarBg, avatarText)}>
            <Icon className="h-6 w-6" />
          </AvatarFallback>
        </Avatar>
      )}

      <div className={messageStyles}>
        <p className="text-base">{content}</p>
      </div>

    </div>
  );
}

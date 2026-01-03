// @/components/socratic-ai/chat-message.tsx
import { Bot, Lightbulb, UserCircle } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import type { Message } from './tutor-view';

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const { role, content } = message;
  const isUser = role === 'user';
  const isHint = role === 'hint';
  const isAssistant = role === 'assistant';

  const Icon = isUser ? UserCircle : isHint ? Lightbulb : Bot;
  const avatarBg = isUser ? 'bg-accent/20' : isHint ? 'bg-yellow-400/20' : 'bg-secondary';
  const avatarText = isUser ? 'text-accent' : isHint ? 'text-yellow-500' : 'text-primary';
  const messageBg = isHint ? 'border-yellow-300 bg-yellow-50' : 'bg-card';

  return (
    <div
      className={cn(
        'flex items-start gap-4',
        isUser ? 'justify-end' : 'justify-start'
      )}
    >
      {!isUser && (
        <Avatar className="h-9 w-9 border">
          <AvatarFallback className={cn(avatarBg, avatarText)}>
            <Icon className="h-5 w-5" />
          </AvatarFallback>
        </Avatar>
      )}

      <div
        className={cn(
          'max-w-xl rounded-lg border p-4 whitespace-pre-wrap',
          isUser
            ? 'rounded-tr-none bg-primary text-primary-foreground'
            : cn('rounded-tl-none', messageBg),
        )}
      >
        <p className="text-base">{content}</p>
      </div>

      {isUser && (
        <Avatar className="h-9 w-9 border">
          <AvatarFallback className={cn(avatarBg, avatarText)}>
            <Icon className="h-5 w-5" />
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
}

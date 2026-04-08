import React from 'react';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ArrowRight, ShieldCheck, ShieldOff, Activity } from 'lucide-react';

interface ChatMessageProps {
    role: 'assistant' | 'user';
    content: string;
    isLoading?: boolean;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ role, content, isLoading = false }) => {
    const isUser = role === 'user';
    const containerClasses = `flex ${isUser ? 'justify-end' : 'justify-start'}`;
    const bubbleClasses = `p-8 rounded-antigravity max-w-[80%] text-base leading-relaxed border shadow-sm ${isUser
            ? 'bg-authority text-cream rounded-tr-none border-authority/5'
            : 'bg-white text-authority/80 rounded-tl-none border-authority/5 italic'
        }`;

    return (
        <div className={containerClasses}>
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={bubbleClasses}
            >
                {isLoading ? (
                    <div className="flex gap-2">
                        <div className="w-2 h-2 rounded-full bg-sage animate-bounce" />
                        <div className="w-2 h-2 rounded-full bg-sage animate-bounce [animation-delay:-.3s]" />
                        <div className="w-2 h-2 rounded-full bg-sage animate-bounce [animation-delay:-.5s]" />
                    </div>
                ) : (
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
                )}
            </motion.div>
        </div>
    );
};

export default ChatMessage;

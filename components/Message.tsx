
import React from 'react';
import { ChatMessage, MessageRole } from '../types';
import Badge from './Badge';
import UserIcon from './icons/UserIcon';
import RobotIcon from './icons/RobotIcon';

interface MessageProps {
  message: ChatMessage;
}

const Message: React.FC<MessageProps> = ({ message }) => {
  const isUser = message.role === MessageRole.USER;

  const containerClasses = isUser ? 'justify-end' : 'justify-start';
  const bubbleClasses = isUser
    ? 'bg-blue-600 rounded-br-none'
    : 'bg-gray-700 rounded-bl-none';

  return (
    <div className={`flex items-start gap-3 w-full ${containerClasses}`}>
      {!isUser && (
        <div className="w-8 h-8 flex-shrink-0 bg-gray-600 rounded-full flex items-center justify-center">
          <RobotIcon className="w-5 h-5 text-gray-300" />
        </div>
      )}
      <div className={`max-w-2xl flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
        {message.classification && (
            <Badge classification={message.classification} />
        )}
        <div
          className={`px-4 py-3 rounded-xl text-white ${bubbleClasses} whitespace-pre-wrap`}
        >
          {message.content || <span className="animate-pulse">...</span>}
        </div>
      </div>
      {isUser && (
         <div className="w-8 h-8 flex-shrink-0 bg-gray-600 rounded-full flex items-center justify-center">
          <UserIcon className="w-5 h-5 text-gray-300" />
        </div>
      )}
    </div>
  );
};

export default Message;

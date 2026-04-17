import React from 'react';
import { Check, CheckCheck, Clock, Download, FileText, Image } from 'lucide-react';

const ChatMessage = ({ message, isFirstInGroup, isLastInGroup, formatTime }) => {
  const isOwn = message.senderId === 'current-user';

  const getStatusIcon = () => {
    if (!isOwn) return null;
    
    switch (message.status) {
      case 'read':
        return <CheckCheck size={14} className="text-blue-500" />;
      case 'delivered':
        return <CheckCheck size={14} className="text-gray-500" />;
      case 'sent':
        return <Check size={14} className="text-gray-500" />;
      default:
        return <Clock size={14} className="text-gray-500" />;
    }
  };

  const MessageAttachment = ({ attachment }) => {
    const isImage = attachment.type?.startsWith('image/');

    return (
      <div className="mt-2 rounded-lg overflow-hidden border border-gray-200 bg-white">
        {isImage ? (
          <img
            src={attachment.preview || attachment.url}
            alt={attachment.name}
            className="max-w-full h-auto max-h-48 object-cover"
          />
        ) : (
          <div className="flex items-center p-3">
            <FileText size={20} className="text-gray-400 mr-3" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{attachment.name}</p>
              <p className="text-xs text-gray-500">
                {(attachment.size / 1024).toFixed(1)} KB
              </p>
            </div>
            <a
              href={attachment.url}
              download
              className="p-2 hover:bg-gray-100 rounded"
            >
              <Download size={16} className="text-gray-600" />
            </a>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
      <div className={`flex max-w-[70%] ${isOwn ? 'flex-row-reverse' : 'flex-row'}`}>
        {/* Avatar (only for first message in group from other person) */}
        {!isOwn && isFirstInGroup && (
          <div className="flex-shrink-0 mr-2 mt-1">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full flex items-center justify-center">
              <span className="text-sm font-bold text-primary-600">
                {message.senderName?.charAt(0)}
              </span>
            </div>
          </div>
        )}
        
        {/* Spacer for own messages */}
        {isOwn && isFirstInGroup && <div className="w-8 mr-2"></div>}

        {/* Message Bubble */}
        <div>
          {/* Sender Name (for group messages) */}
          {!isOwn && isFirstInGroup && (
            <p className="text-xs font-medium text-gray-700 mb-1 ml-1">
              {message.senderName}
            </p>
          )}

          <div
            className={`rounded-2xl px-4 py-2 ${
              isOwn
                ? 'bg-primary-500 text-white'
                : 'bg-white text-gray-800 shadow-sm border border-gray-200'
            } ${isFirstInGroup ? (isOwn ? 'rounded-br-lg' : 'rounded-bl-lg') : ''} ${
              isLastInGroup ? (isOwn ? 'rounded-tr-lg' : 'rounded-tl-lg') : ''
            }`}
          >
            {/* Attachments */}
            {message.attachments?.length > 0 && (
              <div className="space-y-2 mb-2">
                {message.attachments.map((att, idx) => (
                  <MessageAttachment key={idx} attachment={att} />
                ))}
              </div>
            )}

            {/* Message Text */}
            {message.text && (
              <p className="text-sm whitespace-pre-wrap break-words">
                {message.text}
              </p>
            )}

            {/* Timestamp & Status */}
            <div className={`flex items-center justify-end mt-1 space-x-1 text-xs ${
              isOwn ? 'text-primary-100' : 'text-gray-500'
            }`}>
              <span>{formatTime(message.createdAt)}</span>
              {isOwn && getStatusIcon()}
            </div>
          </div>

          {/* Read Receipt (for own messages) */}
          {isOwn && isLastInGroup && message.status === 'read' && (
            <p className="text-xs text-gray-500 mt-1 text-right">
              Seen {formatTime(message.readAt)}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;









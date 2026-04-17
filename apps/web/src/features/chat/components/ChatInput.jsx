import React, { useState, useRef } from 'react';
import { Paperclip, Send, Smile, X, Image, FileText } from 'lucide-react';
import EmojiPicker from './EmojiPicker';

const ChatInput = ({ onSend, onTyping, sending }) => {
  const [message, setMessage] = useState('');
  const [attachments, setAttachments] = useState([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const fileInputRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const handleChange = (e) => {
    setMessage(e.target.value);
    
    // Send typing indicator
    onTyping(true);
    
    // Clear previous timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    // Set new timeout to stop typing
    typingTimeoutRef.current = setTimeout(() => {
      onTyping(false);
    }, 2000);
  };

  const handleSend = () => {
    if (!message.trim() && attachments.length === 0) return;
    
    onSend(message, attachments);
    setMessage('');
    setAttachments([]);
    onTyping(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    const newAttachments = files.map(file => ({
      file,
      name: file.name,
      size: file.size,
      type: file.type,
      preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : null
    }));
    setAttachments(prev => [...prev, ...newAttachments]);
  };

  const removeAttachment = (index) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const handleEmojiSelect = (emoji) => {
    setMessage(prev => prev + emoji);
    setShowEmojiPicker(false);
  };

  const AttachmentPreview = ({ attachment, index }) => (
    <div className="relative group">
      <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
        {attachment.type?.startsWith('image/') ? (
          <img
            src={attachment.preview}
            alt={attachment.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <FileText size={24} className="text-gray-400" />
          </div>
        )}
      </div>
      <button
        onClick={() => removeAttachment(index)}
        className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <X size={12} />
      </button>
      <p className="text-xs text-gray-500 mt-1 truncate max-w-[4rem]">
        {attachment.name}
      </p>
    </div>
  );

  return (
    <div className="p-3 border-t bg-white">
      {/* Attachment Previews */}
      {attachments.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3 pb-2 border-b">
          {attachments.map((att, index) => (
            <AttachmentPreview key={index} attachment={att} index={index} />
          ))}
        </div>
      )}

      {/* Input Area */}
      <div className="flex items-end space-x-2">
        <div className="flex-1 relative">
          <textarea
            rows="1"
            value={message}
            onChange={handleChange}
            onKeyDown={handleKeyPress}
            placeholder="Type a message..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
            style={{ minHeight: '48px', maxHeight: '120px' }}
          />

          <div className="absolute right-2 bottom-2 flex items-center space-x-1">
            <button
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <Smile size={18} className="text-gray-500" />
            </button>
            
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              multiple
              accept="image/*,.pdf,.doc,.docx,.xls,.xlsx"
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <Paperclip size={18} className="text-gray-500" />
            </button>
          </div>

          {/* Emoji Picker */}
          {showEmojiPicker && (
            <div className="absolute bottom-full mb-2 right-0">
              <EmojiPicker onSelect={handleEmojiSelect} />
            </div>
          )}
        </div>

        <button
          onClick={handleSend}
          disabled={(!message.trim() && attachments.length === 0) || sending}
          className="p-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
};

export default ChatInput;









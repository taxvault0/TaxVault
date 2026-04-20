export const getId = (value) => {
  if (!value) return '';
  if (typeof value === 'string') return value;
  return value._id || value.id || '';
};

export const getFullName = (user) => {
  if (!user) return 'Unknown User';
  if (typeof user === 'string') return user;

  return (
    user.name ||
    [user.firstName, user.lastName].filter(Boolean).join(' ').trim() ||
    user.email ||
    'Unknown User'
  );
};

export const mapConversation = (item, currentUserId) => {
  const participants = Array.isArray(item?.participants) ? item.participants : [];

  const otherParticipant =
    participants.find((participant) => getId(participant) !== currentUserId) ||
    item?.otherParticipant ||
    item?.receiver ||
    item?.user ||
    null;

  const lastMessage = item?.lastMessage || item?.latestMessage || null;

  return {
    id: getId(item),
    title: getFullName(otherParticipant),
    avatar: otherParticipant?.avatar || otherParticipant?.profileImage || '',
    otherParticipantId: getId(otherParticipant),
    participants,
    lastMessageText:
      lastMessage?.text ||
      item?.lastMessageText ||
      item?.snippet ||
      'No messages yet',
    lastMessageAt:
      lastMessage?.createdAt ||
      item?.updatedAt ||
      item?.lastMessageAt ||
      item?.createdAt ||
      null,
    unreadCount: item?.unreadCount || 0,
    raw: item,
  };
};

export const mapMessage = (item, currentUserId) => {
  const senderId = getId(item?.sender || item?.senderId || item?.user);
  const receiverId = getId(item?.receiver || item?.receiverId);

  return {
    id: getId(item),
    text: item?.text || item?.message || '',
    createdAt: item?.createdAt || item?.timestamp || new Date().toISOString(),
    senderId,
    receiverId,
    isMine: senderId === currentUserId,
    status: item?.status || 'sent',
    raw: item,
  };
};
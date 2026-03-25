import React, { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Search, Settings, Mail, Image, Smile, Send, Video, Info, ArrowLeft } from "lucide-react";
import { useAppStore } from "../store/useAppStore";
import { mockConversations } from "../data/mockMessages";
import { formatMessageTime, formatTimestamp } from "../utils/formatDate";
import { useMediaQuery } from "../hooks/useMediaQuery";
import type { Conversation, Message } from "../store/useAppStore";

function ConversationList({
  conversations,
  selectedId,
  onSelect,
}: {
  conversations: Conversation[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  const [searchValue, setSearchValue] = useState("");

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-4 py-3">
        <h1 className="text-xl font-bold">Mensagens</h1>
        <div className="flex items-center gap-2">
          <button className="p-2 -m-2 rounded-full hover:bg-[rgba(231,233,234,0.1)]" aria-label="Settings">
            <Settings className="w-5 h-5" />
          </button>
          <button className="p-2 -m-2 rounded-full hover:bg-[rgba(231,233,234,0.1)]" aria-label="New message">
            <Mail className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="px-4 pb-3">
        <div className="flex items-center bg-x-search-bg rounded-full px-4 py-2.5">
          <Search className="w-[18px] h-[18px] text-x-text-secondary" />
          <input
            type="text"
            placeholder="Buscar mensagens"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="ml-3 bg-transparent text-[15px] text-x-text-primary placeholder-x-text-secondary outline-none flex-1"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {conversations.map((conv) => (
          <button
            key={conv.id}
            onClick={() => onSelect(conv.id)}
            className={`w-full px-4 py-3 flex items-center gap-3 hover:bg-[rgba(231,233,234,0.03)] transition-colors text-left ${
              selectedId === conv.id ? "bg-[rgba(231,233,234,0.03)]" : ""
            }`}
          >
            <img
              src={conv.participant.avatar}
              alt={conv.participant.displayName}
              className="w-12 h-12 rounded-full object-cover flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 min-w-0">
                  <span className="text-[15px] font-bold truncate">{conv.participant.displayName}</span>
                  <span className="text-[15px] text-x-text-secondary truncate">@{conv.participant.handle}</span>
                </div>
                <span className="text-[13px] text-x-text-secondary flex-shrink-0 ml-2">
                  {formatTimestamp(conv.lastTimestamp)}
                </span>
              </div>
              <div className="flex items-center justify-between mt-0.5">
                <p className="text-[15px] text-x-text-secondary truncate">{conv.lastMessage}</p>
                {conv.unreadCount > 0 && (
                  <span className="w-5 h-5 bg-x-accent rounded-full text-[11px] font-bold flex items-center justify-center flex-shrink-0 ml-2">
                    {conv.unreadCount}
                  </span>
                )}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function ChatView({ conversation, onBack }: { conversation: Conversation | null; onBack?: () => void }) {
  const { currentUser, addMessage } = useAppStore();
  const [text, setText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversation?.messages.length]);

  if (!conversation) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center max-w-[360px]">
          <h2 className="text-3xl font-extrabold mb-2">Selecione uma mensagem</h2>
          <p className="text-x-text-secondary text-[15px]">
            Escolha uma conversa existente ou inicie uma nova.
          </p>
          <button className="mt-6 brand-gradient hover:opacity-90 text-white font-bold text-[15px] rounded-full px-8 py-3 transition-opacity">
            Nova mensagem
          </button>
        </div>
      </div>
    );
  }

  const handleSend = () => {
    if (!text.trim()) return;
    const msg: Message = {
      id: `msg-${Date.now()}`,
      senderId: "current",
      text: text.trim(),
      timestamp: new Date(),
      read: true,
    };
    addMessage(conversation.id, msg);
    setText("");
  };

  return (
    <div className="flex-1 flex flex-col h-screen">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-2 border-b border-x-border">
        {onBack && (
          <button onClick={onBack} className="p-2 -m-2 rounded-full hover:bg-[rgba(231,233,234,0.1)]" aria-label="Back">
            <ArrowLeft className="w-5 h-5" />
          </button>
        )}
        <img src={conversation.participant.avatar} alt="" className="w-8 h-8 rounded-full object-cover" />
        <div className="flex-1">
          <p className="text-[15px] font-bold">{conversation.participant.displayName}</p>
        </div>
        <button className="p-2 rounded-full hover:bg-[rgba(231,233,234,0.1)]" aria-label="Video call">
          <Video className="w-5 h-5" />
        </button>
        <button className="p-2 rounded-full hover:bg-[rgba(231,233,234,0.1)]" aria-label="Info">
          <Info className="w-5 h-5" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-2">
        {conversation.messages.map((msg, i) => {
          const isSent = msg.senderId === "current";
          const showTime = i === 0 || (conversation.messages[i - 1] &&
            new Date(msg.timestamp).getTime() - new Date(conversation.messages[i - 1].timestamp).getTime() > 3600000);

          return (
            <React.Fragment key={msg.id}>
              {showTime && (
                <div className="text-center py-3">
                  <span className="text-[13px] text-x-text-secondary">{formatMessageTime(msg.timestamp)}</span>
                </div>
              )}
              <div className={`flex ${isSent ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[75%] px-4 py-3 rounded-2xl text-[15px] leading-5 ${
                    isSent
                      ? "bg-x-accent text-white rounded-br-sm"
                      : "bg-x-surface text-x-text-primary rounded-bl-sm"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            </React.Fragment>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="px-4 py-3 border-t border-x-border">
        <div className="flex items-center gap-2 bg-x-surface rounded-2xl px-3 py-2">
          <button className="p-1.5 rounded-full hover:bg-[rgba(0,230,118,0.08)]" aria-label="Add image">
            <Image className="w-5 h-5 text-x-accent" />
          </button>
          <button className="p-1.5 rounded-full hover:bg-[rgba(0,230,118,0.08)]" aria-label="Add emoji">
            <Smile className="w-5 h-5 text-x-accent" />
          </button>
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Escreva uma mensagem"
            className="flex-1 bg-transparent text-[15px] text-x-text-primary placeholder-x-text-secondary outline-none"
          />
          <button
            onClick={handleSend}
            disabled={!text.trim()}
            className="p-1.5 rounded-full hover:bg-[rgba(0,230,118,0.08)] disabled:opacity-40"
            aria-label="Send"
          >
            <Send className="w-5 h-5 text-x-accent" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Messages() {
  const { id } = useParams<{ id?: string }>();
  const [selectedId, setSelectedId] = useState<string | null>(id || null);
  const isMobile = useMediaQuery("(max-width: 767px)");

  const conversations = mockConversations;
  const selectedConversation = conversations.find((c) => c.id === selectedId) || null;

  if (isMobile) {
    if (selectedId && selectedConversation) {
      return (
        <ChatView
          conversation={selectedConversation}
          onBack={() => setSelectedId(null)}
        />
      );
    }
    return (
      <ConversationList
        conversations={conversations}
        selectedId={selectedId}
        onSelect={setSelectedId}
      />
    );
  }

  return (
    <div className="flex h-screen">
      <div className="w-[380px] border-r border-x-border flex-shrink-0 overflow-hidden">
        <ConversationList
          conversations={conversations}
          selectedId={selectedId}
          onSelect={setSelectedId}
        />
      </div>
      <ChatView conversation={selectedConversation} />
    </div>
  );
}

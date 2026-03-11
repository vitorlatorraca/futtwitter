import React, { useState, useRef } from "react";
import { Image, FileVideo, BarChart3, Smile, CalendarClock, MapPin, Globe } from "lucide-react";
import { useAppStore } from "../../store/useAppStore";
import type { Post } from "../../store/useAppStore";

interface ComposeBoxProps {
  onPost?: (post: Post) => void;
  placeholder?: string;
  replyTo?: string;
  autoFocus?: boolean;
}

export default function ComposeBox({ onPost, placeholder = "O que está acontecendo no futebol?", replyTo, autoFocus }: ComposeBoxProps) {
  const { currentUser, addPost } = useAppStore();
  const [text, setText] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const charLimit = 280;
  const remaining = charLimit - text.length;
  const progress = Math.min(text.length / charLimit, 1);
  const overLimit = remaining < 0;

  const handleSubmit = () => {
    if (!text.trim() || overLimit) return;
    const newPost: Post = {
      id: `post-${Date.now()}`,
      author: currentUser,
      text: text.trim(),
      timestamp: new Date(),
      images: [],
      liked: false,
      reposted: false,
      bookmarked: false,
      likes: 0,
      reposts: 0,
      replies: 0,
      views: 0,
      parentId: replyTo,
    };
    addPost(newPost);
    onPost?.(newPost);
    setText("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    const ta = e.target;
    ta.style.height = "auto";
    ta.style.height = ta.scrollHeight + "px";
  };

  const circumference = 2 * Math.PI * 10;
  const strokeDashoffset = circumference * (1 - progress);

  const toolbarIcons = [
    { icon: Image, label: "Media" },
    { icon: FileVideo, label: "GIF" },
    { icon: BarChart3, label: "Poll" },
    { icon: Smile, label: "Emoji" },
    { icon: CalendarClock, label: "Schedule" },
    { icon: MapPin, label: "Location" },
  ];

  return (
    <div className="flex px-4 pt-3 pb-2">
      <img
        src={currentUser.avatar}
        alt={currentUser.displayName}
        className="w-10 h-10 rounded-full object-cover flex-shrink-0 mt-1"
      />
      <div className="flex-1 ml-3">
        <textarea
          ref={textareaRef}
          value={text}
          onChange={handleTextChange}
          placeholder={placeholder}
          autoFocus={autoFocus}
          className="w-full bg-transparent text-xl text-x-text-primary placeholder-x-text-secondary outline-none resize-none min-h-[52px] py-3"
          rows={1}
        />

        <div className="flex items-center justify-between border-t border-x-border pt-3 pb-1">
          <div className="flex items-center gap-1 -ml-2">
            {toolbarIcons.map(({ icon: Icon, label }) => (
              <button
                key={label}
                className="p-2 rounded-full hover:bg-[rgba(29,155,240,0.1)] transition-colors"
                aria-label={label}
              >
                <Icon className="w-5 h-5 text-x-accent" />
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            {text.length > 0 && (
              <div className="flex items-center gap-2">
                <div className="relative w-[30px] h-[30px]">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 24 24">
                    <circle
                      cx="12" cy="12" r="10"
                      fill="none"
                      stroke="#2f3336"
                      strokeWidth="2"
                    />
                    <circle
                      cx="12" cy="12" r="10"
                      fill="none"
                      stroke={overLimit ? "#f4212e" : remaining <= 20 ? "#ffd400" : "#1a56db"}
                      strokeWidth="2"
                      strokeDasharray={circumference}
                      strokeDashoffset={strokeDashoffset}
                      strokeLinecap="round"
                    />
                  </svg>
                  {remaining <= 20 && (
                    <span className={`absolute inset-0 flex items-center justify-center text-[11px] font-medium ${overLimit ? "text-[#f4212e]" : "text-x-text-secondary"}`}>
                      {remaining}
                    </span>
                  )}
                </div>
                <div className="w-px h-[30px] bg-x-border" />
              </div>
            )}
            <button
              onClick={handleSubmit}
              disabled={!text.trim() || overLimit}
              className="brand-gradient hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-[15px] rounded-full px-4 py-1.5 transition-opacity"
            >
              Postar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

import type { ReactNode } from 'react';

interface TweetFeedProps {
  children: ReactNode;
}

export function TweetFeed({ children }: TweetFeedProps) {
  return (
    <div className="tweet-feed">
      {children}
    </div>
  );
}

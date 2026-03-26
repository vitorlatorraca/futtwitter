import { Navbar } from '@/components/navbar';
import Feed from '@/components/feed/Feed';

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <div className="flex justify-center">
        <div className="w-full max-w-[600px] border-x border-x-border min-h-screen">
          <Feed />
        </div>
      </div>
    </div>
  );
}

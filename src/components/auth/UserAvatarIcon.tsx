import { CupSoda, Dumbbell } from 'lucide-react';
import { cn } from '@/lib/utils';
import { UserAvatar } from '@/lib/auth-storage';

export function UserAvatarIcon({ avatar, className }: { avatar?: UserAvatar | string; className?: string }) {
  if (avatar?.startsWith('/userphotos/')) {
    return (
      <div className={cn('overflow-hidden rounded-full border border-primary/30 bg-primary/15', className)}>
        <img src={avatar} alt="User avatar" className="h-full w-full object-cover" />
      </div>
    );
  }

  const Icon = avatar === 'bottle' ? CupSoda : Dumbbell;

  return (
    <div className={cn('flex items-center justify-center rounded-full bg-primary/15 text-primary border border-primary/30', className)}>
      <Icon className="h-5 w-5" />
    </div>
  );
}

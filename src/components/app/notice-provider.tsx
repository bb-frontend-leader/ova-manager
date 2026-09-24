import { useCallback, useMemo, useState } from 'react';
import { CircleCheck, Info, type LucideIcon, TriangleAlert } from 'lucide-react';

import { type Notice, NoticeContext, type NoticeVariant } from '@/hooks/useNotice';
import { cn } from '@/lib/utils';

import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';

const VARIANTS: Record<NoticeVariant, { icon: LucideIcon; iconClassName: string }> = {
  success: { icon: CircleCheck, iconClassName: 'bg-green-400' },
  error: { icon: TriangleAlert, iconClassName: 'bg-red-400' },
  info: { icon: Info, iconClassName: 'bg-main' }
};

interface Props {
  children: React.ReactNode;
}

// Renders one modal for the whole app. Any component can open it through `useNotice()`.
export const NoticeProvider: React.FC<Props> = ({ children }) => {
  const [notice, setNotice] = useState<Notice | null>(null);
  const [open, setOpen] = useState(false);

  // A new notice replaces the one on screen. `notice` is kept when closing so the text
  // doesn't vanish in the middle of the closing animation.
  const showNotice = useCallback((next: Notice) => {
    setNotice(next);
    setOpen(true);
  }, []);

  const value = useMemo(() => ({ showNotice }), [showNotice]);

  const { icon: Icon, iconClassName } = VARIANTS[notice?.variant ?? 'info'];

  return (
    <NoticeContext.Provider value={value}>
      {children}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent showCloseButton={false} className="sm:max-w-md">
          <DialogHeader>
            <div className="flex items-start gap-3">
              <span
                className={cn(
                  'flex size-10 shrink-0 items-center justify-center rounded-base border-2 border-border text-main-foreground',
                  iconClassName
                )}
              >
                <Icon aria-hidden="true" className="size-5" />
              </span>
              <div className="min-w-0 space-y-1.5">
                <DialogTitle>{notice?.title}</DialogTitle>
                <DialogDescription className="break-words">{notice?.description}</DialogDescription>
              </div>
            </div>
          </DialogHeader>
          {notice?.steps && (
            <ol className="list-decimal space-y-2 pl-5 text-sm marker:font-bold">
              {notice.steps.map((step) => (
                <li key={step} className="break-words pl-1">
                  {step}
                </li>
              ))}
            </ol>
          )}
          <DialogFooter>
            <Button onClick={() => setOpen(false)}>Got it</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </NoticeContext.Provider>
  );
};

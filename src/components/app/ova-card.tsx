import { useState } from 'react';
import confetti from 'canvas-confetti';
import { Link } from 'lucide-react';

import { useNotice } from '@/hooks/useNotice';
import ovaService from '@/services/ova-service';
import type { Ova } from '@/types/ova';

import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '../ui/card';

// The download button stays disabled for a moment after a click so the same ZIP is not requested twice by mistake.
const DOWNLOAD_START_COOLDOWN_MS = 3_000;

interface Props {
  ova?: Ova;
  viewMode?: 'grid' | 'list';
}

export const OvaCard: React.FC<Props> = ({ ova, viewMode = 'grid' }) => {
  const [isStarting, setIsStarting] = useState(false);
  const { showNotice } = useNotice();

  // Function to navigate to the OVA's URL in a new tab
  const handleNavigateToTheOva = () => {
    if (!ova) return;
    window.open(ova.ovaPath, '_blank');
  };

  // Function to hand the OVA zip download over to the browser. The API answers with
  // `Content-Disposition: attachment` and streams the ZIP, so it starts downloading right away
  // (with the browser's own progress) instead of being buffered in memory first.
  const handleZip = () => {
    if (!ova) return;

    const a = document.createElement('a');
    a.href = ovaService.getOvaZipUrl(ova.id);
    a.download = ''; // Use the file name sent by the API
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    // The browser owns the download from here on, so the user needs to know where to look and what to do with a ZIP
    showNotice({
      variant: 'success',
      title: 'Your download is starting',
      description: `"${ova.title}" is being saved to your computer as a ZIP file. Big OVAs can take several minutes.`,
      steps: [
        "Watch the progress in your browser's downloads: look for a small arrow pointing down (↓) next to the address bar at the top.",
        'Wait until the browser says the download is complete. If it says the download failed, come back here and press "Download" again.',
        'Open your Downloads folder, find the ZIP file and unzip it before opening the OVA (on Windows: right-click the file and choose "Extract all…").'
      ]
    });
    throwConfetti();

    setIsStarting(true);
    setTimeout(() => setIsStarting(false), DOWNLOAD_START_COOLDOWN_MS);
  };

  // Function to copy the OVA link to the clipboard
  const handleCopyLink = async () => {
    if (!ova) return;
    try {
      await navigator.clipboard.writeText(ova.ovaPath);
    } catch {
      // The Clipboard API is missing on pages served without HTTPS, and rejects if the browser denies access
      showNotice({
        variant: 'error',
        title: "We couldn't copy the link",
        description: `Your browser did not let us copy the link to "${ova.title}" automatically. You can still copy it by hand.`,
        steps: [
          'Close this message and press "Go to the OVA".',
          'In the page that opens, click the address bar at the top and press Ctrl + C (Cmd + C on a Mac) to copy the link.'
        ]
      });
      return;
    }

    showNotice({
      variant: 'success',
      title: 'Link copied',
      description: `The link to "${ova.title}" is saved on your clipboard. It has not been sent to anyone yet.`,
      steps: [
        'Open the place where you want to share it: an email, a chat, a document\u2026',
        'Paste it there: press Ctrl + V (Cmd + V on a Mac), or right-click and choose "Paste".'
      ]
    });
  };

  // Function to trigger a confetti animation for 2 seconds (skipped when the user asks for reduced motion)
  const throwConfetti = () => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const timeEnd = Date.now() + 2 * 1000; // Set the end time for the animation (2 seconds from now)
    const colors = ['#FF0D72', '#0ABDE3', '#F9C80E', '#FF477E', '#F9C80E']; // Define the colors for the confetti

    // Recursive function to create confetti bursts
    (function frame() {
      // Create confetti burst from the left side
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: colors
      });

      // Create confetti burst from the right side
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: colors
      });

      // Continue the animation until the time ends
      if (Date.now() < timeEnd) {
        requestAnimationFrame(frame);
      }
    })();
  };

  if (viewMode === 'list') {
    return (
      <Card className="flex-col items-stretch gap-3 py-3 bg-bw md:flex-row md:items-center">
        <div className="flex min-w-0 flex-1 items-center gap-3 px-3 md:pl-6 md:pr-0">
          <img
            src={ova?.imagePath}
            alt={ova?.title}
            loading="lazy"
            decoding="async"
            className="h-16 w-24 shrink-0 border-border border-2 object-cover rounded-sm"
          />
          <div className="min-w-0 flex-1 space-y-1">
            <Badge variant="neutral" className="text-[10px] px-1.5 py-0 font-light uppercase">
              {ova?.group || 'Group-2'}
            </Badge>
            <div className="flex items-center gap-1.5 min-w-0">
              <h2 className="text-sm font-bold capitalize truncate min-w-0">{ova?.title || 'Ova'}</h2>
              <button
                onClick={handleCopyLink}
                aria-label="Copy OVA link"
                className="-m-1.5 shrink-0 p-1.5 text-muted-foreground hover:text-foreground transition-colors"
              >
                <Link className="h-3 w-3" />
              </button>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 px-3 md:shrink-0 md:pl-0 md:pr-6">
          <Button variant="neutral" size="sm" className="flex-1 md:flex-none" onClick={handleNavigateToTheOva}>
            Go to the OVA
          </Button>
          <Button size="sm" className="flex-1 md:flex-none" onClick={handleZip} disabled={isStarting}>
            {isStarting ? (
              <svg
                aria-hidden="true"
                role="status"
                className="inline w-4 h-4 text-gray-200 animate-spin dark:text-gray-600"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="currentColor"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="#121212"
                />
              </svg>
            ) : (
              'Download'
            )}
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <Badge variant="neutral" className="text-[10px] px-1.5 py-0 font-light uppercase">
          {ova?.group || 'Group-2'}
        </Badge>
        <div className="flex items-center gap-1.5 min-w-0">
          <h2 className="text-lg font-bold capitalize truncate min-w-0">{ova?.title || 'Ova'}</h2>
          <button
            onClick={handleCopyLink}
            aria-label="Copy OVA link"
            className="shrink-0 text-muted-foreground hover:text-foreground transition-colors"
          >
            <Link className="h-3.5 w-3.5" />
          </button>
        </div>
      </CardHeader>
      <CardContent>
        <img
          src={ova?.imagePath}
          alt={ova?.title}
          loading="lazy"
          decoding="async"
          className="w-full h-48 border-border border-2 object-cover"
        />
      </CardContent>
      <CardFooter className="flex flex-between items-center gap-2.5">
        <Button variant="neutral" onClick={handleNavigateToTheOva}>
          Go to the OVA
        </Button>
        <Button onClick={handleZip} disabled={isStarting}>
          {isStarting ? (
            <span className="flex items-center justify-center">
              <svg
                aria-hidden="true"
                role="status"
                className="inline w-10 h-10 text-gray-200 animate-spin dark:text-gray-600"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="currentColor"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="#121212"
                />
              </svg>
            </span>
          ) : (
            'Download'
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

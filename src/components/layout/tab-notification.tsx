'use client';

import { useEffect, useState } from 'react';

interface TabNotificationProps {
  message: string;
}

const TabNotification = ({ message }: TabNotificationProps) => {
  const [originalTitle, setOriginalTitle] = useState('');

  useEffect(() => {
    // Store the original title once when the component mounts
    if (typeof document !== 'undefined') {
      setOriginalTitle(document.title);
    }

    const updateFavicon = (showBadge: boolean) => {
      const links = document.querySelectorAll('link[rel="icon"], link[rel="apple-touch-icon"]');
      if (!links.length) return;

      if (!showBadge) {
        links.forEach(link => {
          (link as HTMLLinkElement).href = '/icon.svg';
        });
        return;
      }

      const canvas = document.createElement('canvas');
      canvas.width = 64;
      canvas.height = 64;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const img = new Image();
      img.src = '/icon.svg';
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        // High DPI canvas (64x64 for standard favicon)
        const size = 64;
        canvas.width = size;
        canvas.height = size;
        
        ctx.clearRect(0, 0, size, size);
        ctx.drawImage(img, 0, 0, size, size);
        
        // Draw red badge (Top Right)
        const badgeRadius = 22;
        const centerX = 42;
        const centerY = 22;
        
        // Shadow for the badge to pop
        ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
        ctx.shadowBlur = 8;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 2;
        
        ctx.beginPath();
        ctx.arc(centerX, centerY, badgeRadius, 0, 2 * Math.PI);
        ctx.fillStyle = '#FF0000'; // Pure bright red
        ctx.fill();
        
        // Reset shadow for stroke and text
        ctx.shadowBlur = 0;
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 4;
        ctx.stroke();
        
        // Draw "1" text
        ctx.font = 'bold 36px sans-serif';
        ctx.fillStyle = '#FFFFFF';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('1', centerX, centerY + 2);
        
        const dataUrl = canvas.toDataURL('image/png');
        links.forEach(link => {
          (link as HTMLLinkElement).href = dataUrl;
        });
      };
      img.onerror = () => {
        console.error('Failed to load notification icon asset');
      };
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        // Change title and favicon when tab is inactive
        setTimeout(() => {
          document.title = message;
          updateFavicon(true);
        }, 500);
      } else {
        // Restore title and favicon when user comes back
        document.title = originalTitle || document.title;
        updateFavicon(false);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [originalTitle, message]);

  return null; // This component doesn't render anything
};


export default TabNotification;

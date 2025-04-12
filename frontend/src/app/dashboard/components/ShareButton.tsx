import React from 'react';
import { Button } from "@/components/ui/button";

function ShareButton({ title, text, url }: { title: string, text: string, url: string }) {
    const handleShare = async () => {
      if (navigator.share) {
        try {
          await navigator.share({ title, text, url });
        } catch (err) {
          console.error("Sharing failed:", err);
        }
      } else {
        try {
          await navigator.clipboard.writeText(url);
          alert("Invite link copied to clipboard! Send it to 3 of your friends");
        } catch (err) {
          alert("Sharing not supported on this device.");
          console.error("Clipboard write failed:", err);
        }
      }
    };
  
    return (
      <Button onClick={handleShare}>
        Share
      </Button>
    );
  }

export default ShareButton;
import React from 'react';
import { Button } from "@/components/ui/button";

function ShareButton({ title, text, url } : { title: string, text: string, url: string}) {
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: text,
          url: url,
        });
      } catch (error) {
        //console.error('Error sharing:', error);
      }
    } else {
      //alert('Web Share API is not supported in this browser.');
    }
  };

  return (
    <Button onClick={handleShare}>
      Share
    </Button>
  );
}

export default ShareButton;
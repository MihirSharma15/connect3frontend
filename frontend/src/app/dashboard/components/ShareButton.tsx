import React from 'react';

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
        console.error('Error sharing:', error);
      }
    } else {
      alert('Web Share API is not supported in this browser.');
    }
  };

  return (
    <button onClick={handleShare}>
      Share
    </button>
  );
}

export default ShareButton;
import React from 'react';
import { Facebook, Twitter, Linkedin, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SocialShareButtonsProps {
  url: string;
  title: string;
  className?: string;
}

const SocialShareButtons = ({ url, title, className = '' }: SocialShareButtonsProps) => {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const shareLinks = [
    {
      name: 'Facebook',
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      icon: <Facebook size={18} />,
      color: 'bg-[#1877F2] hover:bg-[#1877F2]/90',
    },
    {
      name: 'X',
      url: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
      icon: <Twitter size={18} />,
      color: 'bg-black hover:bg-black/90',
    },
    {
      name: 'LinkedIn',
      url: `https://www.linkedin.com/feed/?shareActive=true&text=${encodedTitle} ${encodedUrl}`,
      icon: <Linkedin size={18} />,
      color: 'bg-[#0A66C2] hover:bg-[#0A66C2]/90',
    },
    {
      name: 'Reddit',
      url: `https://www.reddit.com/submit?url=${encodedUrl}&title=${encodedTitle}`,
      icon: <Share2 size={18} />,
      color: 'bg-[#FF4500] hover:bg-[#FF4500]/90',
    },
  ];

  const handleShare = (e: React.MouseEvent<HTMLAnchorElement>, link: string) => {
    e.preventDefault();
    window.open(link, '_blank', 'width=600,height=400');
  };

  return (
    <div className={`flex flex-wrap items-center gap-2 ${className}`}>
      <span className="text-sm font-medium text-gray-500">Share:</span>
      {shareLinks.map((link) => (
        <a
          key={link.name}
          href={link.url}
          onClick={(e) => handleShare(e, link.url)}
          aria-label={`Share on ${link.name}`}
          className="inline-block"
        >
          <Button
            variant="default"
            size="sm"
            className={`${link.color} text-white`}
          >
            {link.icon}
            <span className="ml-1 hidden sm:inline">{link.name}</span>
          </Button>
        </a>
      ))}
    </div>
  );
};

export default SocialShareButtons;

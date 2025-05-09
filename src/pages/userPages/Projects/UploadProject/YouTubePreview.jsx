import React from 'react';

const YouTubePreview = ({ videoUrl }) => {
  const extractYouTubeVideoId = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  const videoId = extractYouTubeVideoId(videoUrl);

  return (
    <div className="mt-4 rounded-xl overflow-hidden shadow-md">
      <div className="aspect-w-16 aspect-h-9 w-full">
        <iframe
          src={`https://www.youtube.com/embed/${videoId}`}
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-96 h-50 rounded-lg"
        ></iframe>
      </div>
    </div>
  );
};

export default YouTubePreview;
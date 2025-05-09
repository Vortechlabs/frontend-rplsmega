import React from 'react'

export const YouTubePreview = ({ videoUrl }) => {
    const videoId = extractYouTubeVideoId(videoUrl);

    if (!videoId) {
        return <p className="text-red-500">Tautan YouTube tidak valid</p>;
    }

    return (
        <div className="mt-4">
            <iframe
                width="100%"
                height="315"
                src={`https://www.youtube.com/embed/${videoId}`}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
            ></iframe>
        </div>
    );
};

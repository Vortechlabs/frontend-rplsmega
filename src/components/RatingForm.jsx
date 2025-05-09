import React, { useState, useEffect } from 'react';
import { FaStar } from 'react-icons/fa';
import apiClient from '../services/GlobalApi';
import { useAuth } from '../auth/AuthContext';
import './RatingForm.css'; 
import RatingSkeleton from './skeleton/RatingSkeleton';

const RatingForm = ({ projectSlug }) => {
  const { user } = useAuth();
  const [userRating, setUserRating] = useState(null);
  const [hoverRating, setHoverRating] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserRating = async () => {
      try {
        if (user) {
          const response = await apiClient.get(`/projects/${projectSlug}/ratings/${user[0].id}`);
          if (response.data) {
            setUserRating(response.data.score);
          }
        }
      } catch (error) {
        console.error("Error fetching rating:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserRating();
  }, [projectSlug, user]);

  const handleRatingSubmit = async (rating) => {
    try {
      await apiClient.post(`/projects/${projectSlug}/ratings`, {
        score: rating,
        userId: user?.id
      });
      setUserRating(rating);
    } catch (error) {
      console.error("Error submitting rating:", error);
    }
  };

  if (isLoading) {
    return <RatingSkeleton />; 
  }

  return (
    <div className="rating-container">
      
      {userRating ? (
        <div className="rating-display">
          <div className="rating-stars">
            {[1, 2, 3, 4, 5].map((star) => (
              <FaStar
                key={star}
                className={`rating-star ${star <= userRating ? 'filled' : 'empty'}`}
                size={24}
              />
            ))}
          </div>
          <span className="rating-value">Kamu memberi rating: {userRating}/5</span>
        </div>
      ) : (
        <div className="rating-input">
          <p>Berikan rating proyek:</p>
          <div className="stars-input">
            {[1, 2, 3, 4, 5].map((star) => (
              <FaStar
                key={star}
                className={`star-input ${star <= hoverRating ? 'hovered' : ''}`}
                size={28}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => handleRatingSubmit(star)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default RatingForm;
import { useState } from 'react';
import { formatDate } from '../../utils/helpers';
import { useAuth } from '../../hooks/useAuth';
import { photosAPI } from '../../services/api';
import Card, { CardTitle, CardContent, CardFooter } from './Card';
import Button from './Button';

const PhotoFrame = ({ photo, onUpdate }) => {
  const { user } = useAuth();
  const [likeLoading, setLikeLoading] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleLike = async () => {
    if (!user) return;

    setLikeLoading(true);
    try {
      await photosAPI.likePhoto(photo._id);
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error('Error liking photo:', error);
    } finally {
      setLikeLoading(false);
    }
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = photo.imageUrl;
    link.download = `college-memory-${photo._id}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const isLiked = user && photo.likes.includes(user._id);

  return (
    <Card className="overflow-hidden hover:shadow-[0_8px_30px_rgba(205,186,226,0.15)] transition-shadow border border-twilight-border backdrop-blur-md bg-opacity-[0.15]">
      <div className="relative">
        {/* Photo */}
        <div className="aspect-square overflow-hidden bg-[rgba(23,21,45,0.7)]">
          {!imageLoaded && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-twilight-lavender text-twilight-primary"></div>
            </div>
          )}
          <img
            src={photo.imageUrl}
            alt={photo.title || 'College memory'}
            className={`w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform duration-500 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={() => setImageLoaded(true)}
            onClick={() => window.open(photo.imageUrl, '_blank')}
          />
        </div>

        {/* Overlay with actions */}
        <div className="absolute top-2 right-2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity md:opacity-100">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDownload();
            }}
            className="p-2 bg-twilight-bg bg-opacity-70 text-white rounded-full hover:bg-opacity-90 transition-all shadow-[0_4px_10px_rgba(0,0,0,0.5)] border border-[rgba(255,255,255,0.1)]"
            title="Download photo"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </button>
        </div>
      </div>

      <CardContent className="p-5">
        {/* Title and Description */}
        {photo.title && (
          <CardTitle className="text-xl mb-2 text-twilight-lavender">{photo.title}</CardTitle>
        )}
        {photo.description && (
          <p className="text-twilight-text-muted text-[15px] leading-relaxed mb-4">{photo.description}</p>
        )}

        {/* Tags */}
        {photo.tags && photo.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {photo.tags.map((tag, index) => (
              <span
                key={index}
                className="px-2.5 py-1 bg-[rgba(161,150,206,0.1)] border border-[rgba(161,150,206,0.2)] text-twilight-lavender text-[11px] font-medium rounded-full uppercase tracking-wider"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Album */}
        {photo.album && photo.album !== 'general' && (
          <div className="mb-4">
            <span className="inline-block px-3 py-1 bg-[rgba(255,255,255,0.05)] border border-twilight-border text-twilight-text-muted text-xs font-semibold rounded-full tracking-wide">
              {photo.album}
            </span>
          </div>
        )}

        {/* Author and Date */}
        <div className="flex items-center justify-between text-xs font-medium text-twilight-text-muted">
          <span className="flex items-center space-x-1.5 text-twilight-primary">
            <span>By {photo.uploadedBy.name}</span>
          </span>
          <span className="opacity-80">{formatDate(photo.createdAt)}</span>
        </div>
      </CardContent>

      <CardFooter className="p-5 pt-0 border-t-0 flex flex-col pt-3 border-t border-[rgba(255,255,255,0.05)]">
        <div className="flex items-center justify-between w-full mt-2">
          {/* Like Button */}
          <Button
            variant="outline"
            size="small"
            onClick={handleLike}
            disabled={!user || likeLoading}
            className={`flex items-center space-x-2 border-transparent bg-[rgba(255,255,255,0.03)] hover:bg-[rgba(255,255,255,0.08)] ${
              isLiked ? 'text-pink-400 bg-pink-400/10 hover:bg-pink-400/20' : 'text-twilight-lavender'
            }`}
          >
            <svg className="w-4 h-4" fill={isLiked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={isLiked ? 2 : 1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            <span className="font-semibold">{photo.likes.length}</span>
          </Button>

          {/* Memory Link */}
          {photo.memory && (
            <Button
              variant="secondary"
              size="small"
              onClick={() => window.location.href = `/memories/${photo.memory}`}
              className="text-xs px-3 py-1.5"
            >
              Related Echo
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

export default PhotoFrame;

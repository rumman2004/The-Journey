import { useState } from 'react';
import { formatDate, getRelativeTime } from '../../utils/helpers';
import { useAuth } from '../../hooks/useAuth';
import { memoriesAPI } from '../../services/api';

const MessageFrame = ({ memory, onUpdate }) => {
  const { user } = useAuth();
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [commentLoading, setCommentLoading] = useState(false);
  const [likeLoading, setLikeLoading] = useState(false);

  const handleLike = async () => {
    if (!user) return;

    setLikeLoading(true);
    try {
      await memoriesAPI.likeMemory(memory._id);
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error('Error liking memory:', error);
    } finally {
      setLikeLoading(false);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || !user) return;

    setCommentLoading(true);
    try {
      await memoriesAPI.addComment(memory._id, newComment.trim());
      setNewComment('');
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error('Error adding comment:', error);
    } finally {
      setCommentLoading(false);
    }
  };

  const isLiked = user && memory.likes.includes(user._id);

  return (
    <div className="flex flex-col w-full h-full">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <img
            src={memory.author.profilePicture || '/default-avatar.png'}
            alt={memory.author.name}
            className="w-10 h-10 rounded-full object-cover border border-gray-300 shadow-sm"
          />
          <div>
            <h3 className="text-xl font-bold text-gray-900 leading-none">{memory.title}</h3>
            <p className="text-xs text-gray-500 mt-1 font-medium">
              By {memory.author.name} <span className="px-1 text-gray-400">•</span> {formatDate(memory.memoryDate)}
            </p>
          </div>
        </div>
        <span className="px-2.5 py-0.5 text-[0.7rem] uppercase tracking-wider font-bold rounded-sm bg-black/5 text-gray-600 border border-black/10">
          {memory.category}
        </span>
      </div>

      {/* Content */}
      <div className="flex-1">
        <p className="text-gray-800 text-lg whitespace-pre-wrap leading-relaxed mb-4">
          {memory.content}
        </p>

        {/* Photos / Media */}
        {memory.photos && memory.photos.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-4">
            {memory.photos.map((photo, index) => {
              const isVideo = photo.match(/\.(mp4|webm|ogg)$/i);
              return isVideo ? (
                <video
                  key={index}
                  src={photo}
                  controls
                  className="w-full h-32 object-cover rounded-md border border-gray-300 shadow-sm"
                />
              ) : (
                <img
                  key={index}
                  src={photo}
                  alt={`Memory photo ${index + 1}`}
                  className="w-full h-32 object-cover rounded-md border border-gray-300 shadow-sm cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={() => window.open(photo, '_blank')}
                />
              );
            })}
          </div>
        )}

        {/* Tags */}
        {memory.tags && memory.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-2">
            {memory.tags.map((tag, index) => (
              <span
                key={index}
                className="px-2 py-0.5 bg-black/5 text-gray-600 border border-black/5 text-xs rounded-sm font-medium"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Footer / Actions */}
      <div className="mt-4 pt-3 border-t border-gray-300/60">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center space-x-2">
            {/* Like Button */}
            <button
              onClick={handleLike}
              disabled={!user || likeLoading}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-sm font-bold transition-colors disabled:opacity-50 ${
                isLiked ? 'text-pink-600 bg-pink-100/50 hover:bg-pink-100' : 'text-gray-600 hover:text-gray-900 hover:bg-black/5'
              }`}
            >
              <svg className="w-4 h-4" fill={isLiked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={isLiked ? 2 : 1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <span>{memory.likes.length}</span>
            </button>

            {/* Comments Button */}
            <button
              onClick={() => setShowComments(!showComments)}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-sm font-bold text-gray-600 hover:text-gray-900 hover:bg-black/5 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <span>{memory.comments.length}</span>
            </button>
          </div>

          <span className="text-xs text-gray-400 font-medium whitespace-nowrap">
            {getRelativeTime(memory.createdAt)}
          </span>
        </div>

        {/* Comments Section */}
        {showComments && (
          <div className="mt-4 pt-3 border-t border-gray-300/60 transition-opacity">
            {/* Existing Comments */}
            {memory.comments.map((comment, index) => (
              <div key={index} className="mb-3 pb-3 border-b border-gray-200/50 last:border-b-0 last:pb-0 last:mb-0">
                <div className="flex items-start space-x-2.5">
                  <img
                    src={comment.user.profilePicture || '/default-avatar.png'}
                    alt={comment.user.name}
                    className="w-7 h-7 rounded-full object-cover border border-gray-300 mt-0.5"
                  />
                  <div className="flex-1 overflow-hidden">
                    <p className="text-[14px] leading-snug">
                      <span className="font-bold text-gray-800 mr-2">{comment.user.name}</span>
                      <span className="text-gray-700">{comment.content}</span>
                    </p>
                    <p className="text-[10px] text-gray-400 mt-1 font-medium">
                      {getRelativeTime(comment.createdAt)}
                    </p>
                  </div>
                </div>
              </div>
            ))}

            {/* Add Comment Form */}
            {user ? (
              <form onSubmit={handleAddComment} className="mt-3 relative">
                <div className="flex items-center border border-gray-300 rounded-md overflow-hidden bg-white/40 focus-within:border-gray-500 focus-within:ring-1 focus-within:ring-gray-300 transition-all">
                  <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Scribble a comment..."
                    className="flex-1 bg-transparent border-none outline-none text-gray-800 placeholder-gray-500 font-sans px-3 py-2 text-sm"
                    maxLength={500}
                  />
                  <button
                    type="submit"
                    disabled={!newComment.trim() || commentLoading}
                    className="px-4 py-2 bg-gray-200/50 text-gray-700 text-sm font-bold border-l border-gray-300 hover:bg-gray-200 disabled:opacity-50 transition-colors"
                  >
                    Post
                  </button>
                </div>
              </form>
            ) : (
               <div className="mt-3 text-center">
                 <p className="text-xs text-gray-500 italic">Sign in to leave a comment.</p>
               </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageFrame;

import { useState } from "react";
import { updateComment } from "../../apis/api";

const CommentElement = ({ comment, handleCommentDelete, postId, user }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);

  // 댓글 수정 (PUT API)
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    await updateComment(comment.id, {
      post: postId,
      content: editContent,
    });
    setIsEditing(false);
  };

  // 작성자 정보를 객체로 주든, 숫자로 주든 커버
  const authorName = comment.author.username
    ? comment.author.username
    : `User ${comment.author}`;

  const authorId = comment.author.id ? comment.author.id : comment.author;

  return (
    <div className="flex flex-col w-full p-4 border-b border-gray-300">
      <div className="flex flex-row justify-between items-center mb-2">
        <span className="font-bold text-lg">{authorName}</span>
        <span className="text-sm text-gray-500">
          {comment.created_at.slice(0, 10)}
        </span>
      </div>

      {isEditing ? (
        // 수정 모드일 때 보여질 폼
        <form className="flex flex-row gap-3 mt-2" onSubmit={handleEditSubmit}>
          <input
            type="text"
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            className="input grow"
          />
          <button type="submit" className="small-button">
            완료
          </button>
          <button
            type="button"
            onClick={() => setIsEditing(false)}
            className="small-button bg-gray-500"
          >
            취소
          </button>
        </form>
      ) : (
        // 일반 모드일 때 보여질 텍스트 및 버튼
        <div className="flex flex-row justify-between items-center">
          <p className="text-base">{comment.content}</p>

          {/* 로그인한 유저 id와 댓글 작성자의 id가 같을 때만 버튼 노출 */}
          {user?.id === authorId && (
            <div className="flex gap-2">
              <button
                onClick={() => setIsEditing(true)}
                className="small-button"
              >
                수정
              </button>
              <button
                onClick={() => handleCommentDelete(comment.id)}
                className="small-button"
              >
                삭제
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CommentElement;

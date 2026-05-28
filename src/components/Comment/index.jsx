import { useEffect, useState } from "react";
import {
  getComments,
  createComment,
  updateComment,
  deleteComment,
  getUser,
} from "../../apis/api";
import { getCookie } from "../../utils/cookie";

const CommentElement = ({ comment, user }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);

  const isAuthor = user?.id === comment?.author?.id;

  const authorName = comment?.author?.username
    ? comment.author.username
    : "익명";

  const handleEditComment = async (e) => {
    e.preventDefault();

    if (!editContent.trim()) {
      alert("댓글 내용을 입력해주세요.");
      return;
    }

    await updateComment(comment.id, {
      content: editContent,
    });
  };

  const handleDeleteComment = async () => {
    const isConfirmed = window.confirm("정말 댓글을 삭제하시겠습니까?");

    if (!isConfirmed) return;

    await deleteComment(comment.id);
  };

  return (
    <div className="flex flex-col w-full border border-gray-500 rounded-2xl p-4 my-3">
      <div className="flex justify-between items-center mb-2">
        <div className="font-bold text-orange-400">{authorName}</div>

        {comment.created_at ? (
          <div className="text-sm text-gray-400">
            {new Date(comment.created_at).toLocaleString()}
          </div>
        ) : null}
      </div>

      {isEditing ? (
        <form onSubmit={handleEditComment} className="flex flex-col gap-3">
          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            className="input"
            rows="3"
            required
          ></textarea>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              className="small-button"
              onClick={() => setIsEditing(false)}
            >
              취소
            </button>
            <button type="submit" className="small-button">
              저장
            </button>
          </div>
        </form>
      ) : (
        <>
          <p className="text-white whitespace-pre-wrap">{comment.content}</p>

          {isAuthor ? (
            <div className="flex justify-end gap-2 mt-3">
              <button
                type="button"
                className="small-button"
                onClick={() => setIsEditing(true)}
              >
                수정
              </button>
              <button
                type="button"
                className="small-button"
                onClick={handleDeleteComment}
              >
                삭제
              </button>
            </div>
          ) : null}
        </>
      )}
    </div>
  );
};

const Comment = ({ postId }) => {
  const [comments, setComments] = useState([]);
  const [content, setContent] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    const getCommentsAPI = async () => {
      const comments = await getComments(postId);
      setComments(comments);
    };

    getCommentsAPI();
  }, [postId]);

  useEffect(() => {
    if (getCookie("access_token")) {
      const getUserAPI = async () => {
        const user = await getUser();
        setUser(user);
      };

      getUserAPI();
    }
  }, []);

  const handleCreateComment = async (e) => {
    e.preventDefault();

    if (!content.trim()) {
      alert("댓글 내용을 입력해주세요.");
      return;
    }

    await createComment(postId, content.trim());
  };

  return (
    <div className="flex flex-col w-full mt-10">
      <h3 className="font-bold text-2xl mb-5">댓글</h3>

      {getCookie("access_token") ? (
        <form
          onSubmit={handleCreateComment}
          className="flex flex-col w-full gap-3"
        >
          <textarea
            placeholder="댓글을 입력하세요"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="input"
            rows="4"
            required
          ></textarea>

          <button type="submit" className="button self-end">
            댓글 작성
          </button>
        </form>
      ) : (
        <div className="text-gray-400 mb-5">
          로그인 후 댓글을 작성할 수 있습니다.
        </div>
      )}

      <div className="flex flex-col w-full mt-5">
        {comments.length > 0 ? (
          comments.map((comment) => (
            <CommentElement key={comment.id} comment={comment} user={user} />
          ))
        ) : (
          <div className="text-gray-400">아직 댓글이 없습니다.</div>
        )}
      </div>
    </div>
  );
};

export default Comment;
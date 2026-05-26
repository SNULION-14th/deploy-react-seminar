import { useEffect, useState } from "react";
import CommentElement from "./CommentElement";
import {
  getComments,
  createComment,
  updateComment,
  deleteComment,
} from "../../apis/api";

const Comment = ({ postId, user }) => {
  const [commentList, setCommentList] = useState([]); // state for comments
  const [newContent, setNewContent] = useState(""); // state for new comment

  useEffect(() => {
    const getCommentsAPI = async () => {
      const comments = await getComments(postId);
      setCommentList(comments);
    };
    getCommentsAPI();
  }, [postId]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();

    if (!newContent.trim()) {
      alert("댓글 내용을 입력해주세요");
      return;
    }
    await createComment({ post: postId, content: newContent });
  };

  const handleCommentUpdate = async (commentId, content) => {
    if (!content.trim()) {
      alert("댓글 내용을 입력해주세요");
      return;
    }

    await updateComment(commentId, { post: postId, content });
  };

  const handleCommentDelete = async (commentId) => {
    const confirmDelete = window.confirm("정말 삭제하시겠습니까?");
    if (!confirmDelete) return;

    try {
      await deleteComment(commentId);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="w-full mt-5 self-start">
      <h1 className="text-3xl font-bold my-5">Comments</h1>
      {commentList.map((comment) => (
        <CommentElement
          key={comment.id}
          comment={comment}
          user={user}
          postId={postId}
          handleCommentDelete={handleCommentDelete}
          handleCommentUpdate={handleCommentUpdate}
        />
      ))}

      <form
        className="flex flex-row mt-10 gap-3"
        onSubmit={handleCommentSubmit}
      >
        <input
          type="text"
          value={newContent}
          placeholder="댓글을 입력해주세요"
          className="input"
          style={{ width: "calc(100% - 100px)" }}
          onChange={(e) => setNewContent(e.target.value)}
        />
        <button type="submit" className="button">
          작성
        </button>
      </form>
    </div>
  );
};

export default Comment;

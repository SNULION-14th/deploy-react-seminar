import { useState, useEffect } from "react";
import CommentElement from "./CommentElement";
import { getComments, createComment, deleteComment } from "../../apis/api";

const Comment = ({ postId }) => {
  const [commentList, setCommentList] = useState([]);
  const [newContent, setNewContent] = useState("");

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const comments = await getComments(postId);
        setCommentList(comments);
      } catch (error) {
        console.error("댓글 불러오기 실패:", error);
      }
    };

    if (postId) {
      fetchComments();
    }
  }, [postId]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();

    if (!newContent.trim()) {
      alert("댓글을 입력해주세요.");
      return;
    }

    await createComment({
      post: postId,
      content: newContent,
    });

    setNewContent("");
  };

  const handleCommentDelete = async (commentId) => {
    await deleteComment(commentId);
  };

  return (
    <div className="w-full mt-5 self-start">
      <h1 className="text-3xl font-bold my-5">Comments</h1>

      {commentList.map((comment) => {
        return (
          <CommentElement
            key={comment.id}
            comment={comment}
            handleCommentDelete={handleCommentDelete}
            postId={postId}
          />
        );
      })}

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

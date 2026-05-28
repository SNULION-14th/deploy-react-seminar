import { useEffect, useState } from "react";
//import comments from "../../data/comments"; // dummy data
import CommentElement from "./CommentElement";
import { createComment, deleteComment, getComments } from "../../apis/api";

const Comment = ({ postId, commentList, setCommentList, user }) => {
  const [newContent, setNewContent] = useState(""); // state for new comment

  useEffect(() => {
    const fetchComments = async () => {
      const data = await getComments(postId);
      setCommentList(data);
    };

    fetchComments();
  }, [postId]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();

    if (!newContent.trim()) {
      alert("댓글을 입력해주세요.");
      return;
    }

    try {
      await createComment({
        post: Number(postId),
        content: newContent,
      });

      setNewContent("");
    } catch (error) {
      console.log("댓글 작성 실패");
    }
  };

  const handleCommentDelete = async (commentId) => {
    const isConfirmed = window.confirm("정말 댓글을 삭제하시겠습니까?");

    if (!isConfirmed) return;
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
            user={user}
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

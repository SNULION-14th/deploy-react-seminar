import { useState, useEffect } from "react";
import { getComments, createComment } from "../../apis/api";
import CommentElement from "./CommentElement";

const Comment = ({ postId, user }) => {
  const [commentList, setCommentList] = useState([]);
  const [newContent, setNewContent] = useState("");

  useEffect(() => {
    const getCommentsAPI = async () => {
      try {
        const comments = await getComments(postId);
        setCommentList(comments);
      } catch (error) {
        console.error("댓글 불러오기 실패:", error.response?.data || error);
      }
    };

    if (postId) {
      getCommentsAPI();
    }
  }, [postId]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();

    if (!newContent.trim()) {
      alert("댓글을 입력해주세요.");
      return;
    }

    const newComment = {
      post: Number(postId),
      content: newContent,
    };

    try {
      await createComment(newComment);
      setNewContent("");
    } catch (error) {
      console.error("댓글 작성 실패:", error.response?.data || error);
      alert(JSON.stringify(error.response?.data));
    }
  };

  return (
    <div className="w-full mt-5 self-start">
      <h1 className="text-3xl font-bold my-5">Comments</h1>

      {commentList.map((comment) => {
        return (
          <CommentElement
            key={comment.id}
            comment={comment}
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

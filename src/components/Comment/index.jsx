import { useState, useEffect } from "react";
import CommentElement from "./CommentElement";
import {
  getComments,
  createComment,
  deleteComment,
  getUser,
} from "../../apis/api";

const Comment = ({ postId }) => {
  const [commentList, setCommentList] = useState([]);
  const [newContent, setNewContent] = useState("");
  const [user, setUser] = useState(null);

  const fetchComments = async () => {
    try {
      const data = await getComments(postId);
      setCommentList(data);
    } catch (error) {
      console.error("댓글 불러오기 실패:", error);
    }
  };

  const fetchUser = async () => {
    try {
      const data = await getUser();
      setUser(data);
    } catch (error) {
      console.error("유저 정보 불러오기 실패:", error);
    }
  };

  useEffect(() => {
    fetchComments();
    fetchUser();
  }, [postId]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();

    if (!newContent.trim()) {
      alert("댓글을 입력해주세요.");
      return;
    }

    try {
      await createComment({
        post: postId,
        content: newContent,
      });

      setNewContent("");
    } catch (error) {
      console.error("댓글 생성 실패:", error);
      console.log("서버 응답:", error.response?.data);
      console.log("보낸 데이터:", {
        post: postId,
        content: newContent,
      });
      alert("댓글 생성에 실패했습니다.");
    }
  };

  const handleCommentDelete = async (commentId) => {
    const result = window.confirm("정말 댓글을 삭제하시겠습니까?");

    if (!result) return;

    try {
      await deleteComment(commentId);
    } catch (error) {
      console.error("댓글 삭제 실패:", error);
      alert("댓글 삭제에 실패했습니다.");
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

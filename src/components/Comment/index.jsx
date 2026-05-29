import { useState, useEffect } from "react";
import CommentElement from "./CommentElement";
import { getComments, createComment, getUser } from "../../apis/api";
import { getCookie } from "../../utils/cookie";

const Comment = ({ postId }) => {
  const [commentList, setCommentList] = useState([]);
  const [newContent, setNewContent] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    const getCommentsAPI = async () => {
      const comments = await getComments(postId);
      setCommentList(comments);
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
      console.error(error);
      alert("댓글 작성에 실패했습니다.");
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

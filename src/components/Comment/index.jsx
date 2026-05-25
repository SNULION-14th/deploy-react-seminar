import { useEffect, useState } from "react";
import CommentElement from "./CommentElement";
import { getComments, createComment } from "../../apis/api";

const Comment = ({ postId }) => {
  const [commentList, setCommentList] = useState([]); // state for comments
  const [newContent, setNewContent] = useState(""); // state for new comment

  useEffect(() => {
    const getCommentsAPI = async () => {
      try {
        const comments = await getComments(postId);
        setCommentList(comments);
      } catch (error) {
        console.error("댓글을 불러오는 중 에러 발생:", error);
      }
    };
    if (postId) {
      getCommentsAPI();
    }
  }, [postId]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newContent.trim()) return;

    const commentData = {
      content: newContent,
      post: postId,
    };

    try {
      await createComment(commentData);
      setNewContent("");
    } catch (error) {
      console.error("댓글 등록 실패:", error);
    }
  };

  const handleCommentDelete = (commentId) => {
    console.log("comment id to delete: ", commentId);
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

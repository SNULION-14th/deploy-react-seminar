import { useState, useEffect } from "react";
import { getComments, createComment, deleteComment } from "../../apis/api";
import CommentElement from "./CommentElement";

const Comment = ({ postId, currentUser }) => {
  const [commentList, setCommentList] = useState([]); // state for comments
  const [newContent, setNewContent] = useState(""); // state for new comment

  useEffect(() => {
    getComments(postId).then((data) => setCommentList(data));
  }, [postId]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    await createComment({ post: postId, content: newContent }); // TODO: add api call for creating comment
    setNewContent("");
  };

  const handleCommentDelete = async (commentId) => {
    await deleteComment(commentId); // TODO: add api call for deleting comment
    fetchComments();
  };

  const fetchComments = async () => {
    const data = await getComments(postId);
    setCommentList(data);
  };

  useEffect(() => {
    fetchComments();
  }, [postId]);

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
            currentUser={currentUser}
            fetchComments={fetchComments}
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

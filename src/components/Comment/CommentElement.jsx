import { useState } from "react";
import { updateComment, deleteComment } from "../../apis/api";

const CommentElement = (props) => {
  const { comment, postId, user } = props;

  const [content, setContent] = useState(comment.content);
  const [isEdit, setIsEdit] = useState(false);
  const [onChangeValue, setOnChangeValue] = useState(comment.content);

  const date = new Date(comment.created_at);
  const year = date.getFullYear();

  let month = date.getMonth() + 1;
  month = month < 10 ? `0${month}` : month;

  let day = date.getDate();
  day = day < 10 ? `0${day}` : day;

  const commentAuthorId =
    typeof comment.author === "object" ? comment.author.id : comment.author;

  const isMyComment = user?.id === commentAuthorId;

  const handleEditComment = async () => {
    if (!onChangeValue.trim()) {
      alert("댓글 내용을 입력해주세요.");
      return;
    }

    const editedComment = {
      post: postId,
      content: onChangeValue,
    };

    try {
      await updateComment(comment.id, editedComment);
      setContent(onChangeValue);
      setIsEdit(false);
    } catch (error) {
      console.error("댓글 수정 실패:", error.response?.data || error);
      alert(JSON.stringify(error.response?.data));
    }
  };

  const handleDeleteComment = async () => {
    try {
      await deleteComment(comment.id);
    } catch (error) {
      console.error("댓글 삭제 실패:", error.response?.data || error);
      alert("댓글 삭제에 실패했습니다.");
    }
  };

  return (
    <div className="w-full flex flex-row justify-between items-center mb-5">
      <div className="w-3/4 flex flex-col gap-1">
        {isEdit ? (
          <input
            className="input mb-2"
            value={onChangeValue}
            onChange={(e) => setOnChangeValue(e.target.value)}
          />
        ) : (
          <p className="text-lg">{content}</p>
        )}

        <span className="text-base text-gray-300">
          {year}.{month}.{day}
        </span>
      </div>

      {isMyComment ? (
        <div className="flex flex-row items-center gap-3">
          {isEdit ? (
            <>
              <button
                onClick={() => {
                  setIsEdit(false);
                  setOnChangeValue(content);
                }}
              >
                취소
              </button>

              <button onClick={handleEditComment}>완료</button>
            </>
          ) : (
            <>
              <button onClick={handleDeleteComment}>삭제</button>
              <button onClick={() => setIsEdit(true)}>수정</button>
            </>
          )}
        </div>
      ) : null}
    </div>
  );
};

export default CommentElement;

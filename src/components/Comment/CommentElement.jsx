import { useState } from "react";
import { updateComment, deleteComment } from "../../apis/api";

const CommentElement = (props) => {
  const { comment, postId, user } = props;

  const [content, setContent] = useState(comment.content);
  const [isEdit, setIsEdit] = useState(false);
  const [onChangeValue, setOnChangeValue] = useState(content);

  const date = new Date(comment.created_at);
  const year = date.getFullYear();
  let month = date.getMonth() + 1;
  month = month < 10 ? `0${month}` : month;
  let day = date.getDate();
  day = day < 10 ? `0${day}` : day;

  const isAuthor = user?.id === comment.author;

  const handleEditComment = async () => {
    if (!onChangeValue.trim()) {
      alert("댓글 내용을 입력해주세요.");
      return;
    }

    try {
      await updateComment(comment.id, {
        post: postId,
        content: onChangeValue,
      });

      setContent(onChangeValue);
      setIsEdit(false);
    } catch (error) {
      console.error(error);
      alert("댓글 수정에 실패했습니다.");
    }
  };

  const handleDeleteComment = async () => {
    const confirmDelete = window.confirm("정말 댓글을 삭제하시겠습니까?");

    if (!confirmDelete) return;

    try {
      await deleteComment(comment.id);
    } catch (error) {
      console.error(error);
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

      {isAuthor ? (
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

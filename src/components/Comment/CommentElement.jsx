import { useState, useEffect } from "react";
import { updateComment, deleteComment } from "../../apis/api";

const CommentElement = (props) => {
  const { comment, handleCommentDelete, postId, currentUser, fetchComments } =
    props;
  const [content, setContent] = useState(comment.content);
  const [isEdit, setIsEdit] = useState(false);
  const [onChangeValue, setOnChangeValue] = useState(content); // 수정 취소 시 직전 content 값으로 변경을 위한 state
  const [isAuthor, setIsAuthor] = useState(false);

  // comment created_at 전처리
  const date = new Date(comment.created_at);
  const year = date.getFullYear();
  let month = date.getMonth() + 1;
  month = month < 10 ? `0${month}` : month;
  let day = date.getDate();
  day = day < 10 ? `0${day}` : day;

  const handleEditComment = async () => {
    // add api call for editing comment
    await updateComment(comment.id, { content: onChangeValue });
    setContent(onChangeValue);
    setIsEdit(!isEdit);
    fetchComments();
  };

  useEffect(() => {
    console.log("currentUser:", currentUser);
    console.log("comment.author:", comment.author);
    // add api call to check if user is the author of the comment
    if (currentUser && currentUser.id === comment.author) {
      setIsAuthor(true);
    }
  }, [currentUser, comment.author.id]);

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
      <div className="flex flex-row items-center gap-3">
        {isAuthor &&
          (isEdit ? (
            <>
              <button
                onClick={() => {
                  setIsEdit(!isEdit);
                  setOnChangeValue(content);
                }}
              >
                취소
              </button>
              <button onClick={handleEditComment}>완료</button>
            </>
          ) : (
            <>
              <button onClick={() => handleCommentDelete(comment.id)}>
                삭제
              </button>
              <button onClick={() => setIsEdit(!isEdit)}>수정</button>
            </>
          ))}
      </div>
    </div>
  );
};

export default CommentElement;

import { useState, useEffect } from "react";
import { updateComment, getUser } from "../../apis/api";
import { getCookie } from "../../utils/cookie";

const CommentElement = (props) => {
  const { comment, handleCommentDelete, postId } = props;
  const [content, setContent] = useState(comment.content);
  const [isEdit, setIsEdit] = useState(false);
  const [onChangeValue, setOnChangeValue] = useState(content); // 수정 취소 시 직전 content 값으로 변경을 위한 state
  const [user, setUser] = useState();

  // comment created_at 전처리
  const date = new Date(comment.created_at);
  const year = date.getFullYear();
  let month = date.getMonth() + 1;
  month = month < 10 ? `0${month}` : month;
  let day = date.getDate();
  day = day < 10 ? `0${day}` : day;

  const handleEditComment = () => {
    // add api call for editing comment
    setIsEdit(!isEdit);
    setContent(onChangeValue);
    updateComment(comment.id, {
      content: onChangeValue,
    });
  };

  useEffect(() => {
    // add api call to check if user is the author of the comment
    if (getCookie("access_token")) {
      const getUserAPI = async () => {
        const user = await getUser();
        setUser(user);
      };
      getUserAPI();
    }
  }, []);

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
        {isEdit ? (
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
        ) : user?.id === comment?.author.id ? (
          <>
            <button onClick={() => handleCommentDelete(comment.id)}>
              삭제
            </button>
            <button onClick={() => setIsEdit(!isEdit)}>수정</button>
          </>
        ) : null}
      </div>
    </div>
  );
};
export default CommentElement;

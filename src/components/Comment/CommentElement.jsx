import { useState, useEffect } from "react";
import { updateComment, getUser } from "../../apis/api";

const CommentElement = (props) => {
  const { comment, handleCommentDelete, postId } = props;

  const [content, setContent] = useState(comment.content);
  const [isEdit, setIsEdit] = useState(false);
  const [isAuthor, setIsAuthor] = useState(false);
  const [onChangeValue, setOnChangeValue] = useState(content);

  const date = new Date(comment.created_at);
  const year = date.getFullYear();
  let month = date.getMonth() + 1;
  month = month < 10 ? `0${month}` : month;
  let day = date.getDate();
  day = day < 10 ? `0${day}` : day;

  const handleEditComment = async () => {
    if (!onChangeValue.trim()) {
      alert("댓글 내용을 입력해주세요.");
      return;
    }

    await updateComment(comment.id, {
      content: onChangeValue,
    });

    setContent(onChangeValue);
    setIsEdit(false);
  };

  useEffect(() => {
    const checkIsAuthor = async () => {
      try {
        const user = await getUser();

        if (user.id === comment.author?.id || user.id === comment.author) {
          setIsAuthor(true);
        } else {
          setIsAuthor(false);
        }
      } catch (error) {
        setIsAuthor(false);
      }
    };

    checkIsAuthor();
  }, [comment]);

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
            {isAuthor && (
              <>
                <button onClick={() => handleCommentDelete(comment.id)}>
                  삭제
                </button>
                <button onClick={() => setIsEdit(true)}>수정</button>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default CommentElement;

import { useState, useEffect } from "react";
import { updateComment, deleteComment, getUser } from "../../apis/api";
import { getCookie } from "../../utils/cookie";

const CommentElement = (props) => {
  const { comment, handleCommentDelete, postId } = props;
  const [content, setContent] = useState(comment.content);
  const [isEdit, setIsEdit] = useState(false);

  const [onChangeValue, setOnChangeValue] = useState(content); // 수정 취소 시 직전 content 값으로 변경을 위한 state

  const [currentUser, setCurrentUser] = useState(null);

  // comment created_at 전처리
  const date = new Date(comment.created_at);
  const year = date.getFullYear();
  let month = date.getMonth() + 1;
  month = month < 10 ? `0${month}` : month;
  let day = date.getDate();
  day = day < 10 ? `0${day}` : day;

  const handleEditComment = async () => {
    if (!onChangeValue.trim()) return;

    try {
      // apis/api.js의 updateComment 규격에 맞춰 수정 데이터 전송
      await updateComment(comment.id, { content: onChangeValue });
      setContent(onChangeValue);
      setIsEdit(false);
      console.log({
        post: postId,
        comment: comment.id,
        content: onChangeValue,
      });
    } catch (error) {
      console.error("댓글 수정 중 에러가 발생했습니다:", error);
    }
  };

  const handleLocalDelete = async () => {
    // window.confirm() 방어 장치 활성화 명세 적용
    const confirmDelete = window.confirm("정말 이 댓글을 삭제하시겠습니까?");
    if (!confirmDelete) return;

    try {
      // 부모의 기존 추적 로직 작동 유지를 위한 트리거 호출
      handleCommentDelete(comment.id);
      // 실질적인 백엔드 파괴 및 자동 새로고침(reload) 연동
      await deleteComment(comment.id);
    } catch (error) {
      console.error("댓글 삭제 중 에러가 발생했습니다:", error);
    }
  };

  useEffect(() => {
    if (getCookie("access_token")) {
      const fetchUser = async () => {
        try {
          const userData = await getUser();
          setCurrentUser(userData);
        } catch (error) {
          console.error("유저 정보를 로드할 수 없습니다:", error);
        }
      };
      fetchUser();
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
        ) : (
          <>
            {currentUser?.id === comment?.author && (
              <>
                <button onClick={handleLocalDelete}>삭제</button>
                <button onClick={() => setIsEdit(!isEdit)}>수정</button>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};
export default CommentElement;

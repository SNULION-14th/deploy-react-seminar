import { useState, useEffect } from "react";
import {
  getComments,
  createComment,
  deleteComment,
  getUser,
} from "../../apis/api";
import { getCookie } from "../../utils/cookie";
import CommentElement from "./CommentElement";

const Comment = ({ postId }) => {
  // 백엔드에서 받아온 댓글 목록을 저장할 상태 정의 (초기값은 빈 배열)
  const [commentList, setCommentList] = useState([]);
  const [newContent, setNewContent] = useState(""); // 작성할 댓글 상태 추가
  const [user, setUser] = useState(null); // 현재 로그인한 유저 정보 상태

  // 현재 로그인한 유저 정보 가져오기 (쿠키에 토큰이 있을 때만)
  useEffect(() => {
    if (getCookie("access_token")) {
      const fetchUser = async () => {
        const userData = await getUser();
        setUser(userData);
      };
      fetchUser();
    }
  }, []);

  // 해당 포스트의 댓글 목록 가져오기
  useEffect(() => {
    const getCommentsAPI = async () => {
      const data = await getComments(postId);
      setCommentList(data);
    };
    getCommentsAPI();
  }, [postId]);

  // 댓글 작성 (POST API)
  const handleCommentSubmit = async (e) => {
    e.preventDefault();

    // 💡 1. 버튼이 눌렸는지, 그리고 입력값이 잘 들어오는지 콘솔에 출력합니다.
    console.log("버튼 클릭됨! 현재 입력값:", newContent);

    if (!newContent.trim()) {
      // 💡 2. 만약 여기서 걸렸다면 입력값이 제대로 업데이트되지 않고 있다는 뜻입니다!
      console.log("입력값이 비어있다고 판단되어 함수가 종료되었습니다.");
      return;
    }

    try {
      console.log("API 요청 시작!");
      // 1. 백엔드에 댓글 생성 요청
      await createComment({
        post: parseInt(postId),
        content: newContent,
      });

      // 2. 성공 시 입력창 비우기
      setNewContent("");

      // 3. 댓글 목록 즉시 업데이트
      const data = await getComments(postId);
      setCommentList(data);
    } catch (error) {
      console.error("댓글 작성 에러: ", error);
      if (error.response) {
        alert(`작성 실패: ${JSON.stringify(error.response.data)}`);
      } else {
        alert("댓글 작성 중 에러가 발생했습니다.");
      }
    }
  };

  // 댓글 삭제 (DELETE API)
  const handleCommentDelete = async (commentId) => {
    const confirmDelete = window.confirm("정말 삭제하시겠습니까?");
    if (!confirmDelete) return;

    try {
      await deleteComment(commentId);
    } catch (error) {
      console.error(error);
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
            user={user} // 권한 확인을 위해 user 정보 전달
          />
        );
      })}

      {getCookie("access_token") ? (
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
      ) : (
        <div className="mt-10 p-5 bg-gray-100 text-center rounded-xl text-gray-500 font-medium">
          댓글을 작성하려면 로그인이 필요합니다.
        </div>
      )}
    </div>
  );
};

export default Comment;

import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { BigPost } from "../components/Posts";
import Comment from "../components/Comment";
import { getCookie } from "../utils/cookie";
import { getPost, getUser, deletePost } from "../apis/api";

const PostDetailPage = () => {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [user, setUser] = useState();

  useEffect(() => {
    const getPostAPI = async () => {
      const post = await getPost(postId);
      setPost(post);
    };
    getPostAPI();
  }, [postId]);
  // 작성했던 getPost()를 호출한 후, setPostList를 통해 postList에 저장

  useEffect(() => {
    // access_token이 있으면 유저 정보 가져옴
    if (getCookie("access_token")) {
      const getUserAPI = async () => {
        const user = await getUser();
        setUser(user);
        // console.log(user);
      };
      getUserAPI();
    }
  }, []);
  // 처음 한번만

  const navigate = useNavigate();
  const onClickDelete = async () => {
    const confirmDelete = window.confirm("정말 삭제하시겠습니까?");
    if (!confirmDelete) return;
    try {
      await deletePost(postId, navigate);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    post && (
      <div className="flex flex-col items-center w-[60%] p-8">
        <BigPost post={post} />

        <Comment postId={postId} />
        <div className="flex flex-row gap-3">
          {user?.id === post?.author.id ? (
            <>
              <Link to={`/${post.id}/edit`}>
                <button className="button mt-10 py-2 px-10">수정</button>
              </Link>
              <button
                className="button mt-10 py-2 px-10"
                onClick={onClickDelete}
              >
                삭제
              </button>
            </>
          ) : null}
          {/* user와 post.author가 동일하면 버튼을 리턴, 아니면 null */}
        </div>
      </div>
    )
  );
};

export default PostDetailPage;

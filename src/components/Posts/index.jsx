import { Link } from "react-router-dom";
import { likePost } from "../../apis/api";

export const SmallPost = ({ post }) => {
  const onClickLike = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      await likePost(post.id);
    } catch (error) {
      console.error("메인화면 좋아요 실패:", error);
      alert("로그인이 필요하거나 좋아요를 반영할 수 없습니다.");
    }
  };

  return (
    <Link
      to={`/${post.id}`}
      className="w-64 relative block group py-10 px-8 mr-5 my-5 ring-8 ring-transparent border-2 border-box border-white hover:bg-orange-400 hover:text-black hover:border-transparent hover:ring-orange-300 hover:ring-opacity-90 rounded-xl font-medium"
    >
      <h1 className="font-extrabold text-2xl truncate">{post.title}</h1>
      <p className="mt-2">{post.author.username}</p>
      <div className="flex flex-wrap mt-4">
        {post.tags.map((tag) => (
          <span key={tag.id} className="tag mr-1 mb-2">
            #{tag.content}
          </span>
        ))}
      </div>
      <div className="cursor-pointer mt-2" onClick={onClickLike}>
        ❤️ {post?.like_users?.length || 0}
      </div>
    </Link>
  );
};

export const BigPost = ({ post }) => {
  const onClickLike = async () => {
    try {
      await likePost(post.id);
    } catch (error) {
      console.error("상세페이지 좋아요 실패:", error);
      alert("로그인이 필요하거나 좋아요를 반영할 수 없습니다.");
    }
  };
  return (
    <div className="flex flex-col px-8 py-5 w-full bg-orange-400 ring-4 ring-orange-300 rounded-xl gap-5">
      <div className="flex flex-row items-center justify-between gap-3">
        <span className="text-black font-bold text-2xl">
          {post.author.username}의 {post.title}
        </span>
        <span className="text-black font-medium text-base">
          {post.created_at.slice(0, 10)}
        </span>
      </div>

      <div className=" rounded-xl p-2 text-black font-medium text-lg border-2 border-black">
        {post.content}
      </div>

      <div className="flex flex-row gap-2">
        {post.tags &&
          post.tags.map((tag) => (
            <span key={tag.id} className="tag">
              #{tag.content}
            </span>
          ))}
      </div>

      <div
        className="flex flex-row text-black cursor-pointer items-center gap-1 font-bold"
        onClick={onClickLike}
      >
        ❤️ {post?.like_users?.length || 0}
      </div>
    </div>
  );
};

import { instance, instanceWithToken } from "./axios";

// Account 관련 API들
export const signIn = async (data) => {
  const response = await instance.post("/account/signin/", data);
  if (response.status === 200) {
    window.location.href = "/";
  } else {
    console.log("Error");
  }
};

export const signUp = async (data) => {
  const response = await instance.post("/account/signup/", data);
  if (response.status === 200 || response.status === 201) {
    window.location.href = "/";
  } else {
    console.log("Error");
  }
  return response;
};

//Post 관련 API
// 추가
export const getPosts = async () => {
  const response = await instance.get("/post/");
  return response.data;
};

export const getPost = async (id) => {
  const response = await instance.get(`/post/${id}/`);
  return response.data;
};

export const createPost = async (data, navigate) => {
  const response = await instanceWithToken.post("/post/", data);
  if (response.status === 201) {
    console.log("POST SUCCESS");
    navigate("/");
  } else {
    console.log("[ERROR] error while creating post");
  }
};

export const updatePost = async (id, data, navigate) => {
  const response = await instanceWithToken.put(`/post/${id}/`, data);
  if (response.status === 200) {
    console.log("POST UPDATE SUCCESS");
    navigate(-1);
  } else {
    console.log("[ERROR] error while updating post");
  }
};

// 과제!!
export const deletePost = async (id, navigate) => {
  const response = await instanceWithToken.delete(`/post/${id}/`);
  if (response.status === 204) {
    console.log("DELETE SUCCESS");
    navigate(-1);
  } else {
    console.log("[ERROR] error while deleting post");
  }
};

// 과제!!
export const likePost = async (postId) => {};

// 추가
// Tag 관련 API들
export const getTags = async () => {
  const response = await instance.get("/tag/");
  return response.data;
};

export const createTag = async (data) => {
  const response = await instanceWithToken.post("/tag/", data);
  if (response.status === 201) {
    console.log("TAG SUCCESS");
  } else {
    console.log("[ERROR] error while creating tag");
  }
  return response; // response 받아서 그 다음 처리
};

//추가
export const getUser = async () => {
  const response = await instanceWithToken.get("/account/info/");
  if (response.status === 200) {
    console.log("GET USER SUCCESS");
  } else {
    console.log("[ERROR] error while updating comment");
  }
  return response.data;
};

// 추가

// Comment 관련 API들
export const getComments = async (postId) => {
  const response = await instance.get(`/comment/?post=${postId}`);
  return response.data;
};

export const createComment = async (data) => {
  try {
    console.log("COMMENT REQUEST DATA:", data);

    const response = await instanceWithToken.post("/comment/", data);

    if (response.status === 201) {
      console.log("COMMENT SUCCESS");
      window.location.reload();
    }

    return response.data;
  } catch (error) {
    console.log("COMMENT CREATE ERROR");
    console.log("status:", error.response?.status);
    console.log("data:", error.response?.data);
    console.log("data detail:", JSON.stringify(error.response?.data, null, 2));

    alert(error.response?.data?.message || "댓글 작성에 실패했습니다.");

    throw error;
  }
};

export const updateComment = async (id, data) => {
  const response = await instanceWithToken.put(`/comment/${id}/`, data); // 혹시 patch로 구현했다면 .patch
  if (response.status === 200) {
    console.log("COMMENT UPDATE SUCCESS");
    window.location.reload();
  } else {
    console.log("[ERROR] error while updating comment");
  }
};

// 과제 !!
export const deleteComment = async (id) => {
  try {
    const response = await instanceWithToken.delete(`/comment/${id}/`);

    if (response.status === 204) {
      console.log("Comment Delete Success");
      window.location.reload();
    }
  } catch (error) {
    console.log("[ERROR] error while deleting comment");
  }
};

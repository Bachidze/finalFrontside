"use client"; 

import { ChangeEvent, useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

interface Post {
  _id: string;
  title: string;
  content: string;
}

export default function MainPage() {
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState<Post[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [editPostId, setEditPostId] = useState<string | null>(null); 
  const [editTitle, setEditTitle] = useState<string>("");
  const [editContent, setEditContent] = useState<string>("");
  const [filterVisible, setFilterVisible] = useState(false); 
  const [filterText, setFilterText] = useState(""); 
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [deletingPostId, setDeletingPostId] = useState<string | null>(null); 

  useEffect(() => {
    async function checkAuth() {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token found in localStorage");

        const authResponse = await axios.get(
          "http://localhost:3000/auth/current-user",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (authResponse.status !== 200) {
          throw new Error("Failed to authenticate token");
        }

        const postsResponse = await axios.get("http://localhost:3000/posts", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (postsResponse.status === 200) {
          setPosts(postsResponse.data);
        } else {
          throw new Error("Failed to fetch posts");
        }
      } catch (error) {
        console.error("Error during authentication or fetching posts:", error);
        setError("An error occurred. Redirecting to sign-in...");
        localStorage.removeItem("token");
        router.push("/sign-in");
      } finally {
        setLoading(false);
      }
    }

    checkAuth();
  }, [router]);

  const handleSubmitFnc = async (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const postResponse = await axios.post(
        "http://localhost:3000/posts",
        { title, content },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (postResponse.status === 201) {
        setPosts([...posts, postResponse.data]);
        setTitle("");
        setContent("");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeletePost = async (_id: string) => {
    setDeletingPostId(_id); 

    try {
      const token = localStorage.getItem("token");
      const deleteResponse = await axios.delete(
        `http://localhost:3000/posts/${_id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (deleteResponse.status === 200) {
        setPosts(posts.filter((post) => post._id !== _id));
      }
    } catch (error) {
      console.log(error);
    } finally {
      setDeletingPostId(null); 
    }
  };

  const handleUpdatePost = async (_id: string) => {
    try {
      const token = localStorage.getItem("token");
      const updateResponse = await axios.patch(
        `http://localhost:3000/posts/${_id}`,
        { title: editTitle, content: editContent },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (updateResponse.status === 200) {
        setPosts(
          posts.map((post) =>
            post._id === _id ? { ...post, title: editTitle, content: editContent } : post
          )
        );
        setEditPostId(null); 
        setEditTitle("");
        setEditContent("");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(filterText.toLowerCase())
  );

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <main className="w-[87%] m-auto pt-6">
      <section className="flex justify-between pb-[32px]">
        <div className="text-[#858BB2]">
          <h2>Invoices</h2>
          <h4>{posts.length} invoices</h4>
        </div>
        <div className="flex gap-8">
          <div className="text-[#858BB2]">
            <button
              onClick={() => setFilterVisible(!filterVisible)}
              className="bg-blue-500 p-2 rounded"
            >
              {filterVisible ? "Hide Filter" : "Show Filter"}
            </button>
            {filterVisible && (
              <input
                type="text"
                placeholder="Filter by title"
                value={filterText}
                onChange={(e) => setFilterText(e.target.value)}
                className="block w-full mt-2 p-2 border border[#858BB2] rounded text-[#858BB2]"
              />
            )}
          </div>
        </div>
      </section>
      <form onSubmit={handleSubmitFnc} className="mb-6">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="block w-full mb-2 p-2 border border-[#858BB2] rounded"
        />
        <input
          type="text"
          placeholder="Description"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="block w-full mb-2 p-2 border border-[#858BB2] rounded"
        />
        <button type="submit" className="p-2 bg-blue-500 text-[#858BB2] rounded">
          Add Post
        </button>
      </form>
      {filteredPosts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPosts.map((post) => (
            <motion.div
              key={post._id}
              className="bg-[#1E2139] p-4 rounded-md shadow-md text-[#858BB2]"
              initial={{ opacity: 1, x: 0 }}
              animate={{ opacity: deletingPostId === post._id ? 0 : 1, x: deletingPostId === post._id ? 50 : 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.3 }}
            >
              {editPostId === post._id ? (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleUpdatePost(post._id);
                  }}
                >
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="block w-full mb-2 p-2 border border-[#858BB2] rounded text-[#858BB2]"
                  />
                  <input
                    type="text"
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className="block w-full mb-2 p-2 border border-[#858BB2] rounded text-[#858BB2]"
                  />
                  <button type="submit" className="p-2 bg-green-500 text-[#858BB2] rounded mt-2">
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEditPostId(null);
                      setEditTitle("");
                      setEditContent("");
                    }}
                    className="p-2 bg-[#858BB2] text-[#858BB2] rounded mt-2 ml-2"
                  >
                    Cancel
                  </button>
                </form>
              ) : (
                <>
                  <h3 className="text-xl font-bold">{post.title}</h3>
                  <p>{post.content}</p>
                  <button
                    onClick={() => handleDeletePost(post._id)}
                    className="p-2 bg-red-500 text-white rounded mt-2"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => {
                      setEditPostId(post._id);
                      setEditTitle(post.title);
                      setEditContent(post.content);
                    }}
                    className="p-2 bg-yellow-500 text-white rounded mt-2 ml-2"
                  >
                    Update
                  </button>
                </>
              )}
            </motion.div>
          ))}
        </div>
      ) : (
        <p className="text-white">No posts available.</p>
      )}
    </main>
  );
}

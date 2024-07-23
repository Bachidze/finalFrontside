"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

interface Post {
  id: string;
  title: string;
  content: string;
}

export default function MainPage() {
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState<Post[]>([]);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function checkAuth() {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token found in localStorage");

  
        const authResponse = await axios.get("http://localhost:3000/auth/current-user", {
          headers: { 'Authorization': `Bearer ${token}` },
        });

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

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <main className="w-[87%] m-auto pt-6">
      <section className="flex justify-between pb-[32px]">
        <div className="text-white">
          <h2>Invoices</h2>
          <h4>7 invoices</h4>
        </div>
        <div className="flex gap-8">
          <div className="text-white">
            <h3>Filter</h3>
          </div>
          <div className="text-white">
            <div></div>
            <div>new</div>
          </div>
        </div>
      </section>
      {posts.length > 0 ? (
        <ul className="flex flex-col gap-5">
          {posts.map((post) => (
            <li
              key={post.id}
              className="bg-[#1E2139] p-4 rounded-md shadow-md text-white"
            >
              <h2 className="text-xl font-bold">{post.title}</h2>
              <p>{post.content}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No posts available.</p>
      )}
    </main>
  );
}

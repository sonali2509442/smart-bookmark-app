
"use client";

import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [bookmarks, setBookmarks] = useState<any[]>([]);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const router = useRouter();

  useEffect(() => {
    checkUser();
    fetchBookmarks();
  }, []);

  const checkUser = async () => {
    const { data } = await supabase.auth.getUser();
    if (!data.user) router.push("/");
    else setUser(data.user);
  };

  const fetchBookmarks = async () => {
    const { data } = await supabase
      .from("bookmarks")
      .select("*")
      .order("created_at", { ascending: false });

    if (data) setBookmarks(data);
  };

  const addBookmark = async () => {
    if (!user || !title || !url) return;

    await supabase.from("bookmarks").insert([
      { title, url, user_id: user.id },
    ]);

    setTitle("");
    setUrl("");
    fetchBookmarks();
  };

  const deleteBookmark = async (id: string) => {
    await supabase.from("bookmarks").delete().eq("id", id);
    fetchBookmarks();
  };

  const logout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">

      {/* NAVBAR */}
      <header className="flex justify-between items-center px-8 py-4 bg-white shadow-sm">
        <h1 className="text-xl font-bold">SmartBookmark</h1>

        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600 hidden md:block">
            {user?.email}
          </span>

          <button
            onClick={logout}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </header>

      <div className="max-w-3xl mx-auto p-8">

        {/* PAGE TITLE */}
        <h2 className="text-3xl font-bold mb-6 text-gray-800">
          My Bookmarks
        </h2>

        {/* ADD BOOKMARK CARD */}
        <div className="bg-white p-6 rounded-2xl shadow-md mb-8">
          <h3 className="font-semibold mb-4 text-lg">
            Add New Bookmark
          </h3>

          <div className="flex flex-col md:flex-row gap-3">
            <input
              placeholder="Website title"
              className="border rounded-lg p-3 flex-1 focus:outline-none focus:ring-2 focus:ring-black"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <input
              placeholder="https://example.com"
              className="border rounded-lg p-3 flex-1 focus:outline-none focus:ring-2 focus:ring-black"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />

            <button
              onClick={addBookmark}
              className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800"
            >
              Add
            </button>
          </div>
        </div>

        {/* BOOKMARK LIST */}
        {bookmarks.length === 0 ? (
          <div className="text-center text-gray-500 mt-16">
            No bookmarks yet 🚀 <br />
            Start by adding your first link.
          </div>
        ) : (
          <div className="space-y-4">
            {bookmarks.map((bm) => (
              <div
                key={bm.id}
                className="bg-white p-4 rounded-2xl shadow-md flex justify-between items-center hover:shadow-lg transition"
              >
                <a
                  href={bm.url}
                  target="_blank"
                  className="text-blue-600 font-medium hover:underline"
                >
                  {bm.title}
                </a>

                <button
                  onClick={() => deleteBookmark(bm.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}


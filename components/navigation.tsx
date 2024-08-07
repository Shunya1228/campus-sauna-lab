"use client";

import Link from "next/link";
import useStore from "@/store";
import { useEffect } from "react";
import type { Session } from "@supabase/auth-helpers-nextjs";
import type { Database } from "@/types/supabasetype";
type ProfileType = Database["public"]["Tables"]["profiles"]["Row"];
import Image from "next/image";

// ナビゲーション
const Navigation = ({
  session,
  profile,
}: {
  session: Session | null;
  profile: ProfileType | null;
}) => {
  const { setUser } = useStore();

  // 状態管理にユーザー情報を保存
  useEffect(() => {
    setUser({
      id: session ? session.user.id : "",
      email: session ? session.user.email! : "",
      name: session && profile ? profile.name : "",
      introduce: session && profile ? profile.introduce : "",
      avatar_url: session && profile ? profile.avatar_url : "",
      favorite_facilities: session && profile ? profile.favorite_facilities : "",
    });
  }, [session, setUser, profile]);

  return (
    <header className="shadow-lg shadow-gray-100 bg-gray-800 text-white p-2">
      <div className="py-2 container max-w-screen-sm mx-auto flex items-center justify-between">
        <Link href="/" className="font-bold text-lg cursor-pointer">
          Campus Sauna Lab
        </Link>

        <div className="text-sm font-bold">
          {session ? (
            <div className="flex items-center space-x-5">
              <Link href="/settings/profile">
                <div className="relative w-10 h-10">
                  <Image
                    src={
                      profile && profile.avatar_url
                        ? profile.avatar_url
                        : "/default.png"
                    }
                    className="rounded-full object-cover"
                    alt="avatar"
                    fill
                  />
                </div>
              </Link>
            </div>
          ) : (
            <div className="flex items-center space-x-5">
              <Link href="/auth/login">ログイン</Link>
              <Link href="/auth/signup" className="bg-blue-500 text-white px-2 py-2 rounded">サインアップ</Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navigation;

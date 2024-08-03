import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { redirect } from "next/navigation";
import MyMap from "../../components/mymap/mymap";

import type { Database } from "@/types/supabasetype";

export default async function MyMapPage() {
  const supabase = createServerComponentClient<Database>({
    cookies,
  });

  // セッションの取得
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // 未認証の場合、リダイレクト
  if (!session) {
    redirect("/auth/login");
  }

  const userId = session.user.id;

  return <MyMap userId={userId} />;
}

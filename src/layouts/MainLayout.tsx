import Head from "next/head";
import type { FC } from "react";
import Sidebar from "~/components/Sidebar";

interface Props {
  children: React.ReactNode;
}

const MainLayout: FC<Props> = ({ children }: React.PropsWithChildren) => {
  return (
    <>
      <Head>
        <title>GPT-4 Prompt Hub</title>
        <meta
          name="description"
          content="PromptHubは、GPT-4の様々な活用法をまとめ、管理、共有できるWebアプリケーションです。ユーザーは自分で見つけた活用法をデータベースに登録し、それらを一覧で閲覧することができます。"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <div className="flex">
          <Sidebar />
          <main className="w-3/4 bg-gray-100">{children}</main>
        </div>
      </main>
    </>
  );
};

export default MainLayout;

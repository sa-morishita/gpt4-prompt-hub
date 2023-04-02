import type { NextPage } from "next";
import Link from "next/link";

const Custom404: NextPage = () => {
  return (
    <div className="grid h-screen place-content-center px-4">
      <div className="text-center">
        <h1 className="text-9xl font-black text-gray-400">404</h1>

        <p className="mt-4 text-gray-500">ページが見つかりませんでした。</p>

        <Link
          href="/"
          className="mt-6 inline-block rounded bg-indigo-600 px-5 py-3 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring"
        >
          ホームに戻る
        </Link>
      </div>
    </div>
  );
};

export default Custom404;

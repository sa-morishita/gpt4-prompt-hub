import {
  ArrowLeftOnRectangleIcon,
  ArrowRightOnRectangleIcon,
  DocumentPlusIcon,
  FolderIcon,
  HomeIcon,
} from "@heroicons/react/24/outline";
import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { memo, type FC } from "react";
import { filterClassNames, judgeSelected } from "~/utils/helper";

const MemoizedArrowLeftOnRectangleIcon = memo(ArrowLeftOnRectangleIcon);
const MemoizedGlobeArrowRightOnRectangleIcon = memo(ArrowRightOnRectangleIcon);
const MemoizedFolderIcon = memo(FolderIcon);
const MemoizedHomeIcon = memo(HomeIcon);
const MemoizedDocumentPlusIcon = memo(DocumentPlusIcon);

const Sidebar: FC = () => {
  const { route } = useRouter();
  const { status } = useSession();

  const navigation = [
    { name: "タグから検索", href: "/", icon: MemoizedHomeIcon },
    { name: "登録済み一覧", href: "/prompt-list", icon: MemoizedFolderIcon },
    {
      name: "プロンプトを登録",
      href: "/prompt-form",
      icon: MemoizedDocumentPlusIcon,
    },
  ];

  return (
    <div className="flex min-h-0 flex-1 flex-col border-r border-gray-200 bg-white">
      <div className="flex flex-1 flex-col overflow-y-auto pb-4 pt-5">
        <div className="flex flex-shrink-0 items-center px-4">
          <p className="text-center text-lg font-bold">Prompt Hub</p>
        </div>
        <nav className="mt-5 flex-1 space-y-1 bg-white px-2">
          {navigation.map((item) => {
            const { name, href } = item;

            return (
              <Link
                key={name}
                href={href}
                className={filterClassNames(
                  judgeSelected(route, href)
                    ? "bg-gray-100 text-gray-900"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                  "group flex items-center rounded-md px-2 py-2 text-sm font-medium"
                )}
              >
                <item.icon
                  className={filterClassNames(
                    judgeSelected(route, href)
                      ? "text-gray-500"
                      : "text-gray-400 group-hover:text-gray-500",
                    "mr-3 h-6 w-6 flex-shrink-0"
                  )}
                  aria-hidden="true"
                />
                {name}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="flex flex-shrink-0 justify-center border-t border-gray-200 p-4">
        {status === "authenticated" ? (
          <div className="flex items-center space-x-4">
            <div>
              <button
                onClick={() => signOut()}
                className="flex items-center space-x-3 rounded border border-gray-200 px-4 py-2 transition hover:border-gray-900 hover:text-gray-900"
              >
                <div>Logout</div>
                <div>
                  <MemoizedGlobeArrowRightOnRectangleIcon className="h-5 w-5" />
                </div>
              </button>
            </div>
          </div>
        ) : (
          <div>
            <button
              onClick={() => signIn()}
              className="flex items-center space-x-3 rounded border border-gray-200 px-4 py-2 transition hover:border-gray-900 hover:text-gray-900"
            >
              <div>Signin</div>
              <div>
                <MemoizedArrowLeftOnRectangleIcon className="h-5 w-5" />
              </div>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;

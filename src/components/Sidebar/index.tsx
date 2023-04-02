import { FolderIcon, HomeIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { useRouter } from "next/router";
import type { FC } from "react";
import { filterClassNames, judgeSelected } from "~/utils/helper";

const Sidebar: FC = () => {
  const { route } = useRouter();

  const navigation = [
    { name: "プロンプト登録", href: "/", icon: HomeIcon },
    { name: "登録済み一覧", href: "/saved-prompts", icon: FolderIcon },
  ];

  return (
    <div className="flex min-h-0 flex-1 flex-col border-r border-gray-200 bg-white">
      <div className="flex flex-1 flex-col overflow-y-auto pb-4 pt-5">
        <div className="flex flex-shrink-0 items-center px-4">
          <p className="text-center text-lg font-bold">WordWise</p>
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
    </div>
  );
};

export default Sidebar;

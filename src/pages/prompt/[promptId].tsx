import type { GetStaticProps, NextPage } from "next";
import { useRouter } from "next/router";
import Prompt from "~/components/Prompt";
import MainLayout from "~/layouts/MainLayout";
import { generateSSGHelper } from "~/server/helpers/ssgHelper";
import { api } from "~/utils/api";

export const getStaticProps: GetStaticProps = async (context) => {
  const ssg = generateSSGHelper();

  const promptId = context.params?.promptId;

  if (typeof promptId !== "string") {
    return {
      notFound: true,
    };
  }

  await ssg.prompt.getPromptById.prefetch({ promptId });

  return {
    props: {
      trpcState: ssg.dehydrate(),
      promptId,
    },
  };
};

export const getStaticPaths = () => {
  return { paths: [], fallback: "blocking" };
};

const PromptPage: NextPage<{ promptId: string }> = ({ promptId }) => {
  const router = useRouter();

  const getPromptById = api.prompt.getPromptById.useQuery(
    { promptId },
    {
      onError: () => {
        void (async () => {
          await router.push("/404");
        })();
      },
    }
  );

  return (
    <MainLayout>
      {getPromptById.isLoading && (
        <div className="text-center py-6">
          <span className="relative inset-0 inline-flex h-6 w-6 animate-spin items-center justify-center rounded-full border-2 border-emerald-600 after:absolute after:h-8 after:w-8 after:rounded-full after:border-2 after:border-y-purple-600 after:border-x-transparent"></span>
        </div>
      )}
      {getPromptById.isSuccess && getPromptById.data && (
        <Prompt prompt={getPromptById.data} />
      )}
    </MainLayout>
  );
};

export default PromptPage;

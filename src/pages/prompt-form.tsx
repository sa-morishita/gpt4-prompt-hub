import type { GetStaticProps, NextPage } from "next";
import PromptForm from "~/components/PromptForm";
import MainLayout from "~/layouts/MainLayout";
import { generateSSGHelper } from "~/server/helpers/ssgHelper";
import { api } from "~/utils/api";

export const getStaticProps: GetStaticProps = async () => {
  const ssg = generateSSGHelper();

  await ssg.tag.getTags.prefetch();

  return {
    props: {
      trpcState: ssg.dehydrate(),
    },
  };
};

const PromptFormPage: NextPage = () => {
  const getTags = api.tag.getTags.useQuery();

  return (
    <MainLayout>
      {getTags.isLoading && (
        <div className="text-center py-6">
          <span className="relative inset-0 inline-flex h-6 w-6 animate-spin items-center justify-center rounded-full border-2 border-emerald-600 after:absolute after:h-8 after:w-8 after:rounded-full after:border-2 after:border-y-purple-600 after:border-x-transparent"></span>
        </div>
      )}
      {getTags.isSuccess && getTags.data && <PromptForm tags={getTags.data} />}
    </MainLayout>
  );
};

export default PromptFormPage;

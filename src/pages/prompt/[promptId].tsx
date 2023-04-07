import { type NextPage } from "next";
import Prompt from "~/components/Prompt";
import MainLayout from "~/layouts/MainLayout";

const PromptPage: NextPage = () => {
  return (
    <MainLayout>
      <Prompt />
    </MainLayout>
  );
};

export default PromptPage;

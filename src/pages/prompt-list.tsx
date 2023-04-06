import { type NextPage } from "next";
import PromptList from "~/components/PromptList";
import MainLayout from "~/layouts/MainLayout";

const PromptListPage: NextPage = () => {
  return (
    <MainLayout>
      <PromptList />
    </MainLayout>
  );
};

export default PromptListPage;

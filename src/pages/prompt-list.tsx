import { type NextPage } from "next";
import PromptList from "~/components/PromptList";
import MainLayout from "~/layouts/MainLayout";

// [ ] ISR

const PromptListPage: NextPage = () => {
  return (
    <MainLayout>
      <PromptList />
    </MainLayout>
  );
};

export default PromptListPage;

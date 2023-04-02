import { type NextPage } from "next";
import PromptForm from "~/components/PromptForm";
import MainLayout from "~/layouts/MainLayout";

const Home: NextPage = () => {
  return (
    <MainLayout>
      <PromptForm />
    </MainLayout>
  );
};

export default Home;

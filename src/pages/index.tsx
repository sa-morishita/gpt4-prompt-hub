import { type NextPage } from "next";
import TagSearch from "~/components/TagSearch";
import MainLayout from "~/layouts/MainLayout";

const Home: NextPage = () => {
  return (
    <MainLayout>
      <TagSearch />
    </MainLayout>
  );
};

export default Home;

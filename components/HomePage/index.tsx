import ExperienceListingSection from "./ExperienceListingSection";

const HomePage = ({ query }: { query?: string }) => {
  return <ExperienceListingSection query={query} />;
};

export default HomePage;

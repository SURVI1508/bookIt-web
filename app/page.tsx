import HomePage from "../components/HomePage";
import AppLayout from "../components/Layouts/AppLayout";

export default async function Home({
  searchParams,
}: {
  searchParams: { q: string };
}) {
  const { q } = await searchParams;
  return (
    <AppLayout>
      <HomePage query={q} />
    </AppLayout>
  );
}

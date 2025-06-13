import BlogDetail from "../components/BlogDetail";

export default function Page({ params }: { params: { id: string } }) {
  return <BlogDetail blogId={params.id} />;
}

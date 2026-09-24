
import ResetPasswordForm from "@/app/components/ResetPasswordForm/ResetPasswordForm";

type ResetPasswordPageProps = {
  searchParams: Promise<{
    token?: string;
  }>;
};

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;

  return <ResetPasswordForm token={token} />;
}


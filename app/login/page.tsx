export const metadata = {
  title: "تسجيل الدخول | شغف",
  description: "تسجيل الدخول إلى مساحة شغف",
};

import PageIllustration from "@/components/page-illustration";
import LoginForm from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <>
      {/* PageIllustration renders a decorative background layer.
          If it uses dark colors, the white layer below (rendered
          by LoginForm itself) will sit on top and cover it — but
          if you don't need the illustration on this page at all,
          it's safer to just remove the line above and below. */}
      <PageIllustration />

      <section className="relative bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">

          <div className="py-16 md:py-20">

            <LoginForm />

          </div>

        </div>
      </section>
    </>
  );
}
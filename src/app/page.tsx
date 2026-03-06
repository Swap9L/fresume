import BlurFade from "@/components/magicui/blur-fade";
import BlurFadeText from "@/components/magicui/blur-fade-text";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Page() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 text-center space-y-8">
      <div className="max-w-4xl space-y-4  flex flex-col items-center justify-center">
        <BlurFadeText
          text={`F___ Resume 
Stop sending boring PDF
Put your resume on the internet`}
          className="text-3xl md:text-6xl font-bold tracking-tighter whitespace-pre-line"
        />
        <BlurFade delay={0.1}>
          <p className="text-xl text-muted-foreground">
            The easiest way to showcase your work, skills, and experience to the world.
            Claim your unique URL and land your dream job.
          </p>
        </BlurFade>
      </div>

      <BlurFade delay={0.2}>

        <div className="flex flex-col sm:flex-row gap-4">

          <Button asChild variant="outline" size="lg" className="w-32 rounded-full px-8">
            <Link href="/d-swapnil">Take a Look</Link>
          </Button>
          <Button asChild size="lg" className="rounded-full px-8">
            <Link href="/auth/signup">Get Started for Free</Link>
          </Button>

          <Button asChild variant="outline" size="lg" className="w-32 rounded-full px-8">
            <Link href="/auth/login">Login</Link>
          </Button>
        </div>
      </BlurFade>
      {/* 
      <BlurFade delay={0.3} className="pt-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left max-w-5xl">
          <div className="p-6 border rounded-2xl bg-card">
            <h3 className="text-lg font-bold mb-2">Personalized URL</h3>
            <p className="text-muted-foreground text-sm">Get your own unique link like yourdomain.com/username to share with recruiters.</p>
          </div>
          <div className="p-6 border rounded-2xl bg-card">
            <h3 className="text-lg font-bold mb-2">Beautiful Design</h3>
            <p className="text-muted-foreground text-sm">Modern, responsive, and performance-optimized portfolio that looks great on any device.</p>
          </div>
          <div className="p-6 border rounded-2xl bg-card">
            <h3 className="text-lg font-bold mb-2">Admin Dashboard</h3>
            <p className="text-muted-foreground text-sm">Easily manage your projects, education, and skills through an intuitive interface.</p>
          </div>
        </div>
      </BlurFade> */}

      <footer className="absolute bottom-0 text-sm text-muted-foreground">
        © {new Date().getFullYear()} FResume. All rights reserved.
      </footer>
    </main>
  );
}

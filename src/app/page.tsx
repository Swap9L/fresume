import BlurFade from "@/components/magicui/blur-fade";
import BlurFadeText from "@/components/magicui/blur-fade-text";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { SearchBar } from "@/components/search/search-bar";

export default function Page() {
  return (
    <main className="min-h-[100dvh] flex flex-col items-center p-6 pb-20 md:pb-0 text-center relative overflow-x-hidden md:justify-center md:space-y-8">
      {/* Search Bar Container */}
      <div className="w-full flex justify-center z-[100] mt-4 md:mt-0 md:absolute md:top-21 md:left-1/2 md:-translate-x-1/2">
        <BlurFade delay={0.3} className="w-full max-w-2xl">
          <SearchBar />
        </BlurFade>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col items-center justify-center pt-0 space-y-4  md:space-y-8 w-full max-w-4xl mx-auto py-12 md:py-0 md:flex-none">
        <div className="space-y-4 flex flex-col items-center justify-center">
          <BlurFadeText
            text={"F___ Resume \nStop sending boring PDF\nPut your resume on the internet"}
            className="text-3xl md:text-6xl font-bold tracking-tighter whitespace-pre-line leading-tight"
          />
          <BlurFade delay={0.1}>
            <p className=" text-md md:text-xl text-muted-foreground mt-4 md:mt-0 max-w-[90%] md:max-w-none mx-auto">
              The easiest way to showcase your work, skills, and experience to the world.
              Claim your unique URL and land your dream job.
            </p>
          </BlurFade>
        </div>

        <BlurFade delay={0.2}>
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto md:w-full md:justify-center">
            <Button asChild variant="outline" size="lg" className="w-full sm:w-40 md:w-32 rounded-full px-8">
              <Link href="/d-swapnil">Take a Look</Link>
            </Button>
            <Button asChild size="lg" className="w-full sm:w-auto md:w-auto rounded-full px-8">
              <Link href="/auth/signup">Get Started for Free</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="w-full sm:w-40 md:w-32 rounded-full px-8">
              <Link href="/auth/login">Login</Link>
            </Button>
          </div>
        </BlurFade>
      </div>

      <footer className="absolute bottom-0 left-0 w-full flex justify-between px-2 py-0.5    text-[10px] sm:text-xs md:text-sm text-muted-foreground font-mono z-0 bg-background/50 md:bg-transparent backdrop-blur-sm md:backdrop-blur-none">
        <div className="flex items-center gap-1">
          <span className="text-green-500">$</span>
          <span>made_by:</span>
          <a href="https://x.com/swap999l/" target="_blank">
            <span className="text-amber-500 hover:text-amber-400 transition-colors cursor-pointer">
              &quot;D. Swapnil&quot;
            </span></a>
          <span className="w-2 h-4 bg-muted-foreground/60 animate-pulse ml-1"></span>
        </div>

        <div className="opacity-70 flex items-center">
          <span>{new Date().getFullYear()} © F___Resume </span>
        </div>
      </footer>
    </main>
  );
}

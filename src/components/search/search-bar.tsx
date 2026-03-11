"use client";

import { useState, useEffect, useRef } from "react";
import { Search, User, Eye, Users } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";

export function SearchBar() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [topResumes, setTopResumes] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Fetch initial stats
    fetch("/api/search?init=true")
      .then((res) => res.json())
      .then((data) => {
        setTotalUsers(data.totalUsers || 0);
        // Filter out resumes without a valid user object to prevent crashes
        const validResumes = (data.topResumes || []).filter((r: any) => r && r.user && r.user.username);
        setTopResumes(validResumes);
      })
      .catch(console.error);

    // Click outside to close
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsExpanded(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!query) {
      setResults([]);
      setIsExpanded(false);
      return;
    }
    const timer = setTimeout(() => {
      setIsLoading(true);
      fetch(`/api/search?q=${encodeURIComponent(query)}`)
        .then((res) => res.json())
        .then((data) => {
          setResults(data.users || []);
        })
        .catch(console.error)
        .finally(() => setIsLoading(false));
    }, 300); // debounce

    return () => clearTimeout(timer);
  }, [query]);

  return (
    <div className="flex flex-col items-center mt-6 w-full max-w-2xl mx-auto relative z-[100]">

      {/* Top 3 Visited Resumes Pill */}
      {topResumes.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 flex flex-col items-center"
        >
          <div className="text-xs font-semibold text-muted-foreground mb-3 uppercase tracking-wider">Top Portfolios</div>
          <div className="flex -space-x-3 hover:space-x-2 transition-all duration-300">
            {topResumes.map((resume: any, i) => (
              <Link href={resume.user?.username ? `/${resume.user.username}` : "#"} key={resume.id || i}>
                <div
                  className="relative group cursor-pointer transition-transform hover:scale-110 hover:z-10 bg-background rounded-full p-1 border border-border/50 shadow-sm"
                  style={{ zIndex: 10 - i }}
                >
                  <Avatar className="size-10 border-2 border-background bg-muted">
                    <AvatarImage src={resume.avatarUrl || resume.user?.image || ""} alt={resume.name || ""} />
                    <AvatarFallback className="text-[10px]"><User className="size-4 text-muted-foreground" /></AvatarFallback>
                  </Avatar>

                  {/* Tooltip */}
                  <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-zinc-900 dark:bg-zinc-100 text-zinc-100 dark:text-zinc-900 text-xs px-2 py-1 rounded whitespace-nowrap pointer-events-none text-center">
                    <span className="font-bold">{resume.name}</span>
                    <div className="flex items-center justify-center gap-1 mt-0.5 text-[10px] text-zinc-400 dark:text-zinc-500">
                      <Eye className="size-3" /> {resume.visits || 0} views
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </motion.div>
      )}

      {/* Search Bar - Dock Style */}
      <div
        ref={searchRef}
        className={`relative transition-all duration-500 ease-out bg-background/80 backdrop-blur-xl border border-white/20 dark:border-white/10 shadow-2xl rounded-full overflow-visible ${isExpanded ? "w-full max-w-md" : "w-auto"
          }`}
        onClick={() => setIsExpanded(true)}
      >
        <div className="flex items-center h-11 px-8 gap-3 cursor-pointer">
          <Search className={`size-4 transition-colors ${isExpanded ? "text-primary" : "text-muted-foreground"}`} />

          {isExpanded ? (
            <input
              type="text"
              placeholder="Search developers..."
              className="bg-transparent border-none outline-none w-full text-sm placeholder:text-muted-foreground flex-1"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && query.trim() !== "") {
                  router.push(`/search?q=${encodeURIComponent(query)}`);
                }
              }}
              autoFocus
            />
          ) : (
            <div className="hidden sm:flex items-center gap-2 text-sm font-medium text-muted-foreground whitespace-nowrap pr-2">
              <Users className="size-4" />
              <span>{totalUsers.toLocaleString()} Developers</span>
            </div>
          )}

          {isLoading && isExpanded && (
            <div className="size-4 border-2 border-primary border-t-transparent rounded-full animate-spin flex-shrink-0" />
          )}
        </div>

        {/* Search Results Dropdown */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute left-0 right-0 top-full mt-4 bg-background/90 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-2xl shadow-2xl overflow-hidden p-2 z-[100] max-h-[400px] overflow-y-auto"
            >
              {results.length > 0 ? (
                <div className="space-y-1">
                  {results.map((user, i) => (
                    <Link href={user.username ? `/${user.username}` : "#"} key={user.id || i} onClick={() => setIsExpanded(false)}>
                      <Card className="p-3 bg-transparent border-none hover:bg-muted/50 dark:hover:bg-white/5 transition-colors cursor-pointer group flex items-center gap-4 rounded-xl">
                        <Avatar className="size-12 border bg-muted">
                          <AvatarImage src={user.resumeData?.avatarUrl || user.image || ""} />
                          <AvatarFallback><User className="size-5 text-muted-foreground" /></AvatarFallback>
                        </Avatar>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h4 className="font-semibold text-sm truncate group-hover:text-primary transition-colors">{user.name || user.username}</h4>
                            {user.resumeData?.visits > 0 && (
                              <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4 flex items-center gap-1 bg-background/50">
                                <Eye className="size-3" /> {user.resumeData.visits}
                              </Badge>
                            )}
                          </div>

                          <p className="text-xs text-muted-foreground truncate">{user.username}</p>
                          {user.resumeData?.description && (
                            <p className="text-xs text-muted-foreground/80 truncate mt-1 line-clamp-1">{user.resumeData.description}</p>
                          )}
                        </div>
                      </Card>
                    </Link>
                  ))}

                  {/* Complete List Button */}
                  <div className="pt-2 pb-1 px-1 border-t border-border/50 mt-2">
                    <button
                      onClick={() => router.push(`/search?q=${encodeURIComponent(query)}`)}
                      className="w-full text-xs text-center text-muted-foreground hover:text-foreground py-2 transition-colors"
                    >
                      Press Enter to see all results
                    </button>
                  </div>
                </div>
              ) : query.trim() === "" ? (
                <div className="space-y-1">
                  <div className="text-xs font-semibold text-muted-foreground mb-2 px-2 pt-2 uppercase tracking-wider">Most Visited Profiles</div>
                  {topResumes.slice(0, 5).map((user, i) => (
                    <Link href={user.username ? `/${user.username}` : "#"} key={user.id || i} onClick={() => setIsExpanded(false)}>
                      <Card className="p-3 bg-transparent border-none hover:bg-muted/50 dark:hover:bg-white/5 transition-colors cursor-pointer group flex items-center gap-4 rounded-xl">
                        <Avatar className="size-10 border">
                          <AvatarImage src={user.resumeData?.avatarUrl || ""} />
                          <AvatarFallback><User className="size-4 text-muted-foreground" /></AvatarFallback>
                        </Avatar>

                        <div className="flex-1 min-w-0 flex items-center justify-between">
                          <h4 className="font-semibold text-sm truncate group-hover:text-primary transition-colors">{user.name || user.username}</h4>
                          {user.resumeData?.visits > 0 && (
                            <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4 flex items-center gap-1 bg-background/50 text-muted-foreground">
                              <Eye className="size-3" /> {user.resumeData.visits}
                            </Badge>
                          )}
                        </div>
                      </Card>
                    </Link>
                  ))}
                </div>
              ) : isLoading ? (
                <div className="p-8 text-center text-sm text-muted-foreground">Searching...</div>
              ) : (
                <div className="p-8 text-center text-sm text-muted-foreground flex flex-col items-center gap-2">
                  <User className="size-8 opacity-20" />
                  No developers found matching &quot;{query}&quot;
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div >
  );
}

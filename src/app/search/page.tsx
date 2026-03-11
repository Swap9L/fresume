import { SearchBar } from "@/components/search/search-bar";
import prisma from "@/lib/prisma";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Eye, User } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export const dynamic = "force-dynamic";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q: string }>;
}) {
  const { q } = await searchParams;
  const query = q || "";

  const users = await (query ? prisma.user.findMany({
    where: {
      OR: [
        { name: { contains: query, mode: "insensitive" } },
        { username: { contains: query, mode: "insensitive" } },
      ],
    },
    select: {
      id: true,
      name: true,
      username: true,
      image: true,
      resumeData: {
        select: {
          avatarUrl: true,
          description: true,
          visits: true,
          location: true,
        },
      },
    },
    orderBy: {
      resumeData: {
        visits: 'desc'
      }
    }
  }) : Promise.resolve([] as any[]));

  return (
    <main className="min-h-screen p-6 md:p-12 space-y-8 bg-background relative selection:bg-primary/20">

      <div className="max-w-3xl mx-auto space-y-8 mt-12">
        <div className="text-center space-y-4">
          <Link href="/" className="inline-block text-muted-foreground hover:text-foreground transition-colors mb-4">
            ← Back to Home
          </Link>
          <h1 className="text-3xl md:text-5xl font-bold tracking-tighter">Search Developers</h1>
          <p className="text-muted-foreground">Find developers by name or username</p>
        </div>

        <SearchBar />

        <div className="mt-12 space-y-4">
          {query && (
            <h2 className="text-lg font-medium border-b pb-2 mb-6">
              Found {users.length} match{users.length === 1 ? '' : 'es'} for <span className="text-primary font-bold">&quot;{query}&quot;</span>
            </h2>
          )}

          {!query ? (
            <div className="text-center p-12 text-muted-foreground border rounded-xl bg-muted/20 border-dashed">
              Type something completely above to find developer resumes.
            </div>
          ) : users.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {users.map((user) => (
                <Link href={`/${user.username}`} key={user.id}>
                  <Card className="p-4 hover:shadow-md transition-all h-full bg-card/50 backdrop-blur border-border/50 group flex flex-col items-start gap-4 hover:border-primary/50">
                    <div className="flex items-center gap-4 w-full">
                      <Avatar className="size-14 border bg-background group-hover:scale-105 transition-transform">
                        <AvatarImage src={user.resumeData?.avatarUrl || user.image || ""} />
                        <AvatarFallback><User className="size-6 text-muted-foreground" /></AvatarFallback>
                      </Avatar>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold text-base truncate group-hover:text-primary transition-colors">{user.name || user.username}</h3>
                          {user.resumeData?.visits > 0 && (
                            <Badge variant="secondary" className="text-xs px-2 py-0.5 h-auto flex items-center gap-1">
                              <Eye className="size-3" /> {user.resumeData.visits}
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground truncate">{user.username}</p>
                      </div>
                    </div>

                    {user.resumeData?.description && (
                      <p className="text-sm text-muted-foreground/80 line-clamp-2 leading-relaxed">
                        {user.resumeData.description}
                      </p>
                    )}

                    {user.resumeData?.location && (
                      <div className="mt-auto pt-2 text-xs text-muted-foreground font-medium flex items-center gap-1.5 opacity-60">
                        📍 {user.resumeData.location}
                      </div>
                    )}
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center p-12 text-muted-foreground">
              No developers found matching your query.
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

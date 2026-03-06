"use client";

import { syncData } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";

export default function SyncPage() {
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);

    const handleSync = async () => {
        setLoading(true);
        const res = await syncData();
        setResult(res);
        setLoading(false);
    };

    return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle>Data Sync</CardTitle>
                    <CardDescription>
                        Migrate your static resume data from `resume.tsx` to the PostgreSQL database.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {!result ? (
                        <Button className="w-full" onClick={handleSync} disabled={loading}>
                            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Start Sync"}
                        </Button>
                    ) : (
                        <div className={`p-4 rounded-md flex items-center gap-3 ${result.success ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
                            {result.success ? <CheckCircle2 className="size-5" /> : <AlertCircle className="size-5" />}
                            <p className="text-sm font-medium">{result.message}</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

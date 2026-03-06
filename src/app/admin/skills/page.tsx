"use client";

import { useEffect, useState } from "react";
import { getResumeData, addSkill, removeSkill } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Plus, X } from "lucide-react";

export default function SkillsPage() {
    const [loading, setLoading] = useState(true);
    const [newSkill, setNewSkill] = useState("");
    const [data, setData] = useState<any>(null);

    const loadData = async () => {
        const res = await getResumeData();
        if (res) setData(res);
        setLoading(false);
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleAddSkill = async () => {
        if (!newSkill || !data) return;
        const skillToAdd = newSkill.trim();
        if (data.skills.includes(skillToAdd)) {
            alert("Skill already exists!");
            return;
        }
        await addSkill(skillToAdd);
        setNewSkill("");
        loadData();
    };

    const handleRemoveSkill = async (skill: string) => {
        if (!data) return;
        await removeSkill(skill);
        loadData();
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Skills</h1>
                <p className="text-muted-foreground">Add or remove skills from your portfolio.</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Manage Skills</CardTitle>
                    <CardDescription>Add new technologies or remove legacy ones.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex gap-2">
                        <Input
                            placeholder="Add a skill (e.g. Rust, GraphQL)"
                            value={newSkill}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewSkill(e.target.value)}
                            onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => e.key === "Enter" && handleAddSkill()}
                        />
                        <Button onClick={handleAddSkill} className="gap-2">
                            <Plus className="h-4 w-4" />
                            Add
                        </Button>
                    </div>

                    <div className="flex flex-wrap gap-2 pt-4">
                        {data?.skills.map((skill: string) => (
                            <Badge key={skill} variant="secondary" className="px-3 py-1 gap-2 text-sm">
                                {skill}
                                <button
                                    onClick={() => handleRemoveSkill(skill)}
                                    className="hover:text-destructive transition-colors"
                                >
                                    <X className="h-3 w-3" />
                                </button>
                            </Badge>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

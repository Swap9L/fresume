"use client";

import { useEffect, useState } from "react";
import { getResumeData, addEducation, deleteEducation } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Plus, Trash2, GraduationCap } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

export default function EducationPage() {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<any>(null);
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [newEdu, setNewEdu] = useState({
        school: "",
        degree: "",
        start: "",
        end: "",
        href: "",
        logoUrl: ""
    });

    const loadData = async () => {
        const res = await getResumeData();
        if (res) setData(res);
        setLoading(false);
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleAdd = async () => {
        if (!data) return;
        await addEducation(newEdu);
        setIsAddOpen(false);
        setNewEdu({ school: "", degree: "", start: "", end: "", href: "", logoUrl: "" });
        loadData();
    };

    const handleDelete = async (id: string) => {
        if (confirm("Are you sure you want to delete this education entry?")) {
            await deleteEducation(id);
            loadData();
        }
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
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Education</h1>
                    <p className="text-muted-foreground">Manage your academic background.</p>
                </div>
                <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                    <DialogTrigger asChild>
                        <Button className="gap-2">
                            <Plus className="h-4 w-4" />
                            Add Education
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Add Education</DialogTitle>
                            <DialogDescription>Enter the details of your degree or school.</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="school">School/University</Label>
                                <Input id="school" value={newEdu.school} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewEdu({ ...newEdu, school: e.target.value })} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="degree">Degree/Certificate</Label>
                                <Input id="degree" value={newEdu.degree} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewEdu({ ...newEdu, degree: e.target.value })} />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="start">Start Date</Label>
                                    <Input id="start" placeholder="Sept 2021" value={newEdu.start} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewEdu({ ...newEdu, start: e.target.value })} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="end">End Date</Label>
                                    <Input id="end" placeholder="April 2024" value={newEdu.end} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewEdu({ ...newEdu, end: e.target.value })} />
                                </div>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsAddOpen(false)}>Cancel</Button>
                            <Button onClick={handleAdd}>Add Entry</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid gap-4">
                {data?.education.map((edu: any) => (
                    <Card key={edu.id}>
                        <CardContent className="flex items-center justify-between p-6">
                            <div className="flex items-center gap-4">
                                <div className="size-12 rounded-full bg-muted flex items-center justify-center overflow-hidden border">
                                    {edu.logoUrl ? (
                                        <img src={edu.logoUrl} alt={edu.school} className="size-full object-contain p-2" />
                                    ) : (
                                        <GraduationCap className="h-6 w-6 text-muted-foreground" />
                                    )}
                                </div>
                                <div>
                                    <h3 className="font-bold">{edu.school}</h3>
                                    <p className="text-sm text-muted-foreground">{edu.degree}</p>
                                    <p className="text-xs text-muted-foreground mt-1">{edu.start} - {edu.end}</p>
                                </div>
                            </div>
                            <Button variant="ghost" size="icon" onClick={() => handleDelete(edu.id)} className="text-destructive hover:text-destructive hover:bg-destructive/10">
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}

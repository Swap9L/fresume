"use client";

import { useEffect, useState } from "react";
import { getResumeData, addProject, deleteProject } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Plus, Trash2, Globe, Github, ExternalLink } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

export default function ProjectsPage() {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<any>(null);
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [newProject, setNewProject] = useState({
        title: "",
        href: "",
        dates: "",
        active: true,
        description: "",
        technologies: [] as string[],
        image: "",
        video: "",
        links: [] as any[]
    });
    const [techInput, setTechInput] = useState("");

    const loadData = async () => {
        const res = await getResumeData();
        if (res) setData(res);
        setLoading(false);
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleAddTech = () => {
        if (techInput && !newProject.technologies.includes(techInput)) {
            setNewProject({
                ...newProject,
                technologies: [...newProject.technologies, techInput.trim()]
            });
            setTechInput("");
        }
    };

    const handleAdd = async () => {
        if (!data) return;
        await addProject(newProject);
        setIsAddOpen(false);
        setNewProject({
            title: "",
            href: "",
            dates: "",
            active: true,
            description: "",
            technologies: [],
            image: "",
            video: "",
            links: []
        });
        loadData();
    };

    const handleDelete = async (id: string) => {
        if (confirm("Are you sure you want to delete this project?")) {
            await deleteProject(id);
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
                    <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
                    <p className="text-muted-foreground">Showcase your best work.</p>
                </div>
                <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                    <DialogTrigger asChild>
                        <Button className="gap-2">
                            <Plus className="h-4 w-4" />
                            Add Project
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>Add Project</DialogTitle>
                            <DialogDescription>Fill in the details for your new project.</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="title">Project Title</Label>
                                    <Input id="title" value={newProject.title} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewProject({ ...newProject, title: e.target.value })} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="dates">Dates/Year</Label>
                                    <Input id="dates" placeholder="2024" value={newProject.dates} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewProject({ ...newProject, dates: e.target.value })} />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea id="description" rows={3} value={newProject.description} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setNewProject({ ...newProject, description: e.target.value })} />
                            </div>
                            <div className="space-y-2">
                                <Label>Technologies</Label>
                                <div className="flex gap-2">
                                    <Input
                                        placeholder="Add tech (Enter)"
                                        value={techInput}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTechInput(e.target.value)}
                                        onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => e.key === "Enter" && (e.preventDefault(), handleAddTech())}
                                    />
                                    <Button type="button" variant="outline" onClick={handleAddTech}>Add</Button>
                                </div>
                                <div className="flex flex-wrap gap-1 mt-2">
                                    {newProject.technologies.map(tech => (
                                        <Badge key={tech} variant="secondary" className="gap-1">
                                            {tech}
                                            <X className="size-3 cursor-pointer" onClick={() => setNewProject({ ...newProject, technologies: newProject.technologies.filter(t => t !== tech) })} />
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="image">Image Path</Label>
                                    <Input id="image" placeholder="/projects/my-app.png" value={newProject.image} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewProject({ ...newProject, image: e.target.value })} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="href">Project Link</Label>
                                    <Input id="href" placeholder="https://..." value={newProject.href} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewProject({ ...newProject, href: e.target.value })} />
                                </div>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsAddOpen(false)}>Cancel</Button>
                            <Button onClick={handleAdd}>Add Project</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {data?.projects.map((project: any) => (
                    <Card key={project.id} className="overflow-hidden flex flex-col">
                        <div className="aspect-video relative bg-muted">
                            {project.image ? (
                                <img src={project.image} alt={project.title} className="size-full object-cover" />
                            ) : (
                                <div className="size-full flex items-center justify-center text-muted-foreground">No image</div>
                            )}
                        </div>
                        <CardHeader className="p-4 pb-2">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-xl">{project.title}</CardTitle>
                                <Button variant="ghost" size="icon" onClick={() => handleDelete(project.id)} className="text-destructive">
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                            <CardDescription>{project.dates}</CardDescription>
                        </CardHeader>
                        <CardContent className="p-4 pt-0 flex-1">
                            <p className="text-sm text-balance line-clamp-3 mb-4">{project.description}</p>
                            <div className="flex flex-wrap gap-1 mb-4">
                                {project.technologies.map((tech: string) => (
                                    <Badge key={tech} variant="outline" className="text-[10px] px-1.5 py-0">{tech}</Badge>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}

function X({ className, onClick }: { className?: string; onClick?: () => void }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
            onClick={onClick}
        >
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
        </svg>
    );
}

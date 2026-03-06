"use client";

import { useEffect, useState } from "react";
import { getResumeData, updateProfile, deleteAccount } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Loader2, Save, Trash2 } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

export default function ProfilePage() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [data, setData] = useState<any>(null);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [deletePassword, setDeletePassword] = useState("");
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        const loadData = async () => {
            const res = await getResumeData();
            if (res) setData(res);
            setLoading(false);
        };
        loadData();
    }, []);

    const handleSave = async () => {
        if (!data) return;
        setSaving(true);
        await updateProfile(data);
        setSaving(false);
        alert("Profile updated successfully!");
    };

    const handleDeleteAccount = async () => {
        if (!deletePassword) {
            alert("Please enter your password to confirm.");
            return;
        }
        setIsDeleting(true);
        try {
            const res = await deleteAccount(deletePassword);
            if (res && !res.success) {
                alert(res.message);
                setIsDeleting(false);
            }
        } catch (error: any) {
            // Error handling is mostly covered by redirect in server action
            if (error.message !== "NEXT_REDIRECT") {
                alert("An error occurred. Please try again.");
                setIsDeleting(false);
            }
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    if (!data) {
        return (
            <div className="text-center p-8 border rounded-lg bg-muted/20">
                <p>No profile data found. Please run the sync first.</p>
                <Button variant="link" asChild className="mt-2">
                    <a href="/admin/sync">Go to Sync</a>
                </Button>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
                <p className="text-muted-foreground">Manage your personal information and bio.</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Basic Information</CardTitle>
                    <CardDescription>This information will be displayed on the hero section of your site.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Full Name</Label>
                            <Input
                                id="name"
                                value={data.name}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData({ ...data, name: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="initials">Initials</Label>
                            <Input
                                id="initials"
                                value={data.initials}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData({ ...data, initials: e.target.value })}
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="avatarUrl">Avatar URL</Label>
                        <Input
                            id="avatarUrl"
                            value={data.avatarUrl}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData({ ...data, avatarUrl: e.target.value })}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="location">Location</Label>
                            <Input
                                id="location"
                                value={data.location}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData({ ...data, location: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="locationLink">Location Link</Label>
                            <Input
                                id="locationLink"
                                value={data.locationLink}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData({ ...data, locationLink: e.target.value })}
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>About & Bio</CardTitle>
                    <CardDescription>Tell the world about yourself.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="description">Headline</Label>
                        <Input
                            id="description"
                            value={data.description}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData({ ...data, description: e.target.value })}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="summary">Summary (Markdown supported)</Label>
                        <Textarea
                            id="summary"
                            rows={6}
                            value={data.summary}
                            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setData({ ...data, summary: e.target.value })}
                        />
                    </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                    <Button onClick={handleSave} disabled={saving} className="gap-2">
                        {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                        Save Changes
                    </Button>
                </CardFooter>
            </Card>

            <Card className="border-destructive/50 bg-destructive/5">
                <CardHeader>
                    <CardTitle className="text-destructive">Danger Zone</CardTitle>
                    <CardDescription>Permanently delete your account and all associated data.</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                        This action is permanent and cannot be undone. All your projects, education, work experience, and profile data will be permanently removed.
                    </p>
                    <Button
                        variant="destructive"
                        onClick={() => setIsDeleteDialogOpen(true)}
                        className="gap-2"
                    >
                        <Trash2 className="h-4 w-4" />
                        Delete Account
                    </Button>
                </CardContent>
            </Card>

            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Are you absolutely sure?</DialogTitle>
                        <DialogDescription>
                            This action cannot be undone. This will permanently delete your account and remove all your data from our servers.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="password">Confirm with Password</Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="Enter your password"
                                value={deletePassword}
                                onChange={(e) => setDeletePassword(e.target.value)}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setIsDeleteDialogOpen(false)}
                            disabled={isDeleting}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleDeleteAccount}
                            disabled={isDeleting || !deletePassword}
                            className="gap-2"
                        >
                            {isDeleting && <Loader2 className="h-4 w-4 animate-spin" />}
                            Delete Forever
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}

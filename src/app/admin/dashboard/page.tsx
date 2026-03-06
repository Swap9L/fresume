"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
    getResumeData,
    updateProfile,
    addSkill,
    removeSkill,
    addEducation,
    deleteEducation,
    updateEducation,
    addProject,
    deleteProject,
    updateProject,
    upsertContact,
    addSocial,
    deleteSocial,
    updateSocial,
    addWork,
    deleteWork,
    updateWork,
    addHackathon,
    deleteHackathon,
    updateHackathon,
    deleteAccount,
    changeUserPassword,
} from "@/lib/actions";
import { cn } from "@/lib/utils";
import {
    User,
    FileText,
    Zap,
    GraduationCap,
    Briefcase,
    Mail,
    Plus,
    Trash2,
    Save,
    Loader2,
    Eye,
    EyeOff,
    ExternalLink,
    X,
    MapPin,
    Link as LinkIcon,
    LogOut,
    Globe,
    AtSign,
    Phone,
    Pencil, // Added Pencil
    Settings,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

// ─── Types ────────────────────────────────────────────────────────────────────
type Section = "personal" | "summary" | "skills" | "contact" | "education" | "projects" | "work" | "hackathons" | "settings";
type ResumeData = Awaited<ReturnType<typeof getResumeData>>;

// ─── Helpers ──────────────────────────────────────────────────────────────────
const Field = ({
    label,
    value,
    onChange,
    placeholder,
    multiline = false,
}: {
    label: string;
    value: string;
    onChange: (v: string) => void;
    placeholder?: string;
    multiline?: boolean;
}) => (
    <div className="space-y-1.5">
        <label className="text-[11px] font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
            {label}
        </label>
        {multiline ? (
            <textarea
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                rows={5}
                className="w-full px-3.5 py-2.5 text-sm bg-white dark:bg-zinc-900 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-800 transition-all resize-none text-zinc-800 dark:text-zinc-200"
            />
        ) : (
            <input
                type="text"
                value={value || ""}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="w-full px-3.5 py-2 text-sm border border-zinc-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-900/10 dark:bg-zinc-950 transition-all placeholder:text-zinc-400"
            />
        )}
    </div>
);

const SidebarBtn = ({
    icon: Icon,
    label,
    active,
    onClick,
}: {
    icon: any;
    label: string;
    active: boolean;
    onClick: () => void;
}) => (
    <button
        onClick={onClick}
        className={cn(
            "flex items-center w-full gap-3 px-3.5 py-2.5 text-sm font-medium rounded-xl transition-all group",
            active
                ? "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 shadow-md"
                : "text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/50 hover:text-zinc-900 dark:hover:text-zinc-100"
        )}
    >
        <Icon
            className={cn(
                "size-4 shrink-0",
                active ? "text-white dark:text-zinc-900" : "text-zinc-400 dark:text-zinc-500 group-hover:text-zinc-700 dark:text-zinc-300"
            )}
        />
        {label}
    </button>
);

// ─── Preview Component ─────────────────────────────────────────────────────────
const Preview = ({ data }: { data: ResumeData }) => {
    if (!data) return <div className="p-8 text-zinc-400 dark:text-zinc-500 text-sm">No data yet.</div>;
    return (
        <div className="p-8 space-y-8 text-zinc-800 dark:text-zinc-200 text-sm leading-relaxed overflow-y-auto h-full">
            {/* Header */}
            <div className="flex items-center gap-4">
                {data.avatarUrl && (
                    <img
                        src={data.avatarUrl}
                        alt={data.name}
                        className="size-16 rounded-full object-cover border-2 border-zinc-100 dark:border-zinc-800"
                    />
                )}
                <div>
                    <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">{data.name || "Your Name"}</h1>
                    <p className="text-zinc-500 dark:text-zinc-400 text-xs mt-0.5">{data.description}</p>
                    {data.location && (
                        <p className="flex items-center gap-1 text-xs text-zinc-400 dark:text-zinc-500 mt-1">
                            <MapPin className="size-3" /> {data.location}
                        </p>
                    )}
                </div>
            </div>

            {/* Summary */}
            {data.summary && (
                <div>
                    <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-2">About</h3>
                    <p className="text-zinc-600 dark:text-zinc-400 text-xs">{data.summary}</p>
                </div>
            )}

            {/* Skills */}
            {data.skills.length > 0 && (
                <div>
                    <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-2">Skills</h3>
                    <div className="flex flex-wrap gap-1.5">
                        {data.skills.map((s) => (
                            <span key={s} className="px-2 py-0.5 text-[10px] font-medium bg-zinc-100 dark:bg-zinc-800/50 text-zinc-700 dark:text-zinc-300 rounded-full">
                                {s}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {/* Education */}
            {data.education.length > 0 && (
                <div>
                    <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-2">Education</h3>
                    <div className="space-y-2">
                        {data.education.map((edu) => (
                            <div key={edu.id} className="border border-zinc-100 dark:border-zinc-800 rounded-lg p-3">
                                <p className="font-semibold text-xs text-zinc-900 dark:text-zinc-100">{edu.school}</p>
                                <p className="text-zinc-500 dark:text-zinc-400 text-[10px]">{edu.degree}</p>
                                <p className="text-zinc-400 dark:text-zinc-500 text-[10px]">{edu.start} – {edu.end}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Projects */}
            {data.projects.length > 0 && (
                <div>
                    <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-2">Projects</h3>
                    <div className="space-y-2">
                        {data.projects.map((p) => (
                            <div key={p.id} className="border border-zinc-100 dark:border-zinc-800 rounded-lg p-3">
                                <div className="flex items-center justify-between">
                                    <p className="font-semibold text-xs text-zinc-900 dark:text-zinc-100">{p.title}</p>
                                    <p className="text-zinc-400 dark:text-zinc-500 text-[10px]">{p.dates}</p>
                                </div>
                                <p className="text-zinc-500 dark:text-zinc-400 text-[10px] mt-1 line-clamp-2">{p.description}</p>
                                {p.technologies.length > 0 && (
                                    <div className="flex flex-wrap gap-1 mt-1.5">
                                        {p.technologies.slice(0, 4).map((t) => (
                                            <span key={t} className="px-1.5 py-0 text-[9px] font-medium border border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400 rounded-full">
                                                {t}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

// ─── Main Dashboard ───────────────────────────────────────────────────────────
export default function AdminDashboard() {
    const router = useRouter();
    const [data, setData] = useState<ResumeData>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [section, setSection] = useState<Section>("personal");
    const [showPreview, setShowPreview] = useState(true);

    const syncChannel = useRef<BroadcastChannel | null>(null);

    useEffect(() => {
        if (typeof window !== "undefined" && "BroadcastChannel" in window) {
            syncChannel.current = new BroadcastChannel("resume-sync");
        }
        return () => syncChannel.current?.close();
    }, []);

    const pulseSync = () => {
        syncChannel.current?.postMessage("refresh");
    };

    // Education dialog state
    const [newEdu, setNewEdu] = useState({ school: "", degree: "", start: "", end: "", href: "", logoUrl: "https://avatar.vercel.sh/school" });
    const [addingEdu, setAddingEdu] = useState(false);
    const [editingEduId, setEditingEduId] = useState<string | null>(null);

    // Project dialog state
    interface ProjectState {
        title: string;
        href: string;
        dates: string;
        active: boolean;
        description: string;
        technologies: string[];
        image: string;
        video: string;
        source: string;
        links: any[];
    }
    const [newProj, setNewProj] = useState<ProjectState>({
        title: "", href: "", dates: "", active: true,
        description: "", technologies: [], image: "https://avatar.vercel.sh/project", video: "",
        source: "", links: []
    });
    const [techInput, setTechInput] = useState("");
    const [addingProj, setAddingProj] = useState(false);
    const [editingProjId, setEditingProjId] = useState<string | null>(null);

    // Work dialog state
    const [newWork, setNewWork] = useState({ company: "", title: "", location: "", description: "", start: "", end: "", href: "", logoUrl: "https://avatar.vercel.sh/work", badges: [] as string[] });
    const [addingWork, setAddingWork] = useState(false);
    const [editingWorkId, setEditingWorkId] = useState<string | null>(null);

    // Hackathon dialog state
    const [newHackathon, setNewHackathon] = useState({ title: "", location: "", description: "", dates: "", image: "https://avatar.vercel.sh/hackathon", links: [] as any[] });
    const [addingHackathon, setAddingHackathon] = useState(false);
    const [editingHackathonId, setEditingHackathonId] = useState<string | null>(null);

    // Skill state
    const [newSkill, setNewSkill] = useState("");

    // Contact / Socials
    const [contactEmail, setContactEmail] = useState("");
    const [contactTel, setContactTel] = useState("");
    const [savingContact, setSavingContact] = useState(false);
    const [addingSocial, setAddingSocial] = useState(false);
    const [editingSocialId, setEditingSocialId] = useState<string | null>(null); // Added editingSocialId
    const [newSocial, setNewSocial] = useState({ name: "", url: "", iconName: "", navbar: false }); // Changed navbar default to false

    // Account Settings state
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [deletePassword, setDeletePassword] = useState("");
    const [isDeleting, setIsDeleting] = useState(false);

    const [isResetPasswordOpen, setIsResetPasswordOpen] = useState(false);
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");
    const [isResetting, setIsResetting] = useState(false);

    const load = useCallback(async (quiet = false) => {
        if (!quiet) setLoading(true);
        const res = await getResumeData();
        setData(res);
        if (!quiet) setLoading(false);
    }, []);

    useEffect(() => { load(); }, [load]);

    // Sync contact fields from loaded data
    useEffect(() => {
        if (data?.contact) {
            setContactEmail(data.contact.email || "");
            setContactTel(data.contact.tel || "");
        }
    }, [data]);

    const handleSaveProfile = async () => {
        if (!data) return;
        setSaving(true);
        try {
            await updateProfile(data);
            pulseSync();
        } catch (e) { console.error(e); }
        setSaving(false);
    };

    const handleAddSkill = async () => {
        const s = newSkill.trim();
        if (!s || !data) return;
        if (data.skills.includes(s)) { alert("Skill already exists!"); return; }
        setData({ ...data, skills: [...data.skills, s] });
        setNewSkill("");
        await addSkill(s);
        pulseSync();
        load(true);
    };

    const handleRemoveSkill = async (skill: string) => {
        if (!data) return;
        setData({ ...data, skills: data.skills.filter((s) => s !== skill) });
        await removeSkill(skill);
        pulseSync();
        load(true);
    };

    const handleAddEducation = async () => {
        if (!newEdu.school || !newEdu.degree || !data) return;
        if (editingEduId) {
            setData({ ...data, education: data.education.map(e => e.id === editingEduId ? { ...e, ...newEdu } as any : e) });
            await updateEducation(editingEduId, newEdu);
        } else {
            const tempId = Date.now().toString();
            setData({ ...data, education: [...data.education, { ...newEdu, id: tempId, resumeDataId: data.id } as any] });
            await addEducation(newEdu);
        }
        pulseSync();
        setAddingEdu(false);
        setEditingEduId(null);
        setNewEdu({ school: "", degree: "", start: "", end: "", href: "", logoUrl: "https://avatar.vercel.sh/school" });
        load(true);
    };

    const handleEditEducation = (edu: any) => {
        setNewEdu({
            school: edu.school,
            degree: edu.degree,
            start: edu.start,
            end: edu.end,
            href: edu.href,
            logoUrl: edu.logoUrl
        });
        setEditingEduId(edu.id);
        setAddingEdu(true);
    };

    const handleDeleteEducation = async (id: string) => {
        if (!confirm("Delete this education entry?")) return;
        if (data) setData({ ...data, education: data.education.filter(e => e.id !== id) } as any);
        await deleteEducation(id);
        pulseSync();
        load(true);
    };

    const handleAddProject = async () => {
        if (!newProj.title || !data) return;

        // Prepare links from explicit fields
        const links = [];
        if (newProj.source) links.push({ type: "Source", href: newProj.source, iconName: "github" });

        const projectToSave = { ...newProj, links };

        if (editingProjId) {
            setData({ ...data, projects: data.projects.map(p => p.id === editingProjId ? { ...p, ...projectToSave } as any : p) });
            await updateProject(editingProjId, projectToSave);
        } else {
            const tempId = Date.now().toString();
            setData({ ...data, projects: [...data.projects, { ...projectToSave, id: tempId, resumeDataId: data.id } as any] });
            await addProject(projectToSave);
        }
        pulseSync();
        setAddingProj(false);
        setEditingProjId(null);
        setNewProj({ title: "", href: "", dates: "", active: true, description: "", technologies: [], image: "https://avatar.vercel.sh/project", video: "", source: "", links: [] });
        load(true);
    };

    const handleEditProject = (proj: any) => {
        const sourceLink = proj.links?.find((l: any) => l.type === "Source")?.href || "";

        setNewProj({
            title: proj.title,
            href: proj.href,
            dates: proj.dates,
            active: proj.active,
            description: proj.description,
            technologies: proj.technologies,
            image: proj.image,
            video: proj.video,
            source: sourceLink,
            links: proj.links
        });
        setEditingProjId(proj.id);
        setAddingProj(true);
    };

    const handleDeleteProject = async (id: string) => {
        if (!confirm("Delete this project?")) return;
        if (data) setData({ ...data, projects: data.projects.filter(p => p.id !== id) } as any);
        await deleteProject(id);
        pulseSync();
        load(true);
    };

    const handleAddWork = async () => {
        if (!newWork.company || !newWork.title || !data) return;
        if (editingWorkId) {
            setData({ ...data, work: data.work.map(w => w.id === editingWorkId ? { ...w, ...newWork } as any : w) });
            await updateWork(editingWorkId, newWork);
        } else {
            const tempId = Date.now().toString();
            setData({ ...data, work: [...data.work, { ...newWork, id: tempId, resumeDataId: data.id } as any] });
            await addWork(newWork);
        }
        pulseSync();
        setAddingWork(false);
        setEditingWorkId(null);
        setNewWork({ company: "", title: "", location: "", description: "", start: "", end: "", href: "", logoUrl: "https://avatar.vercel.sh/work", badges: [] });
        load(true);
    };

    const handleEditWork = (w: any) => {
        setNewWork({
            company: w.company,
            title: w.title,
            location: w.location,
            description: w.description,
            start: w.start,
            end: w.end,
            href: w.href,
            logoUrl: w.logoUrl,
            badges: w.badges
        });
        setEditingWorkId(w.id);
        setAddingWork(true);
    };

    const handleDeleteWork = async (id: string) => {
        if (!confirm("Delete this work experience?")) return;
        if (data) setData({ ...data, work: data.work.filter(w => w.id !== id) } as any);
        await deleteWork(id);
        pulseSync();
        load(true);
    };

    const handleAddHackathon = async () => {
        if (!newHackathon.title || !data) return;
        if (editingHackathonId) {
            setData({ ...data, hackathons: data.hackathons.map(h => h.id === editingHackathonId ? { ...h, ...newHackathon } as any : h) });
            await updateHackathon(editingHackathonId, newHackathon);
        } else {
            const tempId = Date.now().toString();
            setData({ ...data, hackathons: [...data.hackathons, { ...newHackathon, id: tempId, resumeDataId: data.id } as any] });
            await addHackathon(newHackathon);
        }
        pulseSync();
        setAddingHackathon(false);
        setEditingHackathonId(null);
        setNewHackathon({ title: "", location: "", description: "", dates: "", image: "https://avatar.vercel.sh/hackathon", links: [] });
        load(true);
    };

    const handleEditHackathon = (h: any) => {
        setNewHackathon({
            title: h.title,
            location: h.location,
            description: h.description,
            dates: h.dates,
            image: h.image,
            links: h.links
        });
        setEditingHackathonId(h.id);
        setAddingHackathon(true);
    };

    const handleDeleteHackathon = async (id: string) => {
        if (!confirm("Delete this hackathon?")) return;
        if (data) setData({ ...data, hackathons: data.hackathons.filter(h => h.id !== id) } as any);
        await deleteHackathon(id);
        pulseSync();
        load(true);
    };

    const handleLogout = async () => {
        await authClient.signOut({ fetchOptions: { onSuccess: () => router.push("/auth/login") } });
    };

    const handleSaveContact = async () => {
        setSavingContact(true);
        if (data) setData({ ...data, contact: { ...data.contact, email: contactEmail, tel: contactTel, resumeDataId: data.id, id: data.contact?.id || '', socials: data.contact?.socials || [] } } as any);
        try {
            await upsertContact({ email: contactEmail, tel: contactTel });
            pulseSync();
        } catch (e) { console.error(e); }
        setSavingContact(false);
        load(true);
    };

    const handleAddSocial = async () => {
        if (!newSocial.name || !newSocial.url || !data) return;
        if (editingSocialId) {
            setData({ ...data, contact: { ...data.contact!, socials: data.contact!.socials.map(s => s.id === editingSocialId ? { ...s, ...newSocial } : s) } } as any);
            await updateSocial(editingSocialId, newSocial);
        } else {
            const tempId = Date.now().toString();
            setData({ ...data, contact: { ...data.contact!, socials: [...(data.contact?.socials || []), { ...newSocial, id: tempId, contactId: data.contact?.id || '' }] } } as any);
            await addSocial(newSocial);
        }
        pulseSync();
        setAddingSocial(false);
        setEditingSocialId(null);
        setNewSocial({ name: "", url: "", iconName: "", navbar: false });
        load(true);
    };

    const handleEditSocial = (social: any) => {
        setNewSocial({
            name: social.name,
            url: social.url,
            iconName: social.iconName,
            navbar: social.navbar
        });
        setEditingSocialId(social.id);
        setAddingSocial(true);
    };

    const handleDeleteSocial = async (id: string) => {
        if (!confirm("Delete this social link?")) return;
        try {
            if (data && data.contact) setData({ ...data, contact: { ...data.contact, socials: data.contact.socials.filter(s => s.id !== id) } } as any);
            await deleteSocial(id);
            pulseSync();
            load(true);
        } catch (error) {
            console.error(error);
            alert("Failed to delete social link.");
            load(true);
        }
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
            if (error.message !== "NEXT_REDIRECT") {
                alert("An error occurred. Please try again.");
                setIsDeleting(false);
            }
        }
    };

    const handleResetPassword = async () => {
        if (!currentPassword || !newPassword || !confirmNewPassword) {
            alert("Please fill in all password fields.");
            return;
        }
        if (newPassword !== confirmNewPassword) {
            alert("New passwords do not match.");
            return;
        }
        setIsResetting(true);
        const res = await changeUserPassword(currentPassword, newPassword);
        if (res.success) {
            alert("Password updated successfully!");
            setIsResetPasswordOpen(false);
            setCurrentPassword("");
            setNewPassword("");
            setConfirmNewPassword("");
        } else {
            alert(res.message);
        }
        setIsResetting(false);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full min-h-[60vh]">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="size-8 animate-spin text-zinc-400 dark:text-zinc-500" />
                    <p className="text-sm text-zinc-400 dark:text-zinc-500">Loading your portfolio data…</p>
                </div>
            </div>
        );
    }

    const navItems: { id: Section; label: string; icon: any }[] = [
        { id: "personal", label: "Personal Info", icon: User },
        { id: "summary", label: "About & Bio", icon: FileText },
        { id: "skills", label: "Skills", icon: Zap },
        { id: "work", label: "Work Experience", icon: Briefcase },
        { id: "education", label: "Education", icon: GraduationCap },
        { id: "hackathons", label: "Hackathons", icon: MapPin },
        { id: "projects", label: "Projects", icon: Globe },
        { id: "contact", label: "Contact", icon: Mail },
    ];

    return (
        <div className="flex h-full bg-zinc-50 dark:bg-zinc-950 overflow-hidden">
            {/* ── Inner Sidebar ── */}
            <aside className="w-56 bg-white dark:bg-zinc-900 dark:bg-zinc-800/50 border-r border-zinc-200 dark:border-zinc-800 flex flex-col shrink-0">
                <div className="p-4 border-b border-zinc-100 dark:border-zinc-800">
                    <p className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">Sections</p>
                </div>
                <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
                    {navItems.map((item) => (
                        <SidebarBtn
                            key={item.id}
                            icon={item.icon}
                            label={item.label}
                            active={section === item.id}
                            onClick={() => setSection(item.id)}
                        />
                    ))}
                </nav>
                <div className="p-3 border-t border-zinc-100 dark:border-zinc-800 space-y-1">
                    <a
                        href="/admin/sync"
                        className="flex items-center gap-3 w-full px-3.5 py-2.5 text-sm font-medium rounded-xl text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:bg-zinc-800/50 hover:text-zinc-900 dark:text-zinc-100 transition-all"
                    >
                        <LinkIcon className="size-4" /> Sync Default Data
                    </a>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-full px-3.5 py-2.5 text-sm font-medium rounded-xl text-red-400 hover:bg-red-50 dark:hover:bg-red-950/50 hover:text-red-600 transition-all"
                    >
                        <LogOut className="size-4" /> Sign Out
                    </button>
                    <SidebarBtn
                        icon={Settings}
                        label="Account Settings"
                        active={section === "settings"}
                        onClick={() => setSection("settings")}
                    />
                </div>
            </aside>

            {/* ── Editor ── */}
            <main className="flex-1 overflow-y-auto">
                <div className="p-8 max-w-2xl mx-auto space-y-6">
                    {/* Section: Personal */}
                    <AnimatePresence mode="wait">
                        {section === "personal" && (
                            <motion.div key="personal" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-5">
                                <div>
                                    <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">Personal Information</h2>
                                    <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">Your public profile details.</p>
                                </div>
                                <div className="bg-white dark:bg-zinc-900 dark:bg-zinc-800/50 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6 space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <Field label="Full Name" value={data?.name || ""} onChange={(v) => setData({ ...data!, name: v })} placeholder="Jane Doe" />
                                        <Field label="Initials" value={data?.initials || ""} onChange={(v) => setData({ ...data!, initials: v })} placeholder="JD" />
                                    </div>
                                    <Field label="Avatar URL" value={data?.avatarUrl || ""} onChange={(v) => setData({ ...data!, avatarUrl: v })} placeholder="https://…" />
                                    <Field label="Website / GitHub URL" value={data?.url || ""} onChange={(v) => setData({ ...data!, url: v })} placeholder="https://github.com/you" />
                                    <div className="grid grid-cols-2 gap-4">
                                        <Field label="Location" value={data?.location || ""} onChange={(v) => setData({ ...data!, location: v })} placeholder="City, Country" />
                                        <Field label="Location Link" value={data?.locationLink || ""} onChange={(v) => setData({ ...data!, locationLink: v })} placeholder="https://maps.google.com/…" />
                                    </div>
                                    <Field label="Headline / Description" value={data?.description || ""} onChange={(v) => setData({ ...data!, description: v })} placeholder="Full Stack Developer at…" />
                                </div>
                                <SaveButton onClick={handleSaveProfile} saving={saving} />
                            </motion.div>
                        )}

                        {/* Section: Summary */}
                        {section === "summary" && (
                            <motion.div key="summary" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-5">
                                <div>
                                    <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">About & Bio</h2>
                                    <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">Your longer introduction text.</p>
                                </div>
                                <div className="bg-white dark:bg-zinc-900 dark:bg-zinc-800/50 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6">
                                    <Field label="Summary" value={data?.summary || ""} onChange={(v) => setData({ ...data!, summary: v })} placeholder="Write a short bio…" multiline />
                                </div>
                                <SaveButton onClick={handleSaveProfile} saving={saving} />
                            </motion.div>
                        )}

                        {/* Section: Skills */}
                        {section === "skills" && (
                            <motion.div key="skills" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-5">
                                <div>
                                    <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">Skills</h2>
                                    <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">Add or remove technologies.</p>
                                </div>
                                <div className="bg-white dark:bg-zinc-900 dark:bg-zinc-800/50 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6 space-y-5">
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={newSkill}
                                            onChange={(e) => setNewSkill(e.target.value)}
                                            onKeyDown={(e) => e.key === "Enter" && handleAddSkill()}
                                            placeholder="Add a skill (e.g. Rust, Go…)"
                                            className="flex-1 px-3.5 py-2.5 text-sm bg-white dark:bg-zinc-900 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-800 transition-all"
                                        />
                                        <button
                                            onClick={handleAddSkill}
                                            className="flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-xl hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-all"
                                        >
                                            <Plus className="size-4" /> Add
                                        </button>
                                    </div>
                                    <div className="flex flex-wrap gap-2 min-h-[3rem]">
                                        {data?.skills.map((skill) => (
                                            <span key={skill} className="flex items-center gap-1.5 px-3 py-1 text-sm font-medium bg-zinc-100 dark:bg-zinc-800/50 text-zinc-700 dark:text-zinc-300 rounded-full group">
                                                {skill}
                                                <button onClick={() => handleRemoveSkill(skill)} className="text-zinc-400 dark:text-zinc-500 hover:text-red-500 transition-colors">
                                                    <X className="size-3" />
                                                </button>
                                            </span>
                                        ))}
                                        {!data?.skills.length && (
                                            <p className="text-sm text-zinc-400 dark:text-zinc-500">No skills added yet.</p>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* Section: Contact */}
                        {section === "contact" && (
                            <motion.div key="contact" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-5">
                                <div>
                                    <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">Contact</h2>
                                    <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">Email, phone, and social links shown on your portfolio.</p>
                                </div>

                                {/* Email + Phone */}
                                <div className="bg-white dark:bg-zinc-900 dark:bg-zinc-800/50 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6 space-y-4">
                                    <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">Basic Contact</p>
                                    <div className="grid grid-cols-2 gap-4">
                                        <Field
                                            label="Email"
                                            value={contactEmail}
                                            onChange={setContactEmail}
                                            placeholder="you@example.com"
                                        />
                                        <Field
                                            label="Phone"
                                            value={contactTel}
                                            onChange={setContactTel}
                                            placeholder="+1 234 567 8900"
                                        />
                                    </div>
                                    <button
                                        onClick={handleSaveContact}
                                        disabled={savingContact}
                                        className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-xl hover:bg-zinc-800 dark:hover:bg-zinc-200 disabled:opacity-60 transition-all"
                                    >
                                        {savingContact ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
                                        {savingContact ? "Saving…" : "Save Contact"}
                                    </button>
                                </div>

                                {/* Social Links */}
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">Social Links</p>
                                        <button
                                            onClick={() => setAddingSocial(!addingSocial)}
                                            className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-xl hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-all"
                                        >
                                            <Plus className="size-4" /> Add
                                        </button>
                                    </div>

                                    <AnimatePresence>
                                        {addingSocial && (
                                            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="bg-white dark:bg-zinc-900 dark:bg-zinc-800/50 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6 space-y-4 overflow-hidden">
                                                <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">New Social Link</p>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <Field label="Display Name" value={newSocial.name} onChange={(v) => setNewSocial({ ...newSocial, name: v })} placeholder="GitHub" />
                                                    <Field label="Icon Key" value={newSocial.iconName} onChange={(v) => setNewSocial({ ...newSocial, iconName: v })} placeholder="github, linkedin, x…" />
                                                </div>
                                                <Field label="URL" value={newSocial.url} onChange={(v) => setNewSocial({ ...newSocial, url: v })} placeholder="https://github.com/you" />
                                                <label className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400 cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        checked={newSocial.navbar}
                                                        onChange={(e) => setNewSocial({ ...newSocial, navbar: e.target.checked })}
                                                        className="rounded"
                                                    />
                                                    Show in navigation dock
                                                </label>
                                                <div className="flex gap-2 justify-end">
                                                    <button onClick={() => { setAddingSocial(false); setEditingSocialId(null); setNewSocial({ name: "", url: "", iconName: "", navbar: false }); }} className="px-4 py-2 text-sm rounded-xl border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:bg-zinc-950 transition-all">Cancel</button>
                                                    <button onClick={handleAddSocial} className="px-4 py-2 text-sm font-medium bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-xl hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-all">{editingSocialId ? "Update Link" : "Save Link"}</button>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    <div className="space-y-2">
                                        {data?.contact?.socials?.map((social: any) => (
                                            <div key={social.id} className="flex items-center justify-between bg-white dark:bg-zinc-900 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 gap-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="size-9 rounded-xl bg-zinc-100 dark:bg-zinc-800/50 flex items-center justify-center">
                                                        <Globe className="size-4 text-zinc-500 dark:text-zinc-400" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">{social.name}</p>
                                                        <p className="text-xs text-zinc-400 dark:text-zinc-500 truncate max-w-[200px]">{social.url}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2 shrink-0">
                                                    {social.navbar && (
                                                        <span className="text-[10px] px-2 py-0.5 bg-zinc-100 dark:bg-zinc-800/50 text-zinc-600 dark:text-zinc-400 rounded-full font-medium">In Dock</span>
                                                    )}
                                                    <a href={social.url} target="_blank" rel="noreferrer" className="p-1.5 rounded-lg text-zinc-400 dark:text-zinc-500 hover:text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:bg-zinc-800/50 transition-all">
                                                        <ExternalLink className="size-3.5" />
                                                    </a>
                                                    <button onClick={() => handleEditSocial(social)} className="p-1.5 rounded-lg text-zinc-400 dark:text-zinc-500 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/50 transition-all">
                                                        <Pencil className="size-3.5" />
                                                    </button>
                                                    <button onClick={() => handleDeleteSocial(social.id)} className="p-1.5 rounded-lg text-zinc-400 dark:text-zinc-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/50 transition-all">
                                                        <Trash2 className="size-3.5" />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                        {!data?.contact?.socials?.length && !addingSocial && (
                                            <div className="flex flex-col items-center justify-center p-10 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl text-zinc-400 dark:text-zinc-500">
                                                <AtSign className="size-6 mb-2" />
                                                <p className="text-sm">No social links yet</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* Section: Education */}
                        {section === "education" && (
                            <motion.div key="education" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-5">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">Education</h2>
                                        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">Your academic background.</p>
                                    </div>
                                    <button
                                        onClick={() => {
                                            setAddingEdu(!addingEdu);
                                            setEditingEduId(null);
                                            setNewEdu({ school: "", degree: "", start: "", end: "", href: "", logoUrl: "https://avatar.vercel.sh/school" });
                                        }}
                                        className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-xl hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-all"
                                    >
                                        <Plus className="size-4" /> Add
                                    </button>
                                </div>

                                {/* Add Form */}
                                <AnimatePresence>
                                    {addingEdu && (
                                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="bg-white dark:bg-zinc-900 dark:bg-zinc-800/50 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6 space-y-4 overflow-hidden">
                                            <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">{editingEduId ? 'Edit Education Entry' : 'New Education Entry'}</p>
                                            <Field label="School / University" value={newEdu.school} onChange={(v) => setNewEdu({ ...newEdu, school: v })} placeholder="MIT" />
                                            <Field label="Degree" value={newEdu.degree} onChange={(v) => setNewEdu({ ...newEdu, degree: v })} placeholder="B.Sc. Computer Science" />
                                            <div className="grid grid-cols-2 gap-4">
                                                <Field label="Start" value={newEdu.start} onChange={(v) => setNewEdu({ ...newEdu, start: v })} placeholder="Sept 2021" />
                                                <Field label="End" value={newEdu.end} onChange={(v) => setNewEdu({ ...newEdu, end: v })} placeholder="May 2025" />
                                            </div>
                                            <Field label="Logo URL (optional)" value={newEdu.logoUrl} onChange={(v) => setNewEdu({ ...newEdu, logoUrl: v })} />
                                            <div className="flex gap-2 justify-end">
                                                <button onClick={() => { setAddingEdu(false); setEditingEduId(null); setNewEdu({ school: "", degree: "", start: "", end: "", href: "", logoUrl: "https://avatar.vercel.sh/school" }); }} className="px-4 py-2 text-sm rounded-xl border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:bg-zinc-950 transition-all">Cancel</button>
                                                <button onClick={handleAddEducation} className="px-4 py-2 text-sm font-medium bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-xl hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-all">{editingEduId ? 'Update Entry' : 'Save Entry'}</button>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {/* List */}
                                <div className="space-y-3">
                                    {data?.education.map((edu) => (
                                        <div key={edu.id} className="flex items-center justify-between bg-white dark:bg-zinc-900 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 gap-4">
                                            <div className="flex items-center gap-3">
                                                <div className="size-10 rounded-full bg-zinc-100 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center overflow-hidden shrink-0">
                                                    {edu.logoUrl ? <img src={edu.logoUrl} alt="" className="size-full object-contain p-1" /> : <GraduationCap className="size-4 text-zinc-400 dark:text-zinc-500" />}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">{edu.school}</p>
                                                    <p className="text-xs text-zinc-500 dark:text-zinc-400">{edu.degree}</p>
                                                    <p className="text-[11px] text-zinc-400 dark:text-zinc-500">{edu.start} – {edu.end}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <button onClick={() => handleEditEducation(edu)} className="p-2 rounded-xl text-zinc-400 dark:text-zinc-500 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/50 transition-all">
                                                    <Pencil className="size-4" />
                                                </button>
                                                <button onClick={() => handleDeleteEducation(edu.id)} className="p-2 rounded-xl text-zinc-400 dark:text-zinc-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/50 transition-all">
                                                    <Trash2 className="size-4" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                    {!data?.education.length && !addingEdu && (
                                        <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl text-zinc-400 dark:text-zinc-500">
                                            <GraduationCap className="size-8 mb-2" />
                                            <p className="text-sm">No education entries yet</p>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        )}

                        {/* Section: Work Experience */}
                        {section === "work" && (
                            <motion.div key="work" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-5">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">Work Experience</h2>
                                        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">Where you have worked.</p>
                                    </div>
                                    <button
                                        onClick={() => {
                                            setAddingWork(true);
                                            setEditingWorkId(null);
                                            setNewWork({ company: "", title: "", location: "", description: "", start: "", end: "", href: "", logoUrl: "https://avatar.vercel.sh/work", badges: [] });
                                        }}
                                        className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-xl hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-all"
                                    >
                                        <Plus className="size-4" /> Add Experience
                                    </button>
                                </div>

                                <AnimatePresence>
                                    {addingWork && (
                                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="bg-white dark:bg-zinc-900 dark:bg-zinc-100 dark:bg-zinc-800/50 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6 space-y-4 overflow-hidden">
                                            <div className="grid grid-cols-2 gap-4">
                                                <Field label="Company" value={newWork.company} onChange={(v) => setNewWork({ ...newWork, company: v })} placeholder="Acme Corp" />
                                                <Field label="Job Title" value={newWork.title} onChange={(v) => setNewWork({ ...newWork, title: v })} placeholder="Software Engineer" />
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <Field label="Start Date" value={newWork.start} onChange={(v) => setNewWork({ ...newWork, start: v })} placeholder="Jan 2020" />
                                                <Field label="End Date" value={newWork.end} onChange={(v) => setNewWork({ ...newWork, end: v })} placeholder="Present" />
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <Field label="Location" value={newWork.location} onChange={(v) => setNewWork({ ...newWork, location: v })} placeholder="Remote" />
                                                <Field label="Website URL" value={newWork.href} onChange={(v) => setNewWork({ ...newWork, href: v })} placeholder="https://..." />
                                            </div>
                                            <Field label="Logo URL" value={newWork.logoUrl} onChange={(v) => setNewWork({ ...newWork, logoUrl: v })} placeholder="https://..." />
                                            <Field label="Description" value={newWork.description} onChange={(v) => setNewWork({ ...newWork, description: v })} placeholder="Descibe what you did..." multiline />
                                            <div className="flex gap-2 justify-end">
                                                <button onClick={() => { setAddingWork(false); setEditingWorkId(null); setNewWork({ company: "", title: "", location: "", description: "", start: "", end: "", href: "", logoUrl: "https://avatar.vercel.sh/work", badges: [] }); }} className="px-4 py-2 text-sm rounded-xl border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:bg-zinc-950 transition-all">Cancel</button>
                                                <button onClick={handleAddWork} className="px-4 py-2 text-sm font-medium bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-xl hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-all">{editingWorkId ? 'Update Work' : 'Save Work'}</button>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                <div className="space-y-3">
                                    {data?.work.map((w) => (
                                        <div key={w.id} className="flex items-start justify-between bg-white dark:bg-zinc-900 dark:bg-zinc-100 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 gap-4">
                                            <div>
                                                <p className="font-semibold text-zinc-900 dark:text-zinc-100 text-sm">{w.title} @ <span className="text-zinc-600 dark:text-zinc-400">{w.company}</span></p>
                                                <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-1">{w.start} – {w.end}</p>
                                                <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-2 line-clamp-2">{w.description}</p>
                                            </div>
                                            <div className="flex items-center gap-1.5 shrink-0">
                                                <button onClick={() => handleEditWork(w)} className="p-1.5 rounded-lg text-zinc-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/50 transition-all">
                                                    <Pencil className="size-4" />
                                                </button>
                                                <button onClick={() => handleDeleteWork(w.id)} className="p-1.5 rounded-lg text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/50 transition-all">
                                                    <Trash2 className="size-4" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                    {!data?.work.length && !addingWork && (
                                        <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl text-zinc-400 dark:text-zinc-500">
                                            <Briefcase className="size-8 mb-2" />
                                            <p className="text-sm">No work experience added</p>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        )}

                        {/* Section: Hackathons */}
                        {section === "hackathons" && (
                            <motion.div key="hackathons" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-5">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">Hackathons</h2>
                                        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">Events and competitions you participated in.</p>
                                    </div>
                                    <button
                                        onClick={() => {
                                            setAddingHackathon(true);
                                            setEditingHackathonId(null);
                                            setNewHackathon({ title: "", location: "", description: "", dates: "", image: "https://avatar.vercel.sh/hackathon", links: [] });
                                        }}
                                        className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-xl hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-all"
                                    >
                                        <Plus className="size-4" /> Add Hackathon
                                    </button>
                                </div>

                                <AnimatePresence>
                                    {addingHackathon && (
                                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="bg-white dark:bg-zinc-900 dark:bg-zinc-100 dark:bg-zinc-800/50 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6 space-y-4 overflow-hidden">
                                            <div className="grid grid-cols-2 gap-4">
                                                <Field label="Title" value={newHackathon.title} onChange={(v) => setNewHackathon({ ...newHackathon, title: v })} placeholder="Global Hack 2023" />
                                                <Field label="Dates" value={newHackathon.dates} onChange={(v) => setNewHackathon({ ...newHackathon, dates: v })} placeholder="Nov 1st - 3rd" />
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <Field label="Location" value={newHackathon.location} onChange={(v) => setNewHackathon({ ...newHackathon, location: v })} placeholder="San Francisco, CA" />
                                                <Field label="Image URL" value={newHackathon.image} onChange={(v) => setNewHackathon({ ...newHackathon, image: v })} placeholder="https://..." />
                                            </div>
                                            <Field label="Description" value={newHackathon.description} onChange={(v) => setNewHackathon({ ...newHackathon, description: v })} placeholder="Built a cool project..." multiline />

                                            <div className="flex gap-2 justify-end">
                                                <button onClick={() => { setAddingHackathon(false); setEditingHackathonId(null); setNewHackathon({ title: "", location: "", description: "", dates: "", image: "https://avatar.vercel.sh/hackathon", links: [] }); }} className="px-4 py-2 text-sm rounded-xl border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:bg-zinc-950 transition-all">Cancel</button>
                                                <button onClick={handleAddHackathon} className="px-4 py-2 text-sm font-medium bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-xl hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-all">{editingHackathonId ? 'Update Hackathon' : 'Save Hackathon'}</button>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                <div className="space-y-3">
                                    {data?.hackathons.map((h) => (
                                        <div key={h.id} className="flex items-start justify-between bg-white dark:bg-zinc-900 dark:bg-zinc-100 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 gap-4">
                                            <div>
                                                <p className="font-semibold text-zinc-900 dark:text-zinc-100 text-sm">{h.title}</p>
                                                <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-1">{h.dates} | {h.location}</p>
                                                <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-2 line-clamp-2">{h.description}</p>
                                            </div>
                                            <div className="flex items-center gap-1.5 shrink-0">
                                                <button onClick={() => handleEditHackathon(h)} className="p-1.5 rounded-lg text-zinc-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/50 transition-all">
                                                    <Pencil className="size-4" />
                                                </button>
                                                <button onClick={() => handleDeleteHackathon(h.id)} className="p-1.5 rounded-lg text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/50 transition-all">
                                                    <Trash2 className="size-4" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                    {!data?.hackathons.length && !addingHackathon && (
                                        <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl text-zinc-400 dark:text-zinc-500">
                                            <MapPin className="size-8 mb-2" />
                                            <p className="text-sm">No hackathons added</p>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        )}


                        {/* Section: Projects */}
                        {section === "projects" && (
                            <motion.div key="projects" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-5">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">Projects</h2>
                                        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">Showcase your work.</p>
                                    </div>
                                    <button
                                        onClick={() => {
                                            setAddingProj(!addingProj);
                                            setEditingProjId(null);
                                            setNewProj({ title: "", href: "", dates: "", active: true, description: "", technologies: [], image: "https://avatar.vercel.sh/project", video: "", source: "", links: [] });
                                        }}
                                        className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-xl hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-all"
                                    >
                                        <Plus className="size-4" /> Add
                                    </button>
                                </div>

                                {/* Add Form */}
                                <AnimatePresence>
                                    {addingProj && (
                                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="bg-white dark:bg-zinc-900 dark:bg-zinc-800/50 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6 space-y-4 overflow-hidden">
                                            <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">{editingProjId ? 'Edit Project' : 'New Project'}</p>
                                            <div className="grid grid-cols-2 gap-4">
                                                <Field label="Title" value={newProj.title} onChange={(v) => setNewProj({ ...newProj, title: v })} placeholder="My Side Project" />
                                                <Field label="Year / Dates" value={newProj.dates} onChange={(v) => setNewProj({ ...newProj, dates: v })} placeholder="2024" />
                                            </div>
                                            <Field label="Description" value={newProj.description} onChange={(v) => setNewProj({ ...newProj, description: v })} multiline placeholder="Brief project overview…" />
                                            <div className="space-y-1.5">
                                                <label className="text-[11px] font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">Technologies</label>
                                                <div className="flex gap-2">
                                                    <input
                                                        type="text"
                                                        value={techInput}
                                                        onChange={(e) => setTechInput(e.target.value)}
                                                        onKeyDown={(e) => {
                                                            if (e.key === "Enter") {
                                                                e.preventDefault();
                                                                if (techInput.trim() && !newProj.technologies.includes(techInput.trim())) {
                                                                    setNewProj({ ...newProj, technologies: [...newProj.technologies, techInput.trim()] });
                                                                    setTechInput("");
                                                                }
                                                            }
                                                        }}
                                                        placeholder="Press Enter to add"
                                                        className="flex-1 px-3.5 py-2 text-sm border border-zinc-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-900/10"
                                                    />
                                                </div>
                                                <div className="flex flex-wrap gap-1.5 mt-2">
                                                    {newProj.technologies.map((t) => (
                                                        <span key={t} className="flex items-center gap-1 px-2 py-0.5 text-xs bg-zinc-100 dark:bg-zinc-800/50 text-zinc-700 dark:text-zinc-300 rounded-full">
                                                            {t}
                                                            <button onClick={() => setNewProj({ ...newProj, technologies: newProj.technologies.filter((x) => x !== t) })}>
                                                                <X className="size-2.5" />
                                                            </button>
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <Field label="Live URL (Title Link)" value={newProj.href} onChange={(v) => setNewProj({ ...newProj, href: v })} placeholder="https://..." />
                                                <Field label="Source Code URL (e.g. GitHub)" value={newProj.source} onChange={(v) => setNewProj({ ...newProj, source: v })} placeholder="https://github.com/..." />
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <Field label="Image URL" value={newProj.image} onChange={(v) => setNewProj({ ...newProj, image: v })} placeholder="https://…" />
                                                <Field label="Video URL (optional)" value={newProj.video} onChange={(v) => setNewProj({ ...newProj, video: v })} placeholder="https://…" />
                                            </div>
                                            <div className="flex gap-2 justify-end">
                                                <button onClick={() => { setAddingProj(false); setEditingProjId(null); setNewProj({ title: "", href: "", dates: "", active: true, description: "", technologies: [], image: "https://avatar.vercel.sh/project", video: "", source: "", links: [] }); }} className="px-4 py-2 text-sm rounded-xl border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:bg-zinc-950 transition-all">Cancel</button>
                                                <button onClick={handleAddProject} className="px-4 py-2 text-sm font-medium bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-xl hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-all">{editingProjId ? 'Update Project' : 'Save Project'}</button>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {/* Project list */}
                                <div className="grid md:grid-cols-2 gap-4">
                                    {data?.projects.map((proj) => (
                                        <div key={proj.id} className="bg-white dark:bg-zinc-900 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden flex flex-col">
                                            <div className="aspect-video bg-zinc-50 dark:bg-zinc-950 relative">
                                                {proj.image ? (
                                                    <img src={proj.image} alt={proj.title} className="size-full object-cover" />
                                                ) : (
                                                    <div className="size-full flex items-center justify-center">
                                                        <Briefcase className="size-8 text-zinc-300" />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="p-4 flex-1 flex flex-col gap-2">
                                                <div className="flex items-start justify-between gap-2">
                                                    <div>
                                                        <p className="font-semibold text-sm text-zinc-900 dark:text-zinc-100">{proj.title}</p>
                                                        <p className="text-xs text-zinc-400 dark:text-zinc-500">{proj.dates}</p>
                                                    </div>
                                                    <div className="flex items-center gap-1 shrink-0">
                                                        <button onClick={() => handleEditProject(proj)} className="p-1.5 rounded-lg text-zinc-400 dark:text-zinc-500 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/50 transition-all">
                                                            <Pencil className="size-3.5" />
                                                        </button>
                                                        <button onClick={() => handleDeleteProject(proj.id)} className="p-1.5 rounded-lg text-zinc-400 dark:text-zinc-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/50 transition-all">
                                                            <Trash2 className="size-3.5" />
                                                        </button>
                                                    </div>
                                                </div>
                                                <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2">{proj.description}</p>
                                                {proj.technologies.length > 0 && (
                                                    <div className="flex flex-wrap gap-1 mt-auto pt-2">
                                                        {proj.technologies.slice(0, 4).map((t) => (
                                                            <span key={t} className="px-1.5 py-0 text-[10px] font-medium border border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400 rounded-full">
                                                                {t}
                                                            </span>
                                                        ))}
                                                        {proj.technologies.length > 4 && <span className="text-[10px] text-zinc-400 dark:text-zinc-500">+{proj.technologies.length - 4}</span>}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                    {!data?.projects.length && !addingProj && (
                                        <div className="col-span-2 flex flex-col items-center justify-center p-12 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl text-zinc-400 dark:text-zinc-500">
                                            <Briefcase className="size-8 mb-2" />
                                            <p className="text-sm">No projects yet</p>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        )}

                        {/* Section: Settings */}
                        {section === "settings" && (
                            <motion.div key="settings" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
                                <div>
                                    <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">Account Settings</h2>
                                    <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">Manage your account security and data.</p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="bg-white dark:bg-zinc-900 dark:bg-zinc-800/50 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6 space-y-4">
                                        <div className="size-10 rounded-xl bg-blue-50 dark:bg-blue-950/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                                            <Eye className="size-5" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-zinc-900 dark:text-zinc-100">Reset Password</h3>
                                            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Change your current password to a new one.</p>
                                        </div>
                                        <button
                                            onClick={() => setIsResetPasswordOpen(true)}
                                            className="w-full px-4 py-2.5 text-sm font-medium bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-xl hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-all text-center"
                                        >
                                            Change Password
                                        </button>
                                    </div>

                                    <div className="bg-red-50/50 dark:bg-red-950/10 rounded-2xl border border-red-100 dark:border-red-900/30 p-6 space-y-4">
                                        <div className="size-10 rounded-xl bg-red-100 dark:bg-red-950/30 flex items-center justify-center text-red-600 dark:text-red-400">
                                            <Trash2 className="size-5" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-red-700 dark:text-red-400">Danger Zone</h3>
                                            <p className="text-sm text-red-600/70 dark:text-red-400/70 mt-1">Permanently delete your account and all data.</p>
                                        </div>
                                        <button
                                            onClick={() => setIsDeleteDialogOpen(true)}
                                            className="w-full px-4 py-2.5 text-sm font-medium bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all text-center"
                                        >
                                            Delete Account
                                        </button>
                                    </div>
                                </div>

                                {/* Reset Password Dialog */}
                                <AnimatePresence>
                                    {isResetPasswordOpen && (
                                        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsResetPasswordOpen(false)} className="absolute inset-0 bg-zinc-950/60 backdrop-blur-sm" />
                                            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative w-full max-w-md bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
                                                <div className="p-6 space-y-4">
                                                    <div className="flex items-center justify-between pb-2 border-b border-zinc-100 dark:border-zinc-800">
                                                        <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">Reset Password</h3>
                                                        <button onClick={() => setIsResetPasswordOpen(false)} className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all"><X className="size-4" /></button>
                                                    </div>
                                                    <div className="space-y-4">
                                                        <div className="space-y-1.5">
                                                            <label className="text-xs font-semibold uppercase tracking-widest text-zinc-500">Current Password</label>
                                                            <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} className="w-full px-3.5 py-2.5 text-sm bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-900/10 transition-all" placeholder="••••••••" />
                                                        </div>
                                                        <div className="space-y-1.5">
                                                            <label className="text-xs font-semibold uppercase tracking-widest text-zinc-500">New Password</label>
                                                            <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="w-full px-3.5 py-2.5 text-sm bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-900/10 transition-all" placeholder="••••••••" />
                                                        </div>
                                                        <div className="space-y-1.5">
                                                            <label className="text-xs font-semibold uppercase tracking-widest text-zinc-500">Confirm New Password</label>
                                                            <input type="password" value={confirmNewPassword} onChange={(e) => setConfirmNewPassword(e.target.value)} className="w-full px-3.5 py-2.5 text-sm bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-900/10 transition-all" placeholder="••••••••" />
                                                        </div>
                                                    </div>
                                                    <div className="flex gap-3 pt-2">
                                                        <button onClick={() => setIsResetPasswordOpen(false)} className="flex-1 px-4 py-2.5 text-sm font-medium text-zinc-600 dark:text-zinc-400 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all border border-zinc-200 dark:border-zinc-800">Cancel</button>
                                                        <button onClick={handleResetPassword} disabled={isResetting || !currentPassword || !newPassword} className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-xl hover:bg-zinc-800 dark:hover:bg-zinc-200 disabled:opacity-50 transition-all">
                                                            {isResetting ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
                                                            Update Password
                                                        </button>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        </div>
                                    )}
                                </AnimatePresence>

                                {/* Delete Account Dialog */}
                                <AnimatePresence>
                                    {isDeleteDialogOpen && (
                                        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsDeleteDialogOpen(false)} className="absolute inset-0 bg-zinc-950/60 backdrop-blur-sm" />
                                            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative w-full max-w-sm bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl border border-red-100 dark:border-red-900/30 overflow-hidden">
                                                <div className="p-6 space-y-4">
                                                    <div className="text-center space-y-2">
                                                        <div className="mx-auto size-12 rounded-2xl bg-red-100 dark:bg-red-950/30 flex items-center justify-center text-red-600 dark:text-red-400 mb-2">
                                                            <Trash2 className="size-6" />
                                                        </div>
                                                        <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">Delete Account?</h3>
                                                        <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                                                            This action is permanent and will remove all your resume data, projects, and sessions.
                                                        </p>
                                                    </div>
                                                    <div className="space-y-1.5 pt-2">
                                                        <label className="text-xs font-semibold uppercase tracking-widest text-red-500">Confirm with Password</label>
                                                        <input type="password" value={deletePassword} onChange={(e) => setDeletePassword(e.target.value)} className="w-full px-3.5 py-2.5 text-sm bg-red-50/50 dark:bg-red-950/10 border border-red-100 dark:border-red-900/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/20 transition-all text-red-900 dark:text-red-100" placeholder="••••••••" />
                                                    </div>
                                                    <div className="flex flex-col gap-2 pt-2">
                                                        <button onClick={handleDeleteAccount} disabled={isDeleting || !deletePassword} className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-bold bg-red-600 text-white rounded-xl hover:bg-red-700 disabled:opacity-50 transition-all">
                                                            {isDeleting ? <Loader2 className="size-4 animate-spin" /> : null}
                                                            Delete Forever
                                                        </button>
                                                        <button onClick={() => setIsDeleteDialogOpen(false)} disabled={isDeleting} className="w-full px-4 py-2.5 text-sm font-medium text-zinc-500 dark:text-zinc-400 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all">Cancel</button>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        </div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </main>

            {/* ── Live Preview ── */}
            <AnimatePresence>
                {showPreview && (
                    <motion.aside
                        initial={{ width: 0, opacity: 0 }}
                        animate={{ width: 667, opacity: 1 }}
                        exit={{ width: 0, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 300, damping: 35 }}
                        className="bg-white dark:bg-zinc-900 dark:bg-zinc-800/50 border-l border-zinc-200 dark:border-zinc-800 overflow-hidden shrink-0 flex flex-col"
                        style={{ width: 320 }}
                    >
                        <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-100 dark:border-zinc-800 shrink-0">
                            <span className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">Live Preview</span>
                            <button onClick={() => setShowPreview(false)} className="p-1 rounded-lg text-zinc-400 dark:text-zinc-500 hover:text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:bg-zinc-800/50 transition-all">
                                <X className="size-4" />
                            </button>
                        </div>
                        <Preview data={data} />
                    </motion.aside>
                )}
            </AnimatePresence>

            {/* ── Preview Toggle ── */}
            {!showPreview && (
                <button
                    onClick={() => setShowPreview(true)}
                    className="absolute right-4 top-20 flex items-center gap-2 px-3 py-2 text-xs font-medium bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-xl shadow-lg hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-all"
                >
                    <Eye className="size-4" /> Preview
                </button>
            )}
        </div>
    );
}

// ─── Save Button ──────────────────────────────────────────────────────────────
function SaveButton({ onClick, saving }: { onClick: () => void; saving: boolean }) {
    return (
        <button
            onClick={onClick}
            disabled={saving}
            className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-xl hover:bg-zinc-800 dark:hover:bg-zinc-200 disabled:opacity-60 transition-all"
        >
            {saving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
            {saving ? "Saving…" : "Save Changes"}
        </button>
    );
}

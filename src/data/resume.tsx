import { Icons } from "@/components/icons";
import { HomeIcon, NotebookIcon } from "lucide-react";
import { ReactLight } from "@/components/ui/svgs/reactLight";
import { NextjsIconDark } from "@/components/ui/svgs/nextjsIconDark";
import { Typescript } from "@/components/ui/svgs/typescript";
import { Nodejs } from "@/components/ui/svgs/nodejs";
import { Python } from "@/components/ui/svgs/python";
import { Golang } from "@/components/ui/svgs/golang";
import { Postgresql } from "@/components/ui/svgs/postgresql";
import { Docker } from "@/components/ui/svgs/docker";
import { Kubernetes } from "@/components/ui/svgs/kubernetes";
import { Java } from "@/components/ui/svgs/java";
import { Javascript } from "@/components/ui/svgs/javascript";
import { Php } from "@/components/ui/svgs/php";
import { Express } from "@/components/ui/svgs/express";
import { Flask } from "@/components/ui/svgs/flask";
import { Mysql } from "@/components/ui/svgs/mysql";
import { Mongodb } from "@/components/ui/svgs/mongodb";
import { Tailwind } from "@/components/ui/svgs/tailwind";
import { Prisma } from "@/components/ui/svgs/prisma";
import { Git } from "@/components/ui/svgs/git";
import { Zod } from "@/components/ui/svgs/zod";

export const DATA = {
  name: "Swapnil Mahesh Dahotre",
  initials: "SD",
  url: "https://github.com/Swap9L",
  location: "Kolhapur, Maharashtra, India",
  locationLink: "https://www.google.com/maps/place/Kolhapur",
  description:
    "Full Stack Developer building scalable web apps and backend systems with modern technologies.",
  summary:
    "Full Stack Developer, building end to end web apps, backend systems. Leveraging adaptability, picking up skills on the go. Delivering exceptional results. actively working on projects, open to contribute to cool projects as well as boring stuff as long as it worth something to someone. ",

  avatarUrl: "/me.jpg",

  skills: [
    "JavaScript",
    "TypeScript",
    "Next.js",
    "React.js",
    "Node.js",
    "Tailwind",
    "Express.js",

    "Prisma",
    "MySQL",
    "MongoDB",
    "PostgreSQL",

    "Java",
    "Python",
    "Flask",


    "Git",
    "Docker",
    "Kubernetes",
    "Zod",
  ],

  navbar: [
    { href: "/", icon: HomeIcon, label: "Home" },
    // { href: "/blog", icon: NotebookIcon, label: "Blog" },
  ],

  contact: {
    email: "swapnildahotre23mh09@gmail.com",
    tel: "+91",
    social: {
      GitHub: {
        name: "GitHub",
        url: "https://github.com/Swap9L",
        icon: Icons.github,
        navbar: true,
      },
      LinkedIn: {
        name: "LinkedIn",
        url: "http://www.linkedin.com/in/d-swapnil",
        icon: Icons.linkedin,
        navbar: true,
      },
      X: {
        name: "X",
        url: "https://x.com/swap999l",
        icon: Icons.x,
        navbar: true,
      },
      Cal: {
        name: "Book a Call",
        url: "https://cal.com/swap9l/15min",
        icon: Icons.calendar,
        navbar: true,
      },
    },
  },

  education: [
    {
      school: "The New College, Kolhapur",
      href: "",
      degree: "Bachelor of Computer Applications (BCA) | CGPA: 9.1",
      logoUrl: "/nck.jpeg",
      start: "September 2021",
      end: "April 2024",
    },

  ],

  projects: [
    {
      title: "Portfolio Creation Website",
      href: "https://ur-wrld.onrender.com/d-swapnil",
      dates: "2023",
      active: true,
      description:
        "Developed a dynamic web application enabling users to create personalized portfolio pages effortlessly. Implemented user authentication, data storage, and streamlined portfolio creation for a seamless experience.",
      technologies: [
        "HTML",
        "CSS",
        "JavaScript",
        "Python",
        "Flask",
        "MySQL",
      ],
      links: [
        {
          type: "Website",
          href: "https://ur-wrld.onrender.com/d-swapnil",
          icon: <Icons.globe className="size-3" />,
        },
      ],
      image: "/wrld.png",
      video: "",
    },
    {
      title: "College Admission Management Web App",
      href: "https://github.com/Swap9L/college-admission-crm",
      dates: "2024",
      active: true,
      description:
        "Full-stack web application for a college admission calling team with role-based access (Super Admin, Admin & Faculty). Implemented secure authentication, student management, Excel import/export, dashboards with real-time analytics, activity logs, search, filters, pagination, and modal-based editing.",
      technologies: [
        "TypeScript",
        "Next.js",
        "Prisma",
        "PostgreSQL",
      ],
      links: [
        {
          type: "Source",
          href: "https://github.com/Swap9L/college-admission-crm",
          icon: <Icons.github className="size-3" />,
        },
      ],
      image: "/ss-2.png",
      video: "",
    },
  ],
  work: [],
  hackathons: [],
} as const;

export type Avatar = { gradient: string; initials: string; image?: string };
export type Subtask = { title: string; done: boolean };

export type Person = {
  id: string;
  name: string;
  initials: string;
  gradient: string;
  image?: string;
};

export type Label = {
  id: string;
  name: string;
  color: string;
};

export type ChecklistItem = {
  id: string;
  text: string;
  done: boolean;
};

export type Attachment = {
  id: string;
  name: string;
  meta: string;
  thumbnail: string;
};

export type Comment = {
  id: string;
  personId: string;
  time: string;
  text: string;
  reactions?: string[];
};

export type Card = {
  id: string;
  title: string;
  description?: string;
  date: string;
  tagColors: string[];
  image?: string;
  images?: string[];
  attachments?: number;
  comments?: number;
  avatars: Avatar[];
  subtasks?: { done: number; total: number; items?: Subtask[] };
  status?: "todo" | "in-progress" | "completed";
  assignedTo?: string[];
  createdBy?: string;
  labelIds?: string[];
  dueDate?: string;
  longDescription?: string;
  checklist?: ChecklistItem[];
  attachmentFiles?: Attachment[];
  commentList?: Comment[];
};

export type Column = {
  id: string;
  title: string;
  color: string;
  cards: Card[];
};

const avatarImages: Record<string, string> = {
  AT: "/assets/4.jpg",
  BN: "/assets/2.jpg",
  JH: "/assets/4.jpg",
  JS: "/assets/2.jpg",
  JW: "/assets/4.jpg",
  MK: "/assets/5.jpg",
  RC: "/assets/2.jpg",
  RL: "/assets/5.jpg",
  SB: "/assets/4.jpg",
  TQ: "/assets/5.jpg",
};

const av = (gradient: string, initials: string): Avatar => ({
  gradient,
  initials,
  image: avatarImages[initials],
});

export const people: Person[] = [
  { id: "jane", name: "Jasur Karimov", initials: "JW", gradient: "from-rose-400 to-orange-400", image: avatarImages.JW },
  { id: "jacob", name: "Malika Saidova", initials: "JH", gradient: "from-sky-400 to-indigo-400", image: avatarImages.JH },
  { id: "regina", name: "Nodir Aliyev", initials: "RC", gradient: "from-orange-400 to-red-400", image: avatarImages.RC },
  { id: "shane", name: "Aziz Bekmurodov", initials: "SB", gradient: "from-indigo-400 to-sky-400", image: avatarImages.SB },
  { id: "raul", name: "Dilshod Umarov", initials: "RL", gradient: "from-amber-400 to-rose-400", image: avatarImages.RL },
];

export const labelColorOptions: string[] = [
  "bg-rose-400",
  "bg-teal-400",
  "bg-amber-400",
  "bg-gray-700",
  "bg-sky-400",
  "bg-gray-300",
  "bg-lime-300",
  "bg-violet-400",
  "bg-pink-400",
  "bg-gray-200",
];

export const labels: Label[] = [
  { id: "Plan", name: "Plan", color: "bg-sky-400" },
  { id: "design", name: "Design", color: "bg-gray-700" },
  { id: "Frontend", name: "Frontend", color: "bg-teal-400" },
  { id: "Backend", name: "Backend", color: "bg-rose-400" },
];

export const columns: Column[] = [
  {
    id: "todo",
    title: "To do",
    color: "bg-amber-400",
    cards: [
      {
        id: "1",
        title: "Logo variants for client",
        description: "Prepare two logo options using the approved colors.",
        date: "Jun 17",
        tagColors: ["bg-gray-400", "bg-gray-200"],
        attachments: 2,
        comments: 5,
        avatars: [av("from-rose-400 to-orange-400", "JS"), av("from-sky-400 to-indigo-400", "MK")],
        status: "todo",
        assignedTo: ["jane", "jacob"],
        createdBy: "shane",
        labelIds: ["Design"],
        dueDate: "Jun 20, 2026, 6:00 PM",
        longDescription: "Prepare two logo options using the approved colors. Export light and dark versions after review.",
        checklist: [
          { id: "c1", text: "Find the current brand file", done: true },
          { id: "c2", text: "Prepare 2 logo options", done: false },
          { id: "c3", text: "Send for review", done: false },
        ],
      },
      {
        id: "2",
        title: "Update homepage image",
        date: "Jun 17",
        tagColors: ["bg-gray-400", "bg-gray-200"],
        image: "/assets/image1.png",
        attachments: 1,
        comments: 3,
        avatars: [av("from-amber-400 to-rose-400", "RL")],
        status: "todo",
        assignedTo: ["raul"],
        createdBy: "shane",
        labelIds: ["Design", "Frontend"],
        dueDate: "Jun 21, 2026, 12:00 PM",
      },
      {
        id: "3",
        title: "Sketch mobile flow",
        description: "Draw the first mobile flow before the client call.",
        date: "Jun 17",
        tagColors: ["bg-gray-400", "bg-gray-200"],
        comments: 1,
        avatars: [av("from-orange-400 to-red-400", "BN"), av("from-indigo-400 to-sky-400", "TQ")],
        status: "todo",
        assignedTo: ["regina", "jacob"],
        createdBy: "jane",
        labelIds: ["Plan"],
        dueDate: "Jun 22, 2026, 9:00 AM",
      },
    ],
  },
  {
    id: "in-progress",
    title: "Doing",
    color: "bg-sky-400",
    cards: [
      {
        id: "4",
        title: "Fix auth edge cases",
        description: "Clean up the login and password reset states.",
        date: "Jun 17",
        tagColors: ["bg-gray-400", "bg-gray-200"],
        subtasks: { done: 2, total: 4 },
        attachments: 2,
        comments: 5,
        avatars: [av("from-rose-400 to-orange-400", "JS"), av("from-sky-400 to-indigo-400", "MK")],
        status: "in-progress",
        assignedTo: ["jane", "jacob"],
        createdBy: "shane",
        labelIds: ["Backend"],
        dueDate: "Jun 19, 2026, 3:00 PM",
        checklist: [
          { id: "c1", text: "Check login errors", done: true },
          { id: "c2", text: "Review reset password email", done: true },
          { id: "c3", text: "Handle expired token state", done: false },
          { id: "c4", text: "Test on staging", done: false },
        ],
      },
      {
        id: "5",
        title: "Finish dashboard cards",
        description: "Tighten spacing and empty states on dashboard cards.",
        date: "Jun 17",
        tagColors: ["bg-gray-400", "bg-gray-200"],
        subtasks: {
          done: 3,
          total: 4,
          items: [
            { title: "Stats card", done: true },
            { title: "Recent activity card", done: true },
            { title: "Tasks card", done: true },
            { title: "Empty state", done: false },
          ],
        },
        attachments: 2,
        comments: 5,
        avatars: [av("from-orange-400 to-red-400", "BN"), av("from-indigo-400 to-sky-400", "TQ")],
        status: "in-progress",
        assignedTo: ["jane", "jacob", "regina"],
        createdBy: "shane",
        labelIds: ["Design", "Frontend"],
        dueDate: "Jun 17, 2026, 9:00 AM",
        longDescription:
          "Tighten the dashboard cards before QA. Focus on spacing, empty states, and long text.",
        checklist: [
          { id: "c1", text: "Stats card", done: true },
          { id: "c2", text: "Recent activity card", done: true },
          { id: "c3", text: "Tasks card", done: true },
          { id: "c4", text: "Empty state", done: false },
        ],
        attachmentFiles: [
          { id: "a1", name: "Dashboard notes", meta: "Uploaded on 15.03.2020 at 13:56", thumbnail: "from-orange-300 to-rose-400" },
          { id: "a2", name: "Screenshot", meta: "Uploaded on 15.03.2020 at 14:02", thumbnail: "from-gray-300 to-gray-500" },
          { id: "a3", name: "Screenshot", meta: "Uploaded on 15.03.2020 at 14:05", thumbnail: "from-sky-300 to-indigo-500" },
        ],
        commentList: [
          { id: "cm1", personId: "jane", time: "4 hr ago", text: "Did you push the dashboard card changes?", reactions: ["OK"] },
          { id: "cm2", personId: "jacob", time: "1 hr ago", text: 'Yes, recent activity is done. I am checking the empty state now.' },
          { id: "cm3", personId: "regina", time: "30 min ago", text: "Can we include this in the staging build today?" },
        ],
      },
    ],
  },
  {
    id: "completed",
    title: "Done",
    color: "bg-gray-500",
    cards: [
      {
        id: "6",
        title: "Compress gallery images",
        date: "Jun 17",
        tagColors: ["bg-gray-400", "bg-gray-200"],
        images: ["/assets/image1.png", "/assets/3.jpg", "/assets/3.jpg"],
        attachments: 3,
        comments: 2,
        avatars: [av("from-rose-400 to-orange-400", "JS"), av("from-sky-400 to-indigo-400", "MK")],
        status: "completed",
        assignedTo: ["jane", "jacob"],
        createdBy: "shane",
        labelIds: ["Frontend"],
        dueDate: "Jun 15, 2026, 5:00 PM",
      },
      {
        id: "7",
        title: "Staging server check",
        description: "Run the staging server and confirm env values.",
        date: "Jun 17",
        tagColors: ["bg-gray-400", "bg-gray-200"],
        comments: 17,
        avatars: [av("from-orange-400 to-red-400", "BN"), av("from-indigo-400 to-sky-400", "TQ")],
        status: "completed",
        assignedTo: ["regina", "shane"],
        createdBy: "jane",
        labelIds: ["Backend"],
        dueDate: "Jun 14, 2026, 11:00 AM",
      },
      {
        id: "8",
        title: "Replace old banner",
        date: "Jun 17",
        tagColors: ["bg-gray-400", "bg-gray-200"],
        image: "/assets/3.jpg",
        attachments: 1,
        comments: 2,
        avatars: [av("from-amber-400 to-rose-400", "RL")],
        status: "completed",
        assignedTo: ["raul"],
        createdBy: "shane",
        labelIds: ["Design"],
        dueDate: "Jun 13, 2026, 4:00 PM",
      },
    ],
  },
];

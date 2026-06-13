export type Faculty = {
    id: string;
    name: string;
    subject: string;
    qualification: string;
    experience: number;
    profile_image_url?: string;
}

export type User = {
    id: string;
    name: string;
    email: string;
    is_active: boolean;
    roles: string[];
}

export type CurrentUser = {
    id: string;
    name: string;
    email: string;
    roles: string[];
    faculty_id?: string | null;
    faculty_name?: string | null;
    is_admin: boolean;
}

export type Attendance = {
    id: string;
    faculty_id: string;
    faculty_name?: string | null;
    date: string;        // YYYY-MM-DD
    day: string;         // weekday name
    minutes_taken: number;
    classes: number;     // whole completed classes
    amount: number;      // remuneration in Rs
    notes?: string | null;
    marked_by?: string | null;
}

export type AttendanceSummary = {
    faculty_id: string;
    faculty_name?: string | null;
    total_minutes: number;
    total_classes: number;
    total_amount: number;
    days: number;
}

export type StudentAttendance = {
    student_id: string;
    date: string;        // YYYY-MM-DD
    day: string;         // weekday name
    status: 'present' | 'absent';
    marked_by?: string | null;
}

export type Role = {
    id: string;
    name: string;
    description: string;
    permissions: string[];
}

export type Permission = {
    id: string;
    name: string;
    description: string;
}

export type Student = {
    id: string;
    name: string;
    class_name: string;
    parent_name: string;
    contact_number: string;
    email?: string;
    address?: string;
    profile_image_url?: string;
}

export type Event = {
    id: string;
    title: string;
    description: string;
    event_date: string;
    image_url?: string;
    video_url?: string;
}

export type LibraryItem = {
    id: string;
    title: string;
    description: string;
    file_url?: string;
}

export type Class = {
    id: string;
    name: string;
    description?: string;
} 
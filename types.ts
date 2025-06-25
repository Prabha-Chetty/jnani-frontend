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
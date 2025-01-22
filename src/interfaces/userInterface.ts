interface UserInterface {
    id: number;
    createdAt: Date;
    updatedAt?: Date;
    username: string;
    name?: string;
    picture?: string;
    interest?: string[];
    birthDate?: Date;
    email?: string;
    gender?: string;
    type?: string;
    status: string;
    deletedAt?: Date;
    
}
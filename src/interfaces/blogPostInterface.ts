interface BlogPostInterface {
    id?: number;
    createdAt?: Date;
    updatedAt?: Date;
    username?: string,
    title?: string;
    cover?: string;
    shortContent?: string;
    content?: string;
    clickTimes?: number;
    likes?: number;
    meta?: {
        readingTime: number;
        wordCount: number;
        hasImages: boolean;
        images: string[];
    };
}
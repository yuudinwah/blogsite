interface BlogPost {
    id: number;
    title: string;
    cover: string;
    shortContent: string;
    content: string;
    createdAt: string;
    clickTimes: number;
    likes: number;
    meta: {
        readingTime: number;
        wordCount: number;
        hasImages: boolean;
        images: string[];
    };
}
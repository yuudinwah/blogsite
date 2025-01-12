'use client'

import Editor from '@/components/wysiwyg';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function EditPage({ params }: any ) {
    const [content, setContent] = useState<string>('');
    const [initialContent, setInitialContent] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    useEffect(() => {
        // Fetch content dari API berdasarkan ID
        const fetchContent = async () => {
            try {
                var id = (await params).id
                const response = await fetch(`/api/blog?id=${id}`);
                // const response = await fetch(`/api/blog?id=${id}`);
                const data = await response.json();
                console.log(data.data)
                setInitialContent(data.data.content);
            } catch (error) {
                console.error('Error fetching content:', error);
            }
        };

        fetchContent();
    }, [params]);

    const handleContentChange = (html: string) => {
        setContent(html);
    };

    const handleSubmit = async () => {
        try {
            var id = (await params).id
            const response = await fetch(`/api/blog?id=${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ html: content }),
            });

            if (response.ok) {
                // Handle success
                console.log('Content updated successfully');
                router.push('/dashboard');

            }
        } catch (error) {
            console.error('Error updating content:', error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-5xl mx-auto p-4">
                <div className='flex my-4'>

                    <button
                        onClick={handleSubmit}
                        disabled={isLoading}
                        className={`rounded-md border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                    >{isLoading ? 'Mengirim...' : 'Kirim'}
                    </button>

                </div>
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                    <Editor onChange={handleContentChange} initialContent={initialContent} />
                </div>
            </div>
        </div>
    );
}

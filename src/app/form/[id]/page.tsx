'use client'

import Editor from '@/components/wysiwyg';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function EditPage({ params }: any) {
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
            const id = (await params).id
            const result = await uploadHtml(content, id);

            if (result.ok) {
                // Handle success
                console.log('Content updated successfully');
                router.push('/dashboard');

            }
        } catch (error) {
            console.error('Error updating content:', error);
        }
    };

    return (
        <div className='bg-gray-50 justify-center flex flex-row w-full'>
                    <div className="max-w-3xl  w-full pt-20">
                        <div className='p-2'></div>
                        <div className="rounded-lg bg-white overflow-hidden">
                            <div className="fixed top-20 max-w-3xl w-screen flex flex-row justify-end p-2 bg-white">
                                <button
                        onClick={handleSubmit}
                                    disabled={isLoading}
                                    className={`rounded-md border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                    {isLoading ? 'Menyimpan...' : 'Simpan'}
                                </button>
                            </div>
                            <div className=''>
                                <Editor onChange={handleContentChange} initialContent={initialContent} />
        
                            </div>
                        </div>
        
                        {/* HTML Preview */}
                        {/* <div className="mt-4 p-4 bg-white rounded-lg shadow">
                            <h3 className="text-lg font-medium mb-2">HTML Output:</h3>
                            <pre className="bg-gray-50 p-3 rounded text-sm overflow-auto">
                                {html}
                            </pre>
                        </div> */}
        
                        {/* Rendered HTML Preview */}
                        {/* <div className="mt-4 p-4 bg-white rounded-lg shadow">
                            <h3 className="text-lg font-medium mb-2">Rendered Preview:</h3>
                            <div
                                dangerouslySetInnerHTML={{ __html: html }}
                                className="prose max-w-none"
                            />
                        </div> */}
                    </div>
                </div>
    );
}

async function uploadHtml(html: string, id: string) {
    try {
        // Konversi blob URLs ke base64
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const images = doc.getElementsByTagName('img');

        let processedHtml = html;

        for (const img of images) {
            const src = img.getAttribute('src');
            if (src?.startsWith('blob:')) {
                const response = await fetch(src);
                const blob = await response.blob();
                const base64 = await new Promise((resolve) => {
                    const reader = new FileReader();
                    reader.onloadend = () => resolve(reader.result);
                    reader.readAsDataURL(blob);
                });

                processedHtml = processedHtml.replace(src, base64 as string);
            }
        }

        const response = await fetch(`/api/blog?id=${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ html: processedHtml }),
        });

        // const response = await axios.post('/api/blog', {
        //     html: processedHtml
        // });

        return response;

    } catch (error) {
        console.error('Error uploading:', error);
        throw error; // Re-throw error untuk handling di component
    }
}

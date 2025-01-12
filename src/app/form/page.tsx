'use client'

import { useState } from 'react';
import Editor from '../../components/wysiwyg';
import axios from 'axios';
import { useRouter } from 'next/navigation';

export default function Page() {
    const [html, setHtml] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter(); // Initialize router

    const handleUpload = async () => {
        setIsLoading(true);
        try {
            await uploadHtml(html);
            // Redirect ke halaman root setelah berhasil
            router.push('/dashboard');
        } catch (error) {
            console.error('Error during upload:', error);
            // Optional: Tambahkan error handling UI
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-5xl mx-auto p-4">
                <div className='flex my-4'>

                    <button
                        onClick={handleUpload}
                        disabled={isLoading}
                        className={`rounded-md border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                    >{isLoading ? 'Mengirim...' : 'Kirim'}
                    </button>

                </div>
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                    <Editor onChange={setHtml} />
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

async function uploadHtml(html: string) {
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

        const response = await axios.post('/api/blog', {
            html: processedHtml
        });

        if (!response.data) {
            throw new Error('Upload failed');
        }

        return response.data;

    } catch (error) {
        console.error('Error uploading:', error);
        throw error; // Re-throw error untuk handling di component
    }
}
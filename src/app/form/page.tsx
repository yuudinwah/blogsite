'use client'

import { useState } from 'react';
import Editor from '../../components/wysiwyg';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useUser } from '@/context/UserContext';

export default function Page() {
    let { userData } = useUser()
    const [html, setHtml] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter(); // Initialize router

    const handleUpload = async () => {
        setIsLoading(true);
        try {
            await uploadHtml(html, userData?.id!);
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
        <div className='bg-gray-50 justify-center flex flex-row w-full'>
            <div className="max-w-3xl  w-full pt-20">
                <div className='p-2'></div>
                <div className="rounded-lg bg-white overflow-hidden">
                    <div className="fixed top-20 max-w-3xl w-screen flex flex-row justify-end p-2 bg-white">
                        <button
                            onClick={handleUpload}
                            disabled={isLoading}
                            className={`rounded-md border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            {isLoading ? 'Menyimpan...' : 'Simpan'}
                        </button>
                    </div>
                    <div className=''>
                        <Editor onChange={setHtml} />

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

async function uploadHtml(html: string, username: string) {
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

        const response = await axios.post(`/api/blogs?username=${username}`, {
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
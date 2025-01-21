import { supabase } from '@/utils/supabase';
import { headers } from 'next/headers';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import HeaderComponent from '@/components/Header';

// Tipe untuk props
type Props = {
    params: {
        id: string
    },
    searchParams: { [key: string]: string | string[] | undefined }
}

// Fungsi untuk validasi domain
async function validateDomain() {
    const headersList = headers();
    const domain = (await headersList).get('host');
    // Daftar domain yang diizinkan
    const allowedDomains = ['localhost:3000', 'yourdomain.com'];

    return allowedDomains.includes(domain || '');
}

// Metadata generator (opsional)
export async function generateMetadata({ params }: any) {
    const id = (await params).id;

    // Fetch data
    const data = await fetchData(id);

    return {
        title: `${data?.title || id}`,
        description: data?.shortContent || 'Detail page'
    };
}

// Main component
export default async function DetailPage({ params }: any) {
    const id = (await params).id;

    // Validasi domain
    // if (!validateDomain()) {
    //     notFound(); // atau redirect ke halaman error
    // }

    // Validasi ID
    // const isValidId = await validateId(id);
    // if (!isValidId) {
    //     notFound(); // atau redirect ke halaman error
    // }

    // Fetch data
    const data = await fetchData(id);

    return (
        <>
            <div className='bg-white justify-center flex flex-row h-screen w-full'>
                <div className="flex flex-col max-w-3xl w-full p-20">
                    <article className="py-8">
                        {data && (
                            <div>
                                <div className="leading-relaxed" dangerouslySetInnerHTML={{ __html: `<div style="font-family: 'Merriweather', serif;">${data.content}</div>` }} />
                            </div>
                        )}
                    </article>
                </div>
            </div>
        </>
    );
}

// Fungsi untuk fetch data
async function fetchData(id: string): Promise<BlogPost> {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/blog?id=${id}`);
        const data = await response.json();
        return data.data;
    } catch (error) {
        console.error('Error fetching content:', error);
        throw error; // Return empty array on error
    }
}
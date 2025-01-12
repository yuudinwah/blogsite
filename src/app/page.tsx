import FooterComponent from '@/components/Footer';
import { dateFormat } from '@/utils/dateExtension';
import { supabase } from '@/utils/supabase';
import { headers } from 'next/headers';
import Image from 'next/image';
import { notFound } from 'next/navigation';

// Fungsi untuk validasi domain
async function validateDomain() {
  const headersList = headers();
  const domain = (await headersList).get('host');
  // Daftar domain yang diizinkan
  const allowedDomains = ['localhost:3000', 'yourdomain.com'];

  return allowedDomains.includes(domain || '');
}

// Metadata generator (opsional)
export async function generateMetadata() {

  // Fetch data
  const data = await fetchData();

  return {
    title: `My Blog`,
    description: 'Main page'
  };
}

// Main component
export default async function DetailPage() {
  // Validasi domain
  if (!validateDomain()) {
    notFound(); // atau redirect ke halaman error
  }
  // Fetch data
  const datas = await fetchData();

  return (
    <>
      <div className="flex flex-col lg:flex-row">
        <div className="bg-gray-400 lg:w-80 h-auto lg:h-screen py-16 lg:py-8 lg:fixed lg:z-0 lg:drop-shadow-sm">
          <div className="w-full p-4 gap-16 flex flex-col items-center">
            <Image className="dark:invert" src="/icon-192.png" alt="logo" width={180} height={38} priority />
            <h1 className="text-3xl lg:text-xl font-bold mb-4">My Blog</h1>
          </div>
        </div>
        <div className="lg:w-screen lg:pl-80 items-center flex flex-col">
          <div className="px-16 py-8 w-full lg:max-w-screen-md flex flex-col">
            <div className="py-8">
              <h1 className="text-2xl font-bold text-gray-600 mb-4">Content</h1>
            </div>
            {datas && datas.map((data, index) => (
              <div className="py-8" key={index}>
                <p className="text-sm text-gray-400 mb-2">{dateFormat((new Date(data.createdAt)), "MMMM dd, yyyy")} - {data.meta.readingTime} menit baca</p>
                <a className="text-xl font-bold text-gray-600 mb-8" href={`/detail/${data.id}`}>{data.title}</a>
                <p className="text-gray-600 my-4">{data.shortContent} </p>
                <h2></h2>
              </div>
            ))}
          </div>

          {/* Footer */}

          <FooterComponent />
        </div>

      </div>
    </>
  );
}

// Fungsi untuk fetch data
async function fetchData(): Promise<BlogPost[]> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/blog`);
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching content:', error);
    return []; // Return empty array on error
  }
}

// Optional: Generate Static Params
export async function generateStaticParams() {
  // Jika ingin menggunakan SSG
  const { data } = await supabase
    .from('blogsPages')
    .select('id');

  return data?.map((item) => ({
    id: item.id.toString(),
  })) || [];
}
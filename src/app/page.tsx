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
      <div className='bg-white justify-center flex flex-row h-screen w-full'>
        <div className="flex flex-col max-w-3xl w-full h-full">
          <div className='w-full h-full flex flex-row justify-between'>
            <div className='flex flex-col justify-center w-1/2 h-full'>
              <div className='text-6xl py-4'>
                Share your passions
              </div>
              <div className='text-base py-4'>
                Create your own blog sites
              </div>
              <div className="flex items-center flex-row py-4">
                <a
                  className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
                  href="/form"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Create
                </a>
              </div>
            </div>
            <div className='flex flex-col justify-center w-1/2 h-full'>
              <Image src={"/landing-01.png"} height={360} width={360} className={`sm:hidden lg:block`} alt='Landing Image preview'></Image>
            </div>
          </div>
          <div className='h-20 border-t-2 flex flex-row justify-center items-center gap-4 --font-merriweather'>
            <a href="#" className="text-md text-gray-900">Help</a>
            <a href="#" className="text-md text-gray-900">About</a>
            <a href="#" className="text-md text-gray-900">Privacy</a>
            <a href="#" className="text-md text-gray-900">Terms</a>
            <a href="#" className="text-md text-gray-900">Teams</a>
            <a href="#" className="text-md text-gray-900">Status</a>
          </div>
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
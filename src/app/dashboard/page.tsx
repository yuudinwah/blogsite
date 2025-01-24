'use client'

import { dateFormat } from '@/utils/dateExtension';
import { useState, useEffect } from 'react';

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<string>('Public');
  const [tabs, setTabs] = useState<string[]>(['+', 'Public', 'Following']);
  const [posts, setposts] = useState<BlogPostInterface[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        console.log("fetch data==============")
        const result = await fetchData({ tag: activeTab });
        setposts(result);
      } catch (err) {
        setError('Failed to fetch data');
        console.error('Error loading data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);
  return (
    <>
      <div className='bg-white justify-center flex flex-row h-screen w-full'>
        <div className="flex flex-col max-w-3xl w-full py-20">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`
                py-4 px-6 text-sm font-medium border-b-2 transition-colors duration-200
                ${activeTab === tab
                      ? 'border-foreground text-foreground'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                >
                  {tab}
                </button>
              ))}
            </nav>

          </div>
          <div className='py-4 px-8'>
            {posts.map((post, index) => {
              return <div className="py-8 border-b border-gray-200" key={index}>
                <div className="flex justify-between items-start gap-8">
                  <div className="flex-1">
                    <p className="text-sm text-gray-400 mb-2">
                      {dateFormat((new Date(post.createdAt??"")), "MMMM dd, yyyy")} - {post.meta?.readingTime} menit baca
                    </p>
                    <a
                      className="text-xl font-bold text-gray-600 mb-8"
                      href={`/detail/${post.id}`}
                    >
                      {post.title}
                    </a>
                    <p className="text-gray-600 my-4 overflow-hidden text-ellipsis line-clamp-2">
                      {post.shortContent}
                    </p>
                    <div className="text-gray-600 my-4 flex flex-row gap-4 text-sm">
                      <img src="/icons/lucide/bar-chart-2.svg" alt="Icon" width={20} height={20} /> {post.clickTimes?.toLocaleString('id-ID')}
                      <img src="/icons/lucide/thumbs-up.svg" alt="Icon" width={20} height={20} /> {post.likes?.toLocaleString('id-ID')}
                    </div>
                  </div>
                  {post.meta?.hasImages ?
                    <div className="shrink-0 w-36 h-24 bg-gray-100 rounded-md"> {/* Atur lebar dan tinggi sesuai kebutuhan */}
                      <img src={post.meta.images[0]} alt={post.title} className="w-full h-full object-cover rounded-md" />
                    </div> :
                    <></>}
                </div>
              </div>
            })}
          </div>
        </div>
      </div>
    </>
  );
}

async function fetchData({ tag }: { tag?: string }): Promise<BlogPostInterface[]> {
  try {
    const response = await fetch(`/api/blogs?tag=${tag}`);
    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Error fetching content:', error);
    return []; // Return empty array on error
  }
}

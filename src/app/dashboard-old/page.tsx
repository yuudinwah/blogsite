'use client'

import { useState, useEffect } from 'react';
import DashboardCounterComponent from '@/components/DashboardCounter';
import FooterComponent from '@/components/Footer';
import { dateFormat } from '@/utils/dateExtension';
import Image from 'next/image';

async function fetchData(): Promise<BlogPost[]> {
  try {
    const response = await fetch(`/api/blog`);
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching content:', error);
    return []; // Return empty array on error
  }
}

// Component More Menu
function MoreMenu({
  isOpen,
  onEdit,
  onDelete
}: {
  isOpen: boolean;
  onEdit: () => void;
  onDelete: () => void;
}) {
  if (!isOpen) return null;

  return (
    <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
      <div className="py-1">
        <button
          onClick={onEdit}
          className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          Edit
        </button>
        <button
          onClick={onDelete}
          className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          Delete
        </button>
      </div>
    </div>
  );
}

// Delete Confirmation Dialog
function DeleteDialog({
  isOpen,
  title,
  onClose,
  onConfirm
}: {
  isOpen: boolean;
  title: string;
  onClose: () => void;
  onConfirm: () => void;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-sm mx-4">
        <h3 className="text-lg font-medium mb-2">Konfirmasi Hapus Post</h3>
        <p className="text-gray-500 mb-4">
          Hapus post dengan judul "{title}"?
        </p>
        <div className="flex justify-end gap-2">
          <button
            className="px-4 py-2 text-gray-500 hover:text-gray-700"
            onClick={onClose}
          >
            Batal
          </button>
          <button
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            onClick={onConfirm}
          >
            Hapus
          </button>
        </div>
      </div>
    </div>
  );
}

// Main component
export default function DashboardPage() {
  const [datas, setDatas] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openMenuId, setOpenMenuId] = useState<(string | number) | null>(null);
  const [deleteDialog, setDeleteDialog] = useState<{ isOpen: boolean; id: (string | number); title: string }>({
    isOpen: false,
    id: '',
    title: ''
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        console.log("fetch data==============")
        const result = await fetchData();
        setDatas(result);
      } catch (err) {
        setError('Failed to fetch data');
        console.error('Error loading data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const handleEdit = (id: (string | number)) => {
    window.location.href = `/form/${id}`;
  };

  const handleDelete = async (id: (string | number)) => {
    try {
      const response = await fetch(`/api/blog?id=${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete');

      // Refresh data after successful delete
      const result = await fetchData();
      setDatas(result);
      setDeleteDialog({ isOpen: false, id: '', title: '' });
    } catch (error) {
      console.error('Error deleting:', error);
    }
  };

  if (error) {
    return <div className="text-red-500 p-4">Error: {error}</div>;
  }

  if (isLoading) {
    return <div className="p-4">Loading...</div>;
  }
  return (
    <>
      <div className="flex flex-col lg:flex-row">
        <div className="bg-gray-400 lg:w-80 h-auto lg:h-screen py-16 lg:py-8 lg:fixed lg:z-0 lg:drop-shadow-sm">
          <div className="w-full p-4 gap-16 flex flex-col items-center">
            <Image className="dark:invert" src="/icon-192.png" alt="logo" width={180} height={38} priority />
            <h1 className="text-3xl lg:text-xl font-bold mb-4">My Blog</h1>

            <div className="flex gap-4 items-center flex-row lg:flex-col ">
              <a
                className="rounded-lg border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
                href="/form"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img className="dark:invert" src="/vercel.svg" alt="Vercel logomark" width={20} height={20} />
                Create
              </a>
            </div>
          </div>
        </div>

        <div className="lg:w-screen lg:pl-80 items-center flex flex-col">
          <div className="px-16 py-8 w-full lg:max-w-screen-md flex flex-col">
            <div className="py-8">
              <h1 className="text-2xl font-bold text-gray-600 mb-4">Dashboard</h1>
            </div>
            <div className='flex flex-row gap-4'>
              <DashboardCounterComponent
                title='Viewers'
                value={datas.map(item => item.clickTimes).reduce((a, b) => a + b, 0)}
              />
              <DashboardCounterComponent
                title='Postingan'
                value={datas.length}
              />
            </div>

            <div className="py-8">
              <h1 className="text-2xl font-bold text-gray-600 mb-4">Content</h1>
            </div>

            {datas.map((data, index) => (
              <div className="py-8 border-b border-gray-200" key={index}>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="text-sm text-gray-400 mb-2">
                      {dateFormat((new Date(data.createdAt)), "MMMM dd, yyyy")} - {data.meta.readingTime} menit baca
                    </p>
                    <a
                      className="text-xl font-bold text-gray-600 mb-8"
                      href={`/detail/${data.id}`}
                    >
                      {data.title}
                    </a>
                    <p className="text-gray-600 my-4">
                      viewer : {data.clickTimes}, likes : {data.likes}
                    </p>
                  </div>

                  {/* More Menu Button */}
                  <div className="relative">
                    <button
                      className="p-2 hover:bg-gray-100 rounded-lg"
                      onClick={() => setOpenMenuId(openMenuId === data.id ? null : data.id)}
                    >
                      <svg
                        className="w-5 h-5 text-gray-500"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
                      </svg>
                    </button>

                    <MoreMenu
                      isOpen={openMenuId === data.id}
                      onEdit={() => handleEdit(data.id)}
                      onDelete={() => setDeleteDialog({
                        isOpen: true,
                        id: data.id,
                        title: data.title
                      })}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <FooterComponent />
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <DeleteDialog
        isOpen={deleteDialog.isOpen}
        title={deleteDialog.title}
        onClose={() => setDeleteDialog({ isOpen: false, id: '', title: '' })}
        onConfirm={() => handleDelete(deleteDialog.id)}
      />
    </>
  );
}

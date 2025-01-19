// // utils/firestore.ts
// import {
//     collection,
//     query,
//     where,
//     getDocs,
//     getDoc,
//     addDoc,
//     updateDoc,
//     deleteDoc,
//     doc,
//     orderBy,
//     limit,
//     DocumentData,
//     QueryDocumentSnapshot,
//     Timestamp
//   } from 'firebase/firestore';
//   import { db } from './firebase';
  
//   // Convert Firestore timestamp to Date
//   const convertTimestamp = (timestamp: Timestamp): Date => {
//     return timestamp?.toDate();
//   };
  
//   // Convert Firestore document to type
//   const convertDoc = (doc: QueryDocumentSnapshot<DocumentData>): Post => {
//     const data = doc.data();
//     return {
//       id: doc.id,
//     //   title: data.title,
//     //   content: data.content,
//     //   author: data.author,
//       createdAt: convertTimestamp(data.createdAt),
//       updatedAt: convertTimestamp(data.updatedAt)
//     };
//   };
  
//   // Get all posts
//   export const getPosts = async (): Promise<Post[]> => {
//     try {
//       const postsRef = collection(db, 'users');
//       const q = query(
//         postsRef,
//         orderBy('createdAt', 'desc'),
//         limit(10)
//       );
      
//       const querySnapshot = await getDocs(q);
//       return querySnapshot.docs.map(convertDoc);
//     } catch (error) {
//       console.error('Error getting posts:', error);
//       throw error;
//     }
//   };
  
//   // Get single post
//   export const getPost = async (id: string): Promise<Post | null> => {
//     try {
//       const docRef = doc(db, 'posts', id);
//       const docSnap = await getDoc(docRef);
      
//       if (docSnap.exists()) {
//         const data = docSnap.data();
//         return {
//           id: docSnap.id,
//           ...data,
//           createdAt: convertTimestamp(data.createdAt),
//           updatedAt: convertTimestamp(data.updatedAt)
//         } as Post;
//       }
//       return null;
//     } catch (error) {
//       console.error('Error getting post:', error);
//       throw error;
//     }
//   };
  
//   // Get posts by author
//   export const getPostsByAuthor = async (authorId: string): Promise<Post[]> => {
//     try {
//       const postsRef = collection(db, 'posts');
//       const q = query(
//         postsRef,
//         where('author.id', '==', authorId),
//         orderBy('createdAt', 'desc')
//       );
      
//       const querySnapshot = await getDocs(q);
//       return querySnapshot.docs.map(convertDoc);
//     } catch (error) {
//       console.error('Error getting posts by author:', error);
//       throw error;
//     }
//   };
  
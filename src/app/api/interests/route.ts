import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/utils/supabase';

// Get Blog Function
export async function GET(request: NextRequest) {
    try {
        let snapshot: any = supabase.from("blogsUsersInterests")
            .select("*")
            .is('deletedAt', 'null')
            .order('createdAt', { ascending: false })
            .single();
        snapshot = await snapshot
        return NextResponse.json({
            success: true,
            data: snapshot.data || [],
        });
    } catch (error) {
        console.error('Error', error);
        return NextResponse.json(
            { detail: error },
            { status: 500 }
        );
    }
}

// Insert Blog Function
// export async function POST(request: NextRequest) {
//     try {
//         const data = await request.json();
//         let user: UserInterface = data;


//         let snapshot = await supabase.from("blogsUsers").insert(user).select("*").single()
//         user = snapshot.data

//         return NextResponse.json({
//             success: true,
//             data: user
//         });

//     } catch (error) {
//         console.error('Error processing blog:', error);
//         return NextResponse.json(
//             { error: 'Failed to process blog' },
//             { status: 500 }
//         );
//     }
// }

// // Update Blog Function
// export async function PATCH(request: NextRequest) {
//     try {
//         const data = await request.json();
//         const searchParams = request.nextUrl.searchParams;
//         const id = searchParams.get('id');
//         if (!id) throw "ID Required"
//         let snapshot = await supabase.from("blogsUsers").select("*").eq("id", id).single();
//         let user: UserInterface = snapshot.data
//         user = { ...user, ...data }

//         snapshot = await supabase.from("blogsUsers").update(user).eq("id", id).select("*").single()
//         user = snapshot.data
//         if (snapshot.error) console.log("error updating data")
//         else console.log("update data berhasil")

//         return NextResponse.json({
//             success: true,
//             data: user
//         });

//     } catch (error) {
//         console.error('Error processing blog:', error);
//         return NextResponse.json(
//             { error: 'Failed to process blog' },
//             { status: 500 }
//         );
//     }
// }

// // Delete Blog Function
// export async function DELETE(request: NextRequest) {
//     try {
//         const searchParams = request.nextUrl.searchParams;
//         const id = searchParams.get('id');
//         if (!id) throw "ID Required"
//         let snapshot = await supabase.from("blogsUsers").select("*").eq("id", id).single();
//         let user: UserInterface = snapshot.data
//         const data = {
//             deletedAt: new Date(),
//             username: `__deleted.${user.username}`,
//             status: "Deleted"
//         }
//         user = { ...user, ...data }

//         snapshot = await supabase.from("blogsUsers").update(user).eq("id", id).select("*").single()
//         user = snapshot.data
//         if (snapshot.error) console.log("error updating data")
//         else console.log("update data berhasil")

//         return NextResponse.json({
//             success: true,
//             detail: "Berhasil menghapus pengguna"
//         });

//     } catch (error) {
//         console.error('Error processing blog:', error);
//         return NextResponse.json(
//             { error: 'Failed to process blog' },
//             { status: 500 }
//         );
//     }
// }
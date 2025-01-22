import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import fs from 'fs';
import { supabase } from '@/utils/supabase';
import { HtmlParser } from '@/utils/htmlParser';

// Get Blog Function
export async function GET(request: NextRequest, { params }: any) {
    try {
        const searchParams = request.nextUrl.searchParams;
        params = await params
        const id = params.id;

        let snapshot: any = supabase.from("blogsPagesComments")
            .select("*")
            .is('deletedAt', 'null')
            .eq('pagesId', id)
            .order('createdAt', { ascending: false })
            .limit(10);
        return NextResponse.json({
            success: true,
            data: snapshot.data || [],
        });

    } catch (error) {
        console.error('Error processing blog:', error);
        return NextResponse.json(
            { error: error ?? 'Failed to process blog' },
            { status: 500 }
        );
    }
}

// Insert Blog Function
export async function POST(request: NextRequest, { params }: any) {
    try {
        const searchParams = request.nextUrl.searchParams;
        params = await params
        const id = params.id;

        const username = searchParams.get('username');
        if (!username) throw "Username reqired"

        const data = await request.json();

        var snapshot = await supabase.from("blogsPagesComments").insert({ comment: data.comment, username: username, pagesId: id }).select('*').single();

        let comment = snapshot.data!

        return NextResponse.json({
            success: true,
            data: comment
        });

    } catch (error) {
        console.error('Error processing blog:', error);
        return NextResponse.json(
            { error: 'Failed to process blog' },
            { status: 500 }
        );
    }
}

// Update Blog Function
export async function PATCH(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const id = searchParams.get('id');
        if (!id) throw "ID Required"


        const data = await request.json();
        if (!id) throw "ID Required"
        let snapshot = await supabase.from("blogsPagesComments").select("*").eq("id", id).single();
        let result: UserInterface = snapshot.data
        result = { ...result, ...data }

        snapshot = await supabase.from("blogsPagesComments").update(result).eq("id", id).select("*").single()
        result = snapshot.data
        if (snapshot.error) console.log("error updating data")
        else console.log("update data berhasil")

        return NextResponse.json({
            success: true,
            data: result
        });


    } catch (error) {
        console.error('Error processing blog:', error);
        return NextResponse.json(
            { error: 'Failed to process blog' },
            { status: 500 }
        );
    }
}

// Delete Blog Function
export async function DELETE(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const id = searchParams.get('id');
        if (!id) throw "ID Required"
        let snapshot = await supabase.from("blogsPagesComments").select("*").eq("id", id).single();
        let user: UserInterface = snapshot.data
        const data = {
            deletedAt: new Date(),
            // username: `__deleted.${user.username}`,
            status: "Deleted"
        }
        user = { ...user, ...data }

        snapshot = await supabase.from("blogsPagesComments").update(user).eq("id", id).select("*").single()
        user = snapshot.data
        if (snapshot.error) console.log("error updating data")
        else console.log("update data berhasil")

        return NextResponse.json({
            success: true,
            detail: "Berhasil menghapus pengguna"
        });

    } catch (error) {
        console.error('Error processing blog:', error);
        return NextResponse.json(
            { error: 'Failed to process blog' },
            { status: 500 }
        );
    }
}

// Asset path
function assetdir(id?: string) {
    return path.join(process.cwd(), 'public', `uploads${id ? `/${id}` : ""}`);
}
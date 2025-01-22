import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import fs from 'fs';
import { supabase } from '@/utils/supabase';
import { HtmlParser } from '@/utils/htmlParser';

// Get Blog Function
export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const id = searchParams.get('id');
        const tag = searchParams.get('tag');
        const before = searchParams.get('before');
        const after = searchParams.get('after');
        console.log(tag);
        let snapshot: any = supabase.from("blogsPages")
            .select("*")
            .is('deletedAt', 'null')
            .contains('tags', [tag ?? "Public"])
            .order('createdAt', { ascending: false })
            .limit(10);
        if (after) snapshot = snapshot.gt('id', after);
        if (before) snapshot = snapshot.lt('id', before);
        if (id) snapshot = snapshot.eq("id", id).single()
        snapshot = await snapshot


        if (id) {
            if (!snapshot.data) throw "Tidak ada data"
            const { error } = await supabase.from("blogsPages").update({
                clickTimes: 1 + snapshot.data.clickTimes
            }).eq("id", id).single()
            if (error) console.log("Error update data", error)
        } else {
            console.log("id tidak ada")
        }
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
export async function POST(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const username = searchParams.get('username');
        if (!username) throw "Username reqired"

        const data = await request.json();
        let html = data.html;

        const blobRegex = /src="blob:([^"]+)"/g;
        const base64Regex = /src="data:image\/[^;]+;base64[^"]+"/g;

        const base64Images = html.match(base64Regex) || [];
        var snapshot = await supabase.from("blogsPages").insert({ blogId: 1, content: "" }).select('id').single();

        for (const base64Image of base64Images) {
            const imageData = base64Image.replace(/^src="(.*)"$/, '$1');
            const imagePath = await saveImage(imageData, `${snapshot.data!.id ?? "untitled"}`);
            html = html.replace(base64Image, `src="${imagePath}"`);
        }

        const parser = new HtmlParser(html);
        const parsed = parser.parse();

        let post: BlogPostInterface = { ...parsed, username };

        snapshot = await supabase.from("blogsPages").insert(post).eq("id", snapshot.data!.id).select("*").single()
        post = snapshot.data!

        return NextResponse.json({
            success: true,
            data: post
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
        await request
        const contentType = request.headers.get('content-type');
        console.log(contentType)

        let data: any;
        try {
            if (contentType?.includes('text/plain;')) {
                data = JSON.parse(await request.text());
            }
            else
                data = await request.json();
        } catch (error) {
            data = JSON.parse(await request.text());
        }
        let html = data.html;
        console.log(html)
        const base64Regex = /src="data:image\/[^;]+;base64[^"]+"/g;

        const base64Images = html.match(base64Regex) || [];
        for (const base64Image of base64Images) {
            const imageData = base64Image.replace(/^src="(.*)"$/, '$1');
            const imagePath = await saveImage(imageData, id);
            html = html.replace(base64Image, `src="${imagePath}"`);
        }

        const parser = new HtmlParser(html);
        const parsed = parser.parse();

        var snapshot = await supabase.from("blogsPages").update({
            title: parsed.title,
            cover: parsed.cover,
            shortContent: parsed.shortContent,
            meta: parsed.meta,
            readingTime: parsed.meta.readingTime,
            hasImages: parsed.meta.hasImages,
            content: html,
            updatedAt: new Date()
        }).eq("id", id).select().single()
        // console.log(html)
        if (snapshot.error) console.log("error updating data")
        else console.log("update data berhasil")

        return NextResponse.json({
            success: true,
            data: snapshot.data
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

        try {
            const directoryPath = path.join(process.cwd(), 'public/assets');
            const files = fs.readdirSync(directoryPath);

            files.forEach((file) => {
                const filePath = path.join(directoryPath, file);
                fs.unlinkSync(filePath);
            });

        } catch (error) {
            // 
        }

        await supabase.from("blogsPages").update({ deletedAt: new Date() }).eq('id', id).select().single()

        return NextResponse.json({
            meta: {
                code: 200,
                status: "Ok",
                message: "Success Delete "
            },
        });

    } catch (error) {
        console.error('Error processing blog:', error);
        return NextResponse.json(
            { error: 'Failed to process blog' },
            { status: 500 }
        );
    }
}

// Save Image Function
async function saveImage(imageData: string, id: string): Promise<string> {
    const matches = imageData.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);

    if (!matches || matches.length !== 3) {
        throw new Error('Invalid image data');
    }

    const fileType = matches[1];
    const base64Data = matches[2];
    const buffer = Buffer.from(base64Data, 'base64');

    const fileName = `${Date.now()}.${fileType.split('/')[1]}`;
    const filePath = path.join(assetdir(id), fileName);

    await writeFile(filePath, buffer);

    return `/uploads/${id}/${fileName}`;
}

// Asset path
function assetdir(id?: string) {
    return path.join(process.cwd(), 'public', `uploads${id ? `/${id}` : ""}`);
}
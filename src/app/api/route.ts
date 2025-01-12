import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    return NextResponse.json({
        detail: "Developer are here, stay back",
    });
}

import { NextResponse } from "next/server";
import pool from "@/lib/db"

export async function POST(req: Request) {
    const data = await req.json()

    const result = await pool.query(
        "INSERT INTO users (data) VALUEs ($1) RETURNING *",
        [data.item]
    )

    return NextResponse.json(result.rows[0])
}

export async function GET() {
    const result = await pool.query(
        "SELECT * FROM users ORDER BY id"
    )

    return NextResponse.json(result.rows)
}

export async function PUT(req: Request) {
    try{
        const data = await req.json();
        const id = data.id;
        const item = data.item;

        if (!id || !item || typeof item !== "string"){
            return NextResponse.json(
                {error: "id and item is requored"},
                {status: 400}
            );
        }

        const result = await pool.query(
            "UPDATE users SET data = $1 WHERE id = $2 RETURNING *",
            [item, id]
        )

        if (result.rows.length === 0){
            return NextResponse.json(
                {error:"item is not found"},
                {status:404}
            )
        } 
        
        return NextResponse.json(result.rows[0])
    } catch(error){
        console.error("UPDATE error:", error);
        return NextResponse.json(
            {error:"Faild to update"},
            {status:500}
        )
    }
  
}

export async function DELETE(req: Request) {
    try{
        const url = new URL(req.url);
        const id = url.searchParams.get("id")

        if(!id){
            return NextResponse.json(
                {error:"id is required"},
                {status: 400}
            )
        }

        const result = await pool.query(
            "DELETE FROM users WHERE id = $1 RETURNING *",
            [id]
        )

        if(result.rows.length === 0){
            return NextResponse.json(
                {error:"items is not found"},
                {status: 404}
            )
        }

        return NextResponse.json(result.rows[0])
    }catch(error){
        console.error("DELETE error:", error);
        return NextResponse.json(
            {error:"Faild to delete"},
            {status: 500}
        )
    }

}
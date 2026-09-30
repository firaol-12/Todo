import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function POST(req: Request){
    const data = await req.json();

    const result = await pool.query(
        "INSERT INTO users (data) VALUES ($1) RETURNING *",
        [data.item]
    );

    return NextResponse.json(result.rows[0]);
}

export async function GET() {
  const result = await pool.query(
    "SELECT * FROM users"
  );

  return NextResponse.json(result.rows);
}
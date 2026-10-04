import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function POST(req: Request) {
  const data = await req.json();

  const result = await pool.query(
    "INSERT INTO users (data) VALUES ($1) RETURNING *",
    [data.item]
  );

  return NextResponse.json(result.rows[0]);
}

export async function GET() {
  const result = await pool.query(
    "SELECT * FROM users ORDER BY id"
  );

  return NextResponse.json(result.rows);
}

// PUT
export async function PUT(req: Request) {
  try {
    const body = await req.json();

    const id = body.id;
    const item = body.item;

    if (!id || !item || typeof item !== "string") {
      return NextResponse.json(
        { error: "id and item are required" },
        { status: 400 }
      );
    }

    const result = await pool.query(
      "UPDATE users SET data = $1 WHERE id = $2 RETURNING *",
      [item, id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: "Item not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(result.rows[0]);

  } catch (error) {

    console.error("PUT error:", error);

    return NextResponse.json(
      { error: "Failed to update item" },
      { status: 500 }
    );
  }
}


// DELETE
export async function DELETE(req: Request) {
  try {

    const url = new URL(req.url);

    const id = url.searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "id is required" },
        { status: 400 }
      );
    }

    const result = await pool.query(
      "DELETE FROM users WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: "Item not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(result.rows[0]);

  } catch (error) {

    console.error("DELETE error:", error);

    return NextResponse.json(
      { error: "Failed to delete item" },
      { status: 500 }
    );
  }
}
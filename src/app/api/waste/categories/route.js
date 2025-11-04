import sql from "@/app/api/utils/sql";

export async function GET(request) {
  try {
    const categories = await sql`
      SELECT * FROM waste_categories 
      ORDER BY name ASC
    `;

    return Response.json({
      data: categories,
    });
  } catch (error) {
    console.error("Categories fetch error:", error);
    return Response.json(
      { error: "Failed to fetch categories" },
      { status: 500 },
    );
  }
}

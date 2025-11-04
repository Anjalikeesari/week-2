import sql from "@/app/api/utils/sql";

export async function GET(request) {
  try {
    const url = new URL(request.url);
    const limit = parseInt(url.searchParams.get("limit")) || 20;
    const offset = parseInt(url.searchParams.get("offset")) || 0;

    const history = await sql`
      SELECT 
        h.id,
        h.waste_category_id,
        h.image_url,
        h.detected_items,
        h.confidence_score,
        h.is_correct,
        h.user_feedback,
        h.created_at,
        w.name as category_name,
        w.color_code,
        w.disposal_instructions
      FROM classification_history h
      LEFT JOIN waste_categories w ON h.waste_category_id = w.id
      ORDER BY h.created_at DESC
      LIMIT ${limit} OFFSET ${offset}
    `;

    const total = await sql`
      SELECT COUNT(*) as count FROM classification_history
    `;

    return Response.json({
      data: history,
      total: total[0].count,
      limit,
      offset,
    });
  } catch (error) {
    console.error("History fetch error:", error);
    return Response.json({ error: "Failed to fetch history" }, { status: 500 });
  }
}

import sql from "@/app/api/utils/sql";

export async function GET(request, { params: { id } }) {
  try {
    const item = await sql`
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
        w.description,
        w.disposal_instructions,
        w.environmental_impact
      FROM classification_history h
      LEFT JOIN waste_categories w ON h.waste_category_id = w.id
      WHERE h.id = ${parseInt(id)}
    `;

    if (item.length === 0) {
      return Response.json(
        { error: "Classification not found" },
        { status: 404 },
      );
    }

    return Response.json({
      data: item[0],
    });
  } catch (error) {
    console.error("History item fetch error:", error);
    return Response.json(
      { error: "Failed to fetch classification" },
      { status: 500 },
    );
  }
}

export async function PATCH(request, { params: { id } }) {
  try {
    const { is_correct, user_feedback } = await request.json();

    const result = await sql`
      UPDATE classification_history
      SET 
        is_correct = COALESCE(${is_correct !== undefined ? is_correct : null}, is_correct),
        user_feedback = COALESCE(${user_feedback !== undefined ? user_feedback : null}, user_feedback),
        updated_at = NOW()
      WHERE id = ${parseInt(id)}
      RETURNING *
    `;

    if (result.length === 0) {
      return Response.json(
        { error: "Classification not found" },
        { status: 404 },
      );
    }

    return Response.json({
      data: result[0],
    });
  } catch (error) {
    console.error("History item update error:", error);
    return Response.json(
      { error: "Failed to update classification" },
      { status: 500 },
    );
  }
}

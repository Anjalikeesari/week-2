import sql from "@/app/api/utils/sql";

export async function POST(request) {
  try {
    const { imageBase64, imageUrl } = await request.json();

    if (!imageBase64 && !imageUrl) {
      return Response.json(
        { error: "Either imageBase64 or imageUrl is required" },
        { status: 400 },
      );
    }

    // Prepare the image for vision API
    const imageContent = imageBase64
      ? `data:image/jpeg;base64,${imageBase64}`
      : imageUrl;

    // Call GPT-4 Vision to classify the waste
    const visionResponse = await fetch("/integrations/gpt-vision/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: [
          {
            role: "system",
            content:
              "You are a waste classification expert. Analyze the image and classify the waste item(s) into one of these categories: Plastic, Paper & Cardboard, Glass, Organic/Food Waste, Metal, Electronics, Hazardous Waste, or General/Mixed Waste. Respond with a JSON object containing: { category: string, detected_items: string[], confidence: number (0-1), reasoning: string }",
          },
          {
            role: "user",
            content: [
              {
                type: "text",
                text: "Classify this waste item and provide disposal recommendations.",
              },
              {
                type: "image_url",
                image_url: {
                  url: imageContent,
                },
              },
            ],
          },
        ],
      }),
    });

    if (!visionResponse.ok) {
      console.error("Vision API error:", await visionResponse.text());
      return Response.json(
        { error: "Failed to classify image" },
        { status: 500 },
      );
    }

    const visionData = await visionResponse.json();
    const classificationText = visionData.choices[0].message.content;

    // Parse the classification response
    let classification;
    try {
      const jsonMatch = classificationText.match(/\{[\s\S]*\}/);
      classification = jsonMatch
        ? JSON.parse(jsonMatch[0])
        : {
            category: "General/Mixed Waste",
            detected_items: ["Unknown item"],
            confidence: 0.5,
            reasoning: classificationText,
          };
    } catch (e) {
      classification = {
        category: "General/Mixed Waste",
        detected_items: ["Unknown item"],
        confidence: 0.5,
        reasoning: classificationText,
      };
    }

    // Get waste category from database
    const categoryResult = await sql`
      SELECT * FROM waste_categories 
      WHERE LOWER(name) = LOWER(${classification.category})
    `;

    const wasteCategory = categoryResult[0] || categoryResult[0];

    if (!wasteCategory) {
      return Response.json(
        { error: "Could not find waste category" },
        { status: 500 },
      );
    }

    // Store the classification in history
    const historyResult = await sql`
      INSERT INTO classification_history 
      (waste_category_id, image_url, detected_items, confidence_score, created_at)
      VALUES 
      (${wasteCategory.id}, ${imageUrl || "base64_image"}, ${JSON.stringify(
        classification.detected_items,
      )}, ${classification.confidence}, NOW())
      RETURNING *
    `;

    return Response.json({
      classification: {
        id: historyResult[0].id,
        category: wasteCategory.name,
        colorCode: wasteCategory.color_code,
        description: wasteCategory.description,
        disposalInstructions: wasteCategory.disposal_instructions,
        environmentalImpact: wasteCategory.environmental_impact,
        detectedItems: classification.detected_items,
        confidence: Math.round(classification.confidence * 100),
        reasoning: classification.reasoning,
      },
      historyId: historyResult[0].id,
    });
  } catch (error) {
    console.error("Classification error:", error);
    return Response.json(
      { error: "Failed to classify waste" },
      { status: 500 },
    );
  }
}

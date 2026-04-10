import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { markdownContent, accessToken } = await req.json();

    if (!markdownContent) {
      return NextResponse.json({ error: "No markdown content provided" }, { status: 400 });
    }

    if (!accessToken) {
      return NextResponse.json({ error: "Missing Google Docs access token" }, { status: 401 });
    }

    // 1. Create an empty document
    const createDocRes = await fetch("https://docs.googleapis.com/v1/documents", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${accessToken}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        title: "Epistemological Synthesis Report"
      })
    });

    if (!createDocRes.ok) {
      const err = await createDocRes.text();
      throw new Error(`Failed to create Google Doc: ${err}`);
    }

    const doc = await createDocRes.json();
    const documentId = doc.documentId;

    // 2. Parse Markdown and map to Google Docs batchUpdate commands
    // A simplified parser for demonstration. In production, a robust markdown AST parser
    // like marked or remark would be used to build deep nested structural commands.
    const requests: any[] = [];
    let currentIndex = 1;

    const lines = markdownContent.split('\n');
    for (const line of lines) {
      const textToInsert = line + '\n';
      requests.push({
        insertText: {
          location: { index: currentIndex },
          text: textToInsert
        }
      });

      let style = "NORMAL_TEXT";
      if (line.startsWith('### ')) style = "HEADING_3";
      else if (line.startsWith('## ')) style = "HEADING_2";
      else if (line.startsWith('# ')) style = "HEADING_1";
      else if (line.startsWith('#### ')) style = "HEADING_4";

      if (style !== "NORMAL_TEXT") {
        requests.push({
          updateParagraphStyle: {
            range: {
              startIndex: currentIndex,
              endIndex: currentIndex + textToInsert.length
            },
            paragraphStyle: { namedStyleType: style },
            fields: "namedStyleType"
          }
        });
      }

      currentIndex += textToInsert.length;
    }

    // Reverse requests so index shifting doesn't mess up subsequent inserts
    requests.reverse();

    // 3. Batch Update Document
    const updateRes = await fetch(`https://docs.googleapis.com/v1/documents/${documentId}:batchUpdate`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${accessToken}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ requests })
    });

    if (!updateRes.ok) {
      const err = await updateRes.text();
      throw new Error(`Failed to batch update Google Doc: ${err}`);
    }

    return NextResponse.json({ success: true, documentId, url: `https://docs.google.com/document/d/${documentId}/edit` });

  } catch (error: any) {
    console.error("Export Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

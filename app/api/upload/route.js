
import { NextResponse } from "next/server";
import { getStorage } from "@/lib/database";

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");
    const path = formData.get("path") || "uploads";

    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const filename = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const uniqueFilename = `${Date.now()}-${filename}`;
    const destination = `${path}/${uniqueFilename}`;

    const bucketName = process.env.GCP_STORAGE_BUCKET || `${process.env.GCP_PROJECT_ID}.appspot.com`;
    const bucket = getStorage().bucket(bucketName);
    const fileRef = bucket.file(destination);

    await fileRef.save(buffer, {
      metadata: {
        contentType: file.type,
      },
      resumable: false,
    });

    // Make the file public (optional, depending on security requirements)
    // For admin images, typically we want them public
    await fileRef.makePublic();

    // Construct the public URL
    // Format: https://storage.googleapis.com/<bucket-name>/<path>
    // OR https://firebasestorage.googleapis.com/v0/b/<bucket-name>/o/<encoded-path>?alt=media
    
    // Using makePublic() allows direct access via storage.googleapis.com if bucket controls allow
    // But signed URLs or firebasestorage URLs are often preferred for flexibility.
    
    // Let's use getSignedUrl for read access if makePublic fails or returns different format,
    // but makePublic + publicUrl is simplest for static assets.
    const publicUrl = `https://storage.googleapis.com/${bucket.name}/${destination}`;

    return NextResponse.json({ 
        success: true, 
        url: publicUrl,
        filename: uniqueFilename
    });

  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}

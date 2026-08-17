// import { NextResponse } from "next/server";
// import { revalidatePath } from "next/cache";
// import Developer from "@/lib/models/Developer";
// import { protect } from "@/lib/middleware/auth";

// // Purge the cached (ISR) developer page so admin edits — including SEO meta
// // fields (metaTitle, metaDescription, canonicalUrl) — reflect immediately
// // instead of after the 300s revalidate window.
// const revalidateDeveloper = (slug) => {
//   if (slug) revalidatePath(`/developers/${slug}`);
// };

// const pickDeveloperFields = (body) => {
//   const allowedFields = [
//     "name",
//     "slug",
//     "logo",
//     "banner",
//     "tagline",
//     "description",
//     "about",
//     "aboutBlocks", // ← added: array of { image, text } for the 3-block About layout
//     "impactPoints",
//     "metaTitle",
//     "metaDescription",
//     "metaKeywords",
//     "canonicalUrl",
//   ];

//   return Object.fromEntries(
//     allowedFields
//       .filter((field) => Object.prototype.hasOwnProperty.call(body, field))
//       .map((field) => [field, body[field]]),
//   );
// };

// export async function GET(request, { params }) {
//   try {
//     const { id } = await params;
//     // Support lookup by slug too
//     let developer = await Developer.getById(id);
//     if (!developer) {
//       developer = await Developer.getBySlug(id);
//     }
//     if (!developer) {
//       return NextResponse.json(
//         { success: false, error: "Developer not found" },
//         { status: 404 },
//       );
//     }
//     return NextResponse.json({ success: true, data: developer });
//   } catch (error) {
//     return NextResponse.json(
//       { success: false, error: error.message },
//       { status: 500 },
//     );
//   }
// }

// export async function PUT(request, { params }) {
//   try {
//     const authResult = await protect(request);
//     if (authResult.error) {
//       return NextResponse.json(authResult.error, {
//         status: authResult.error.statusCode,
//       });
//     }

//     const { id } = await params;
//     const existing = await Developer.getById(id);
//     const body = await request.json();
//     // const developer = await Developer.update(id, pickDeveloperFields(body));

//     // --- TEMPORARY DEBUG LOGGING — remove once this is confirmed fixed ---
//     console.log(
//       "[developers PUT] incoming body has schema key?",
//       Object.prototype.hasOwnProperty.call(body, "schema"),
//     );
//     console.log(
//       "[developers PUT] incoming body.schema:",
//       JSON.stringify(body.schema),
//     );
//     const picked = pickDeveloperFields(body);
//     console.log("[developers PUT] picked fields keys:", Object.keys(picked));
//     console.log(
//       "[developers PUT] picked.schema:",
//       JSON.stringify(picked.schema),
//     );
//     // --- END DEBUG LOGGING ---

//     const developer = await Developer.update(id, picked);

//     // --- TEMPORARY DEBUG LOGGING ---
//     console.log(
//       "[developers PUT] returned developer.schema:",
//       JSON.stringify(developer?.schema),
//     );
//     // --- END DEBUG LOGGING ---

//     if (!developer) {
//       return NextResponse.json(
//         { success: false, error: "Developer not found" },
//         { status: 404 },
//       );
//     }
//     // Revalidate both the new and previous slug (in case the slug changed).
//     revalidateDeveloper(developer.slug || body.slug);
//     if (existing?.slug && existing.slug !== developer.slug)
//       revalidateDeveloper(existing.slug);
//     return NextResponse.json({ success: true, data: developer });
//   } catch (error) {
//     return NextResponse.json(
//       { success: false, error: error.message },
//       { status: 500 },
//     );
//   }
// }

// export async function DELETE(request, { params }) {
//   try {
//     const authResult = await protect(request);
//     if (authResult.error) {
//       return NextResponse.json(authResult.error, {
//         status: authResult.error.statusCode,
//       });
//     }

//     const { id } = await params;
//     const existing = await Developer.getById(id);
//     await Developer.delete(id);
//     revalidateDeveloper(existing?.slug);
//     return NextResponse.json({ success: true, message: "Developer deleted" });
//   } catch (error) {
//     return NextResponse.json(
//       { success: false, error: error.message },
//       { status: 500 },
//     );
//   }
// }

import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import Developer from "@/lib/models/Developer";
import { protect } from "@/lib/middleware/auth";

// Purge the cached (ISR) developer page so admin edits — including SEO meta
// fields (metaTitle, metaDescription, canonicalUrl) — reflect immediately
// instead of after the 300s revalidate window.
const revalidateDeveloper = (slug) => {
  if (slug) revalidatePath(`/developers/${slug}`);
};

const pickDeveloperFields = (body) => {
  const allowedFields = [
    "name",
    "slug",
    "logo",
    "banner",
    "tagline",
    "description",
    "about",
    "aboutBlocks", // array of { image, text } for the 3-block About layout
    "impactPoints",
    "metaTitle",
    "metaDescription",
    "metaKeywords",
    "canonicalUrl",
    "schema", // ← this was missing — structured data (Schema.org JSON-LD) was being silently stripped
  ];

  return Object.fromEntries(
    allowedFields
      .filter((field) => Object.prototype.hasOwnProperty.call(body, field))
      .map((field) => [field, body[field]]),
  );
};

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    // Support lookup by slug too
    let developer = await Developer.getById(id);
    if (!developer) {
      developer = await Developer.getBySlug(id);
    }
    if (!developer) {
      return NextResponse.json(
        { success: false, error: "Developer not found" },
        { status: 404 },
      );
    }
    return NextResponse.json({ success: true, data: developer });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}

export async function PUT(request, { params }) {
  try {
    const authResult = await protect(request);
    if (authResult.error) {
      return NextResponse.json(authResult.error, {
        status: authResult.error.statusCode,
      });
    }

    const { id } = await params;
    const existing = await Developer.getById(id);
    const body = await request.json();

    // --- TEMPORARY DEBUG LOGGING — keep for one more save to confirm the
    // fix, then remove these 4 lines. ---
    console.log(
      "[developers PUT] incoming body has schema key?",
      Object.prototype.hasOwnProperty.call(body, "schema"),
    );
    const picked = pickDeveloperFields(body);
    console.log("[developers PUT] picked fields keys:", Object.keys(picked));
    console.log(
      "[developers PUT] picked.schema:",
      JSON.stringify(picked.schema),
    );
    // --- END DEBUG LOGGING ---

    const developer = await Developer.update(id, picked);

    if (!developer) {
      return NextResponse.json(
        { success: false, error: "Developer not found" },
        { status: 404 },
      );
    }
    // Revalidate both the new and previous slug (in case the slug changed).
    revalidateDeveloper(developer.slug || body.slug);
    if (existing?.slug && existing.slug !== developer.slug)
      revalidateDeveloper(existing.slug);
    return NextResponse.json({ success: true, data: developer });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const authResult = await protect(request);
    if (authResult.error) {
      return NextResponse.json(authResult.error, {
        status: authResult.error.statusCode,
      });
    }

    const { id } = await params;
    const existing = await Developer.getById(id);
    await Developer.delete(id);
    revalidateDeveloper(existing?.slug);
    return NextResponse.json({ success: true, message: "Developer deleted" });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}

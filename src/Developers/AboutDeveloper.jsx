// import { sanitizeHtml } from "@/lib/utils/sanitizeHtml";
// import AnimatedImage from "./AnimatedImage";

// export default function AboutDeveloper({ builderName, developer }) {
//   const description = developer?.description;

//   const aboutBlocks = Array.isArray(developer?.aboutBlocks)
//     ? developer.aboutBlocks.filter(
//         (block) => block?.text?.trim() || block?.image,
//       )
//     : [];

//   // New developers: 3 paragraph + image blocks
//   if (aboutBlocks.length > 0) {
//     return (
//       <section className="py-10 max-w-7xl mx-auto px-4">
//         <h2 className="text-4xl font-semibold mb-4">About {builderName}</h2>

//         {description && (
//           <p className="text-ochre font-medium text-lg mb-8">{description}</p>
//         )}

//         <div className="space-y-12">
//           {aboutBlocks.map((block, i) => {
//             const text = block.text || "";
//             const hasHtml = /<[a-z][\s\S]*?>/i.test(text);
//             const blockHtml = hasHtml
//               ? sanitizeHtml(text)
//               : text.replace(/\n/g, "<br />");

//             // Fixed literal class strings (not interpolated) so Tailwind's
//             // JIT scanner picks them up — alternate the image side per block.
//             const imageWrapperClass =
//               i % 2 === 0
//                 ? "w-full md:w-1/2  mb-6 md:mb-3 md:float-left md:mr-10"
//                 : "w-full md:w-1/2  mb-6 md:mb-3 md:float-right md:ml-10";

//             return (
//               <div
//                 key={i}
//                 className={`flex flex-col md:flex-row items-center gap-8 ${
//                   i % 2 === 1 ? "md:flex-row-reverse" : ""
//                 }`}
//               >
//                 {/* {block.image && (
//                   <img
//                     src={block.image}
//                     alt={`${builderName} — highlight ${i + 1}`}
//                     className="w-full md:w-1/2 h-64 md:h-96 rounded-xl object-cover"
//                   />
//                 )} */}
//                 {block.image && (
//                   <div className={imageWrapperClass}>
//                     {/* Fixed aspect ratio keeps every image the same
//                           proportions regardless of the source file's
//                           original dimensions. Fades + slides up the first
//                           time it scrolls into view. */}
//                     <AnimatedImage
//                       src={block.image}
//                       alt={`${builderName} — highlight ${i + 1}`}
//                       wrapperClassName="rounded-2xl overflow-hidden shadow-xl ring-1 ring-black/5"
//                       imgClassName="w-full aspect-[4/3] object-cover"
//                       delayMs={i * 100}
//                     />
//                   </div>
//                 )}
//                 {text && (
//                   <div
//                     className={`rich-text text-gray-600 leading-relaxed ${
//                       block.image ? "w-full md:w-1/2" : "w-full"
//                     }`}
//                     dangerouslySetInnerHTML={{ __html: blockHtml }}
//                   />
//                 )}
//               </div>
//             );
//           })}
//         </div>
//       </section>
//     );
//   }

//   // Legacy fallback: developers that only have the old single rich-text `about` field
//   const about =
//     developer?.about ||
//     `${builderName} is a reputed real estate developer known for delivering high-quality residential and commercial projects. With a strong presence in major cities, they focus on modern design, quality construction, and timely delivery.`;

//   const hasHtml = /<[a-z][\s\S]*?>/i.test(about);
//   const aboutHtml = hasHtml
//     ? sanitizeHtml(about)
//     : about.replace(/\n/g, "<br />");

//   return (
//     <section className="py-10 max-w-7xl mx-auto px-4">
//       <h2 className="text-4xl font-semibold mb-4">About {builderName}</h2>

//       {description && (
//         <p className="text-ochre font-medium text-lg mb-3">{description}</p>
//       )}

//       <div
//         className="rich-text text-gray-600"
//         dangerouslySetInnerHTML={{ __html: aboutHtml }}
//       />
//     </section>
//   );
// }

import { sanitizeHtml } from "@/lib/utils/sanitizeHtml";
import AnimatedImage from "./AnimatedImage";

export default function AboutDeveloper({ builderName, developer }) {
  const description = developer?.description;

  const aboutBlocks = Array.isArray(developer?.aboutBlocks)
    ? developer.aboutBlocks.filter(
        (block) => block?.text?.trim() || block?.image,
      )
    : [];

  // New developers: paragraph + image blocks
  if (aboutBlocks.length > 0) {
    return (
      <section className="py-10 max-w-7xl mx-auto px-4">
        <h2 className="text-4xl font-semibold mb-4">About {builderName}</h2>

        {description && (
          <p className="text-ochre font-medium text-lg mb-8">{description}</p>
        )}

        <div className="space-y-12">
          {aboutBlocks.map((block, i) => {
            const text = block.text || "";

            const hasHtml = /<[a-z][\s\S]*?>/i.test(text);

            const blockHtml = hasHtml
              ? sanitizeHtml(text)
              : text.replace(/\n/g, "<br />");

            return (
              <div
                key={i}
                className={`flex flex-col md:flex-row items-stretch gap-8 ${
                  i % 2 === 1 ? "md:flex-row-reverse" : ""
                }`}
              >
                {/* Image */}
                {block.image && (
                  <div className="w-full md:w-1/2 flex">
                    <AnimatedImage
                      src={block.image}
                      alt={`${builderName} — highlight ${i + 1}`}
                      wrapperClassName="w-full h-full min-h-full rounded-2xl overflow-hidden shadow-xl ring-1 ring-black/5"
                      imgClassName="w-full h-full object-cover"
                      delayMs={i * 100}
                    />
                  </div>
                )}

                {/* Text */}
                {text && (
                  <div
                    className={`rich-text text-gray-600 leading-relaxed ${
                      block.image ? "w-full md:w-1/2" : "w-full"
                    }`}
                    dangerouslySetInnerHTML={{ __html: blockHtml }}
                  />
                )}
              </div>
            );
          })}
        </div>
      </section>
    );
  }

  // Legacy fallback
  const about =
    developer?.about ||
    `${builderName} is a reputed real estate developer known for delivering high-quality residential and commercial projects. With a strong presence in major cities, they focus on modern design, quality construction, and timely delivery.`;

  const hasHtml = /<[a-z][\s\S]*?>/i.test(about);

  const aboutHtml = hasHtml
    ? sanitizeHtml(about)
    : about.replace(/\n/g, "<br />");

  return (
    <section className="py-10 max-w-7xl mx-auto px-4">
      <h2 className="text-4xl font-semibold mb-4">About {builderName}</h2>

      {description && (
        <p className="text-ochre font-medium text-lg mb-3">{description}</p>
      )}

      <div
        className="rich-text text-gray-600"
        dangerouslySetInnerHTML={{ __html: aboutHtml }}
      />
    </section>
  );
}

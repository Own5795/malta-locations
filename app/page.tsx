import SearchExperience from "@/components/SearchExperience";
import { locations } from "@/data/locations";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ view?: string }>;
}) {
  const { view } = await searchParams;

  const itemList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Film & photography locations in Malta, Gozo and Comino",
    numberOfItems: locations.length,
    itemListElement: locations.map((l, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `https://malta-locations.vercel.app/locations/${l.slug}`,
      name: l.title,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemList) }}
      />
      <SearchExperience initialMap={view === "map"} />
    </>
  );
}

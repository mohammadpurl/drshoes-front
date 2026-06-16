import Script from "next/script";

function schemaId(schema: object, index: number): string {
  const raw = JSON.stringify(schema);
  let hash = 0;
  for (let i = 0; i < raw.length; i += 1) {
    hash = (hash << 5) - hash + raw.charCodeAt(i);
    hash |= 0;
  }
  return `json-ld-${index}-${Math.abs(hash)}`;
}

export function JsonLd({ data }: { data: object | object[] }) {
  const schemas = Array.isArray(data) ? data : [data];

  return (
    <>
      {schemas.map((schema, i) => (
        <Script
          key={schemaId(schema, i)}
          id={schemaId(schema, i)}
          type="application/ld+json"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
    </>
  );
}

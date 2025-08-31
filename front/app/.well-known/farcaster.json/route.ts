function withValidProperties(
  properties: Record<string, undefined | string | string[]>,
) {
  return Object.fromEntries(
    Object.entries(properties).filter(([key, value]) => {
      if (Array.isArray(value)) {
        return value.length > 0;
      }
      return !!value;
    }),
  );
}

export async function GET() {
  const URL = process.env.NEXT_PUBLIC_URL;

  return Response.json({
    accountAssociation: {
      header: "eyJmaWQiOjQxNDU3MCwidHlwZSI6ImN1c3RvZHkiLCJrZXkiOiIweDlERDNmNDk2YTAyOGQxQTVFMzFmMjM5MTNGMzdCZjQ2QUMxQjY0QTcifQ",
      payload: "eyJkb21haW4iOiJ0dS1jYXVzYS52ZXJjZWwuYXBwIn0",
      signature: "MHhkYzc4NGYzNzBkZWUzMjQwZDIxODAwMzBiYzdiZmI4OTA2NzhlZjE4N2VmNGEzMjg2OWFhNmZiZjM5ZTAyZTdmMGFhYzA3ZGY0ZWMwOGY5MTVhMTlhZjQ1MjRiZDI2MThlNjlmM2IyNmM1NDhhMjkxZTdlYTViNjg3MjI1YTE4YzFi"
    },
    frame: withValidProperties({
      version: "1",
      name: process.env.NEXT_PUBLIC_ONCHAINKIT_PROJECT_NAME,
      subtitle: process.env.NEXT_PUBLIC_APP_SUBTITLE,
      description: process.env.NEXT_PUBLIC_APP_DESCRIPTION,
      screenshotUrls: [],
      iconUrl: process.env.NEXT_PUBLIC_APP_ICON,
      splashImageUrl: process.env.NEXT_PUBLIC_APP_SPLASH_IMAGE,
      splashBackgroundColor: process.env.NEXT_PUBLIC_SPLASH_BACKGROUND_COLOR,
      homeUrl: URL,
      webhookUrl: `${URL}/api/webhook`,
      primaryCategory: process.env.NEXT_PUBLIC_APP_PRIMARY_CATEGORY,
      tags: [],
      heroImageUrl: process.env.NEXT_PUBLIC_APP_HERO_IMAGE,
      tagline: process.env.NEXT_PUBLIC_APP_TAGLINE,
      ogTitle: process.env.NEXT_PUBLIC_APP_OG_TITLE,
      ogDescription: process.env.NEXT_PUBLIC_APP_OG_DESCRIPTION,
      ogImageUrl: process.env.NEXT_PUBLIC_APP_OG_IMAGE,
    }),
  });
}

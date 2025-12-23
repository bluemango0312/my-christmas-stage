export const runtime = 'edge';

export async function GET() {
    const body = `User-agent: *
Allow: /

Sitemap: https://my-christmas-stage.vercel.app/sitemap.xml
`;

    return new Response(body, {
        headers: {
            'Content-Type': 'text/plain; charset=utf-8',
            'Cache-Control': 'public, max-age=0, s-maxage=86400',
        },
    });
}

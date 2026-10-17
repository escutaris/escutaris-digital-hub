/**
 * Prévia do link de UM material no WhatsApp, LinkedIn, Facebook etc.
 *
 * O site é React: o título e a capa de /materiais/<slug> só aparecem depois que
 * o JavaScript roda, e o robô que monta a prévia não roda JavaScript. Sem isto,
 * todo link de material mostraria a prévia genérica da Comunidade.
 *
 * Só o robô recebe esta página mínima com as meta tags. Gente de verdade passa
 * direto (o middleware não devolve nada) e cai no site normal.
 */

export const config = {
  matcher: '/materiais/:slug*',
};

const SUPABASE_URL = 'https://ywmqphwdzbmntfusemkl.supabase.co';
// chave pública (anon), a mesma que já vai no site
const SUPABASE_ANON =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl3bXFwaHdkemJtbnRmdXNlbWtsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcxMjUzMDQsImV4cCI6MjA5MjcwMTMwNH0.ACLFQ5eaoqV2lS8uKlJlIB7uRpNj-ZrFTH9md5IXRDw';

const ROBOS =
  /whatsapp|facebookexternalhit|facebot|linkedinbot|twitterbot|slackbot|telegrambot|discordbot|skypeuripreview|googlebot|bingbot|pinterest|embedly|redditbot/i;

const escapar = (t: string) =>
  t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export default async function middleware(request: Request) {
  if (!ROBOS.test(request.headers.get('user-agent') || '')) return;

  const url = new URL(request.url);
  const slug = url.pathname.split('/')[2];
  if (!slug) return;

  let material: { title: string; description: string | null; cover_url: string | null } | undefined;
  try {
    const resp = await fetch(
      `${SUPABASE_URL}/rest/v1/materials?slug=eq.${encodeURIComponent(slug)}&select=title,description,cover_url`,
      { headers: { apikey: SUPABASE_ANON, Authorization: `Bearer ${SUPABASE_ANON}` } },
    );
    material = (await resp.json())?.[0];
  } catch {
    return;
  }
  if (!material) return;

  const titulo = escapar(material.title);
  const descricao = escapar(material.description || 'Material gratuito da Comunidade Escutaris.');
  const capa = material.cover_url ? new URL(material.cover_url, url.origin).href : '';
  const endereco = `${url.origin}/materiais/${slug}`;

  const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8" />
<title>${titulo} | Comunidade Escutaris</title>
<meta name="description" content="${descricao}" />
<link rel="canonical" href="${endereco}" />
<meta property="og:site_name" content="Comunidade Escutaris" />
<meta property="og:type" content="article" />
<meta property="og:locale" content="pt_BR" />
<meta property="og:url" content="${endereco}" />
<meta property="og:title" content="${titulo}" />
<meta property="og:description" content="${descricao}" />
${capa ? `<meta property="og:image" content="${capa}" />
<meta property="og:image:width" content="800" />
<meta property="og:image:height" content="450" />
<meta name="twitter:image" content="${capa}" />` : ''}
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="${titulo}" />
<meta name="twitter:description" content="${descricao}" />
</head>
<body>
<h1>${titulo}</h1>
<p>${descricao}</p>
<p><a href="${endereco}">Abrir na Comunidade Escutaris</a></p>
</body>
</html>`;

  return new Response(html, {
    headers: {
      'content-type': 'text/html; charset=utf-8',
      'cache-control': 'public, max-age=300, s-maxage=3600',
    },
  });
}

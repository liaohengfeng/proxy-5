addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  const url = new URL(request.url);

  // 新增：检查用户是否直接访问代理地址
  if (url.pathname === '/' || url.pathname === '/') {
    return createLandingPage();
  }

  const actualUrlStr = url.pathname.replace("/","") + url.search + url.hash

  const actualUrl = new URL(actualUrlStr)

  const modifiedRequest = new Request(actualUrl, {
    headers: request.headers,
    method: request.method,
    body: request.body,
    redirect: 'follow'
  });

  const response = await fetch(modifiedRequest);
  const modifiedResponse = new Response(response.body, response);

  // 添加允许跨域访问的响应头
  modifiedResponse.headers.set('Access-Control-Allow-Origin', '*');

  return modifiedResponse;
}

// 新增：创建引导页面
function createLandingPage() {
  const html = `
  <!DOCTYPE html>
  <html lang="en">
  `;
  
  return new Response(html, {
    headers: { 'Content-Type': 'text/html' }
  });
}

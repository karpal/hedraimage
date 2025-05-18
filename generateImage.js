export default async function generateImage(token, prompt) {
  const url = 'https://api.hedra.com/web-app/generations';

  const body = {
    type: 'image',
    ai_model_id: '5064bef6-38e5-4881-812f-4b682ac2cf88',
    text_prompt: prompt,
    aspect_ratio: '16:9',
    resolution: '540p'
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        accept: 'application/json',
        authorization: token,
        'content-type': 'application/json'
      },
      body: JSON.stringify(body)
    });

    if (!response.ok)
      throw new Error(`HTTP ${response.status} ${response.statusText}`);

    const data = await response.json();
    console.log(
      `[SUCCESS] "${prompt}" – token …${token.slice(-6)} →`,
      data.id ?? data
    );
    return data;
  } catch (err) {
    console.error(
      `[ERROR] "${prompt}" – token …${token.slice(-6)} →`,
      err.message
    );
  }
}

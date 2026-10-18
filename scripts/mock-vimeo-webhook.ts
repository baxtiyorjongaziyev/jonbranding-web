import fetch from 'node-fetch';

const webhookUrl = 'http://localhost:9002/api/vimeo-webhook?secret=TEST_SECRET';

const payload = {
  event: 'video.published',
  name: 'Almaz Shoes - Hikmatulloh Toxirov Testimonial',
  description: 'Hikmatulloh Toxirov, founder of Almaz Shoes, talks about how the new packaging increased sales by 40%.',
  link: 'https://player.vimeo.com/video/1205182267',
  type: 'video'
};

async function testWebhook() {
  console.log('Sending mock Vimeo webhook...');
  try {
    const res = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await res.json();
    console.log('Status:', res.status);
    console.log('Response:', data);
  } catch (error) {
    console.error('Error:', error);
  }
}

testWebhook();

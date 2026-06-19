import axios from 'axios';
export async function fetchInstagramPosts(usernameOrHashtag, limit = 20) {
    const apiKey = process.env.APIFY_API_KEY;
    if (!apiKey) {
        console.warn('[instagram] APIFY_API_KEY not set, using mock data');
        return getMockPosts(usernameOrHashtag, limit);
    }
    const isHashtag = usernameOrHashtag.startsWith('#');
    const actorId = isHashtag
        ? 'apify~instagram-hashtag-scraper'
        : 'apify~instagram-profile-scraper';
    const input = isHashtag
        ? { hashtag: usernameOrHashtag.replace('#', ''), resultsLimit: limit }
        : { username: usernameOrHashtag, resultsLimit: limit };
    try {
        const runRes = await axios.post(`https://api.apify.com/v2/acts/${actorId}/runs`, input, {
            params: { token: apiKey },
            timeout: 60_000,
        });
        const runId = runRes.data?.data?.id;
        if (!runId)
            throw new Error('No run ID returned');
        // Wait for run to finish (max 60s)
        for (let i = 0; i < 30; i++) {
            await new Promise((r) => setTimeout(r, 2000));
            const statusRes = await axios.get(`https://api.apify.com/v2/acts/${actorId}/runs/${runId}`, { params: { token: apiKey } });
            const status = statusRes.data?.data?.status;
            if (status === 'SUCCEEDED') {
                const dataRes = await axios.get(`https://api.apify.com/v2/acts/${actorId}/runs/${runId}/dataset/items`, { params: { token: apiKey, format: 'json' } });
                const items = dataRes.data;
                return items.map(formatPost);
            }
            if (status === 'FAILED' || status === 'ABORTED') {
                throw new Error(`Apify run failed with status: ${status}`);
            }
        }
        throw new Error('Apify run timed out');
    }
    catch (err) {
        console.warn('[instagram] Apify API error, falling back to mock:', err);
        return getMockPosts(usernameOrHashtag, limit);
    }
}
function formatPost(item) {
    const mediaUrls = [];
    if (item.displayUrl)
        mediaUrls.push(item.displayUrl);
    if (item.children) {
        item.children.forEach((child) => {
            if (child.displayUrl)
                mediaUrls.push(child.displayUrl);
        });
    }
    let mediaType = 'image';
    if (item.mediaType === 2)
        mediaType = 'video';
    else if (item.mediaType === 8)
        mediaType = 'carousel';
    return {
        id: item.id,
        caption: item.caption || '',
        mediaUrls,
        mediaType,
        timestamp: item.timestamp,
        likesCount: item.likesCount || 0,
        commentsCount: item.commentsCount || 0,
        ownerUsername: item.ownerUsername || 'unknown',
        hashtags: item.hashtags || [],
    };
}
function getMockPosts(username, limit) {
    console.log(`[instagram] Returning mock posts for ${username}`);
    const posts = [
        {
            id: 'mock_1',
            caption: `Yangi brend identifikatsiyasi — ${username} uchun logotip va visual uslub ishlab chiqildi. #branding #logodesign #jonbranding \n\nDrive: https://drive.google.com/drive/folders/1abc123def456`,
            mediaUrls: [
                'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800',
                'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=800',
            ],
            mediaType: 'carousel',
            timestamp: new Date().toISOString(),
            likesCount: 45,
            commentsCount: 12,
            ownerUsername: username,
            hashtags: ['branding', 'logodesign', 'jonbranding'],
        },
        {
            id: 'mock_2',
            caption: `"${username}" — brend strategiyasi va pozitsionerlash. Bozordagi o'rningizni toping! #brandstrategy #marketing #jonbranding`,
            mediaUrls: [
                'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800',
            ],
            mediaType: 'image',
            timestamp: new Date(Date.now() - 86400000).toISOString(),
            likesCount: 32,
            commentsCount: 8,
            ownerUsername: username,
            hashtags: ['brandstrategy', 'marketing', 'jonbranding'],
        },
    ];
    return posts.slice(0, limit);
}

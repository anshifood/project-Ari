import express from 'express';
import puppeteer from 'puppeteer';

const app = express();

const port = process.env.PORT || 3000;

app.get('/',
  
  
  (req, res) => {
    res.send('<i>Server is ready </i>');
}


);

// a list of 5 jokes 
/*

*/
app.get('/api/jokes', (req, res) => {
    const jokes = [
        {
            id: 1,
            title: 'A joke',
            content: 'Why did the scarecrow win an award? Because he was outstanding in his field!'
        },
        {
            id: 2,
            title: 'Another joke',
            content: 'Why don’t scientists trust atoms? Because they make up everything!'
        },
        {
            id: 3,
            title: 'A third joke',
            content: 'I told my wife she was drawing her eyebrows too high. She looked surprised.'
        },
        {
            id: 4,
            title: 'A fourth joke',
            content: 'What do you call a fake noodle? An Impasta!'
        },
        {
            id: 5,
            title: 'A fifth joke',
            content: 'Why did the bicycle fall over? Because it was two tired!'
        }
    ];
    res.send(jokes);
});

// Amazon product search endpoint
app.get('/api/amazon-search/:keyword', async (req, res) => {
    try {
        const keyword = req.params.keyword;
        
        if (!keyword) {
            return res.status(400).json({ error: 'Keyword parameter is required' });
        }

        console.log(`Searching Amazon for: ${keyword}`);
        
        // Launch Puppeteer browser
        const browser = await puppeteer.launch({ 
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        
        const page = await browser.newPage();
        
        // Set user agent to avoid detection
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
        
        // Navigate to Amazon search
        const searchUrl = `https://www.amazon.in/s?k=${encodeURIComponent(keyword)}`;
        await page.goto(searchUrl, { waitUntil: 'networkidle2' });
        
        // Wait for search results to load
        await page.waitForSelector('[data-component-type="s-search-result"]', { timeout: 10000 });
        
        // Extract product data
        const products = await page.evaluate(() => {
            const productElements = document.querySelectorAll('[data-component-type="s-search-result"]');
            const results = [];
            
            for (let i = 0; i < Math.min(3, productElements.length); i++) {
                const element = productElements[i];
                
                // Extract title
                const titleElement = element.querySelector('h2 a span') || element.querySelector('.s-title-instructions-style span');
                const title = titleElement ? titleElement.textContent.trim() : 'N/A';
                
                // Extract price
                const priceElement = element.querySelector('.a-price .a-offscreen') || element.querySelector('.a-price-whole');
                const price = priceElement ? priceElement.textContent.trim() : 'N/A';
                
                // Extract rating
                const ratingElement = element.querySelector('.a-icon-alt');
                const rating = ratingElement ? ratingElement.textContent.trim() : 'N/A';
                
                // Extract image
                const imageElement = element.querySelector('.s-image');
                const image = imageElement ? imageElement.src : 'N/A';
                
                // Extract product link
                const linkElement = element.querySelector('h2 a');
                const link = linkElement ? `https://www.amazon.com${linkElement.getAttribute('href')}` : 'N/A';
                
                results.push({
                    id: i + 1,
                    title,
                    price,
                    rating,
                    image,
                    link
                });
            }
            
            return results;
        });
        
        await browser.close();
        
        if (products.length === 0) {
            return res.status(404).json({ 
                error: 'No products found for the given keyword',
                keyword: keyword 
            });
        }
        
        res.json({
            keyword: keyword,
            totalResults: products.length,
            products: products
        });
        
    } catch (error) {
        console.error('Error scraping Amazon:', error);
        res.status(500).json({ 
            error: 'Failed to scrape Amazon products',
            message: error.message 
        });
    }
});

app.listen(port, () => {
    console.log(`Serve at http://localhost:${port}`);
});
import * as cheerio from 'cheerio';
import sanitizeHtml from 'sanitize-html';

interface ParsedContent {
    title: string;
    cover: string;
    shortContent: string;
    content: string;
    meta: {
        readingTime: number;
        wordCount: number;
        hasImages: boolean;
        images: string[];
    };
}

export class HtmlParser {
    private $: cheerio.CheerioAPI;
    private html: string;

    constructor(html: string) {
        this.html = html;
        this.$ = cheerio.load(html);
    }

    private extractTitle(): string {
        return (
            this.$('h1').first().text() ||
            this.$('h2').first().text() ||
            this.$('strong').first().text() ||
            this.$('p').first().text().slice(0, 50) ||
            'Untitled'
        ).trim();
    }

    private extractCover(): string {
        const images = this.$('img').toArray().map(img => ({
            src: this.$(img).attr('src') || '',
            alt: this.$(img).attr('alt') || '',
            width: parseInt(this.$(img).attr('width') || '0'),
            height: parseInt(this.$(img).attr('height') || '0'),
        }));

        const cover = images.find(img =>
            img.width >= 600 ||
            img.alt.toLowerCase().includes('cover') ||
            img.src.toLowerCase().includes('cover')
        );

        return cover?.src || images[0]?.src || '';
    }

    private extractShortContent(): string {
        const text = this.$('body').text().trim()
            .replace(/\s+/g, ' ')
            .replace(/\n+/g, ' ');

        const words = text.split(' ').slice(0, 30);
        return words.join(' ') + (text.length > words.length ? '...' : '');
    }

    private cleanContent(): string {
        // Clone cheerio instance untuk cleaning
        const $clean = cheerio.load(this.html);

        $clean('script').remove();
        $clean('style').remove();
        $clean('[style*="display: none"]').remove();

        return sanitizeHtml($clean('body').html() || '', {
            allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img']),
            allowedAttributes: {
                ...sanitizeHtml.defaults.allowedAttributes,
                img: ['src', 'alt', 'width', 'height']
            }
        });
    }

    private calculateMeta() {
        const text = this.$('body').text();
        const wordCount = text.split(/\s+/).filter(word => word.length > 0).length;
        const readingTime = Math.ceil(wordCount / 200);
        const images = this.$('img').toArray().map(img => this.$(img).attr('src')).filter((src): src is string => !!src);

        return {
            readingTime,
            wordCount,
            hasImages: images.length > 0,
            images
        };
    }

    public parse(): ParsedContent {
        return {
            title: this.extractTitle(),
            cover: this.extractCover(),
            shortContent: this.extractShortContent(),
            content: this.cleanContent(),
            meta: this.calculateMeta()
        };
    }
}

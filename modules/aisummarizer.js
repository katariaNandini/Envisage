const CONFIG = {
    API_URL: 'https://api-inference.huggingface.co/models/facebook/bart-large-cnn',
    API_TOKEN: 'YOUR_HUGGINGFACE_API_TOKEN', // We'll need to handle this differently
    MAX_TEXT_LENGTH: 1024,
    RETRY_ATTEMPTS: 3,
    RETRY_DELAY: 1000, // milliseconds
};


class TextSummarizer {
    constructor(config = CONFIG) {
        this.config = config;
        this.isProcessing = false;
    }

    /**
     * Makes API request to Hugging Face
     * @param {Object} data - Request payload
     * @returns {Promise} API response
     */
    async query(data) {
        try {
            console.log('Making API request...'); // Debug log
            
            // Get API token from background script
            const response = await chrome.runtime.sendMessage({ action: 'getApiToken' });
            const apiToken = response.token;
            
            const apiResponse = await fetch(this.config.API_URL, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${apiToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (!apiResponse.ok) {
                console.error('API Response not OK:', apiResponse.status);
                throw new Error(`HTTP error! status: ${apiResponse.status}`);
            }

            const result = await apiResponse.json();
            console.log('API Response:', result); // Debug log
            return result;
        } catch (error) {
            console.error('API Request failed:', error);
            throw new Error(`API request failed: ${error.message}`);
        }
    }


    async withRetry(operation) {
        for (let attempt = 1; attempt <= this.config.RETRY_ATTEMPTS; attempt++) {
            try {
                return await operation();
            } catch (error) {
                if (attempt === this.config.RETRY_ATTEMPTS) throw error;
                await new Promise(resolve => setTimeout(resolve, this.config.RETRY_DELAY));
            }
        }
    }

   
    preprocessText(text) {
        if (!text || typeof text !== 'string') {
            throw new Error('Invalid input: Text must be a non-empty string');
        }

        // Remove extra whitespace and normalize
        text = text.trim().replace(/\s+/g, ' ');
        console.log('Preprocessed text length:', text.length); // Debug log

        // Extract main content
        const mainContent = this.extractMainContent(text);

        // Truncate if exceeds maximum length
        if (mainContent.length > this.config.MAX_TEXT_LENGTH) {
            return mainContent.substring(0, this.config.MAX_TEXT_LENGTH);
        }

        return mainContent;
    }

 
    extractMainContent(text) {
        // Remove common navigation and footer text
        const removePatterns = [
            /menu|navigation|footer|header|copyright|search/gi,
            /sign up|log in|subscribe|contact us/gi,
            /\b\d{4}\s+all rights reserved\b/gi
        ];

        let content = text;
        removePatterns.forEach(pattern => {
            content = content.replace(pattern, '');
        });

        return content;
    }

    
    async summarizeText(text) {
        if (this.isProcessing) {
            console.log('Already processing a summary request');
            return;
        }

        try {
            this.isProcessing = true;
            console.log('Starting summarization...'); // Debug log
            this.showPlaceholder('Analyzing content...');
            
            const processedText = this.preprocessText(text);
            console.log('Processed text ready for API'); // Debug log

            const result = await this.query({
                inputs: processedText,
                parameters: {
                    max_length: 150,
                    min_length: 40,
                    do_sample: false,
                    // Focus on key information and main points
                    num_beams: 4,
                    temperature: 0.7
                }
            });

            if (!result || !result[0]?.summary_text) {
                throw new Error('Invalid API response format');
            }

            const summary = this.formatSummary(result[0].summary_text);
            
            // Update placeholder with summary
            const placeholder = document.getElementById('summary-placeholder');
            if (placeholder) {
                placeholder.innerHTML = `
                    <div style="max-height: 400px; overflow-y: auto;">
                        <h3 style="margin-top: 0;">Summary</h3>
                        <div style="white-space: pre-line;">${summary}</div>
                    </div>
                `;
            }

            return summary;

        } catch (error) {
            console.error('Summarization failed:', error);
            this.showPlaceholder(`Error: ${error.message}`);
            throw error;
        } finally {
            this.isProcessing = false;
            setTimeout(() => this.hidePlaceholder(), 10000); // Hide after 10 seconds
        }
    }

   
    formatSummary(summary) {
        // Split into sentences and add bullet points
        const sentences = summary.split(/(?<=[.!?])\s+/);
        return sentences.map(sentence => `• ${sentence.trim()}`).join('\n\n');
    }

   
    showPlaceholder(message) {
        // Remove any existing placeholder
        this.hidePlaceholder();

        const placeholder = document.createElement('div');
        placeholder.id = 'summary-placeholder';
        placeholder.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            z-index: 10000;
            max-width: 300px;
        `;

        placeholder.innerHTML = `
            <div class="summary-loading">
                <div class="loading-spinner" style="
                    border: 3px solid #f3f3f3;
                    border-top: 3px solid #3498db;
                    border-radius: 50%;
                    width: 20px;
                    height: 20px;
                    animation: spin 1s linear infinite;
                    margin-bottom: 10px;
                "></div>
                <p style="margin: 0;">${message}</p>
            </div>
        `;

        // Add keyframe animation for spinner
        const style = document.createElement('style');
        style.textContent = `
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        `;
        document.head.appendChild(style);
        document.body.appendChild(placeholder);
    }

    /**
     * Hides the placeholder
     */
    hidePlaceholder() {
        const placeholder = document.getElementById('summary-placeholder');
        if (placeholder) {
            placeholder.remove();
        }
    }

    /**
     * Summarizes webpage content
     * @returns {Promise<string>} Summarized text
     */
    async summarizePage() {
        try {
            console.log('Starting page summarization...'); // Debug log
            
            // Try to get main content first
            const mainContent = document.querySelector('main, article, .content, #content');
            let text;
            
            if (mainContent) {
                text = mainContent.innerText;
                console.log('Found main content section'); // Debug log
            } else {
                // Fallback to body text
                text = document.body.innerText;
                console.log('Using body text'); // Debug log
            }
            
            if (!text) {
                throw new Error('No text content found on page');
            }
            
            console.log('Text length:', text.length); // Debug log
            return await this.summarizeText(text);
        } catch (error) {
            console.error('Page summarization failed:', error);
            this.showPlaceholder(`Error: ${error.message}`);
            throw error;
        }
    }
}

// Export instance and class
export const summarizer = new TextSummarizer();
export { TextSummarizer };

// Convenience methods
export const summarizeText = (text) => summarizer.summarizeText(text);
export const summarizePage = () => summarizer.summarizePage();
  

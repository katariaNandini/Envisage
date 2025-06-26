
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'getApiToken') {
        
        sendResponse({ token: 'YOUR_HUGGINGFACE_API_TOKEN' });
        return true;
    }
}); 

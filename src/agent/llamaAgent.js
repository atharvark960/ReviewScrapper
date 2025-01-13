import Groq from 'groq-sdk';
import { configDotenv } from 'dotenv';

configDotenv();

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function main(content) {
    const chatCompletion = await getGroqChatCompletion(content);

    return chatCompletion.choices[0]?.message?.content || "";
    // console.log(chatCompletion.choices[0].message.content);
}

export async function getGroqChatCompletion(content) {
    return groq.chat.completions.create({
        "messages": [
            {
                "role": "system",
                "content": "You are a CSS Selector Pattern Analyser and Identifier. Your primary purpose is to identify CSS selectors dynamically to accurately target elements in the html document."
            },
            {
                "role": "user",
                "content": "\nThe below html document(just the body of it) corresponds to a product listed on an e-commerce site\nLocate the reviews section of the document, and extract the information from a single review.\nThe response should be in json format, as follows:\n{\n      \"title\": <title_css_selector>,\n      \"body\": <body_css_selector>,\n      \"rating\": <rating_css_selector>,\n      \"reviewer\": <reviewer_name_css_selector>\n}\n\nEnsure the selectors you generate are:\nUnique: Target only the intended elements without ambiguity.\nInner-most: the css selectors which you select must correspond to the html tags that are the immediate parent of the target\nResilient: Account for minor DOM updates or structural changes to ensure long-term reliability.\nContext-Aware: Consider the surrounding HTML structure, attributes, and element relationships to improve precision.\n\n\n***** Start of the body content of the html document *****\n" + content
            }
        ],
        "model": "llama-3.2-90b-vision-preview",
        "temperature": 1,
        "max_tokens": 1024,
        "top_p": 1,
        "stream": false,
        "response_format": {
            "type": "json_object"
        },
        "stop": null
    });
}

main();
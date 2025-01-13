/*
* Since we know that reviews section always comes in the later of any document, what we can do is we can start by chopping off the first 1/2 of the html document to reduce the no.of tokens, and check whether it has come below the required range, if not this time we can chop off 1/3 of the remaining html, and check again, if not chop off 1/4 this time and so on, until the no.of tokens comes below the desired count for the given llm.
* In this way we avoid exponential reduce of tokens in the document, which may lead to lose of the reviews section.
*/

export function sliceHtmlToFitRequestLimit(content, requestLimit) {
    let tokenCount = tokenCounter(content);
    if (tokenCount <= requestLimit) {
        return content;
    }

    console.log(`Current token count: ${tokenCount}. Reducing...`);

    let currentContent = content;

    let slicePoint = tokenCount - requestLimit;
    currentContent = currentContent.slice(slicePoint);

    return currentContent;
}

export function chunkContent(content, contextWindow) {
    if (typeof content !== "string" || typeof contextWindow !== "number") {
        throw new Error("Invalid arguments. 'content' must be a string and 'contextWindow' must be a number.");
    }

    const tokens = content.split(/\s+/); // Tokenize the content by splitting on whitespace.
    const chunks = [];

    for (let i = 0; i < tokens.length; i += contextWindow) {
        const chunk = tokens.slice(i, i + contextWindow).join(" ");
        chunks.push(chunk);
    }

    return chunks;
}



// split by whitespace and punctuation.
function tokenCounter(content) {
    return content.split(/\s+|(?=\W)|(?<=\W)/).length;
}

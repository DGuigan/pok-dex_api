export function buildElement(elementType, content, link=null) {
    let element = document.createElement(elementType);
    if (link) {
        content = buildElement('a', content);
        content.href = link;
    }
    element.append(content);
    return element;
}

export function capitalize(string) {
    return `${string.charAt(0).toUpperCase()}${string.substring(1)}`;
}
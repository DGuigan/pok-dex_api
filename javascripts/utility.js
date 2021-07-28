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

const fromHexMap = {
    '0': 0, '1': 1, '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, 'a': 10, 'b': 11, 'c': 12, 'd': 13, 'e': 14, 'f': 15
}

const toHexMap = {
    0: '0', 1: '1', 2: '2', 3: '3', 4: '4', 5: '5', 6: '6', 7: '7', 8: '8', 9: '9', 10: 'a', 11: 'b', 12: 'c', 13: 'd', 14: 'e', 15: 'f'
}

function hexToDec(hexValue) {
    let a = hexValue.substring(0, 1);
    let b = hexValue.substring(1);

    return (16 * fromHexMap[a]) + (fromHexMap[b]);
}

function decToHex(decValue) {
    return `${toHexMap[Math.floor(decValue / 16)]}${toHexMap[decValue % 16]}`
}

function lighten(decValue, strength=0.7) {
    return decValue + (255 - decValue) * strength;
}

export function lightenColor(hexValue) {
    let rgb = [hexValue.substring(1, 3), hexValue.substring(3, 5), hexValue.substring(5, 7)];
    let lightHex = '#';

    for (let color of rgb) {
        lightHex += decToHex(Math.floor(lighten(hexToDec(color))));
    }

    return lightHex;

}
import { stateFromElement } from 'draft-js-import-element';
import { JSDOM } from "jsdom";

const defaultOptions = {};

const parseHTML = (html) => {
    const dom = new JSDOM(html)
    const doc = dom.window.document.implementation.createHTMLDocument('');
    if (doc.documentElement) {
        doc.documentElement.innerHTML = html;
    }
    return doc.body || doc.createElement('body');
}

const htmlToDraftJs = (html, options) => {
    let {parser, ...otherOptions} = options || defaultOptions;
    if (parser == null) {
        parser = parseHTML;
    }
    let element = parser(html);
    return stateFromElement(element, otherOptions);
}

export default htmlToDraftJs;

const { stateFromElement } = require('draft-js-import-element');
const jsdom = require('jsdom');

const defaultOptions = {};

const parseHTML = (html) => {
    const dom = new jsdom.JSDOM(html)
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

module.exports = htmlToDraftJs;

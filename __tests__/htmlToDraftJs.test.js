const htmlToDraftJs = require('../htmlToDraftJs');

describe('htmlToDraftJs', () => {
  it('should convert simple text html to draft js', () => {
    const html = '<p>Hello World</p>';
    const contentState = htmlToDraftJs(html);
    expect(contentState).toBeTruthy();
    const blocks = contentState.getBlocksAsArray();
    expect(blocks).toHaveLength(1);
    expect(blocks[0].getText()).toBe('Hello World');
    expect(blocks[0].getType()).toBe('unstyled');
  });

  it('should convert html with multiple blocks', () => {
    const html = '<h1>Title</h1><p>Paragraph 1</p><p>Paragraph 2</p>';
    const contentState = htmlToDraftJs(html);
    const blocks = contentState.getBlocksAsArray();
    expect(blocks).toHaveLength(3);
    expect(blocks[0].getText()).toBe('Title');
    expect(blocks[0].getType()).toBe('header-one');
    expect(blocks[1].getText()).toBe('Paragraph 1');
    expect(blocks[1].getType()).toBe('unstyled');
    expect(blocks[2].getText()).toBe('Paragraph 2');
    expect(blocks[2].getType()).toBe('unstyled');
  });

  it('should handle inline styles', () => {
    const html = '<p>This is <strong>bold</strong> and <em>italic</em> text</p>';
    const contentState = htmlToDraftJs(html);
    const blocks = contentState.getBlocksAsArray();
    expect(blocks).toHaveLength(1);
    expect(blocks[0].getText()).toBe('This is bold and italic text');
    
    const inlineStyles = blocks[0].getCharacterList().toArray();
    const boldIndices = [];
    const italicIndices = [];
    inlineStyles.forEach((char, index) => {
      if (char.getStyle().has('BOLD')) boldIndices.push(index);
      if (char.getStyle().has('ITALIC')) italicIndices.push(index);
    });
    
    // Just verify that bold and italic styles exist in correct order
    expect(boldIndices.size || boldIndices.length).toBe(4); // "bold"
    expect(italicIndices.size || italicIndices.length).toBe(6); // "italic"
    expect(boldIndices[0]).toBeLessThan(italicIndices[0]); // bold comes before italic
  });

  it('should handle links', () => {
    const html = '<p>This is a <a href="https://example.com">link</a></p>';
    const contentState = htmlToDraftJs(html);
    const blocks = contentState.getBlocksAsArray();
    expect(blocks).toHaveLength(1);
    expect(blocks[0].getText()).toBe('This is a link');
    
    // Find the first character with a LINK entity
    const charList = blocks[0].getCharacterList().toArray();
    const linkChar = charList.find(char => {
      const entityKey = char.getEntity();
      if (!entityKey) return false;
      const entity = contentState.getEntity(entityKey);
      return entity && entity.getType() === 'LINK';
    });

    expect(linkChar).toBeTruthy();
    const linkEntity = contentState.getEntity(linkChar.getEntity());
    expect(linkEntity.getType()).toBe('LINK');
    expect(linkEntity.getData().url).toBe('https://example.com');
  });

  it('should handle empty html', () => {
    const html = '';
    const contentState = htmlToDraftJs(html);
    const blocks = contentState.getBlocksAsArray();
    expect(blocks).toHaveLength(1);
    expect(blocks[0].getText()).toBe('');
    expect(blocks[0].getType()).toBe('unstyled');
  });

  it('should handle malformed html', () => {
    const html = '<p>Unclosed paragraph <strong>Bold text';
    const contentState = htmlToDraftJs(html);
    const blocks = contentState.getBlocksAsArray();
    expect(blocks).toHaveLength(1);
    expect(blocks[0].getText()).toBe('Unclosed paragraph Bold text');
    
    const boldStyles = blocks[0].getCharacterList()
      .map(char => char.getStyle().has('BOLD'))
      .filter(Boolean)
      .toArray();
    expect(boldStyles.length).toBe(9); // "Bold text"
  });

  it('should handle custom html parser', () => {
    const customParser = (html) => {
      const div = document.createElement('div');
      div.innerHTML = html;
      return div;
    };
    
    const html = '<p>Custom parser test</p>';
    const contentState = htmlToDraftJs(html, { parser: customParser });
    const blocks = contentState.getBlocksAsArray();
    expect(blocks).toHaveLength(1);
    expect(blocks[0].getText()).toBe('Custom parser test');
  });

  it('should handle lists', () => {
    const html = '<ul><li>Item 1</li><li>Item 2</li></ul>';
    const contentState = htmlToDraftJs(html);
    const blocks = contentState.getBlocksAsArray();
    expect(blocks).toHaveLength(2);
    expect(blocks[0].getText()).toBe('Item 1');
    expect(blocks[0].getType()).toBe('unordered-list-item');
    expect(blocks[1].getText()).toBe('Item 2');
    expect(blocks[1].getType()).toBe('unordered-list-item');
  });

  it('should handle nested elements', () => {
    const html = '<div><h2>Nested <strong>Title</strong></h2><p>Nested <em>paragraph</em></p></div>';
    const contentState = htmlToDraftJs(html);
    const blocks = contentState.getBlocksAsArray();
    expect(blocks).toHaveLength(2);
    expect(blocks[0].getText()).toBe('Nested Title');
    expect(blocks[0].getType()).toBe('header-two');
    expect(blocks[1].getText()).toBe('Nested paragraph');
    expect(blocks[1].getType()).toBe('unstyled');
  });

  it('should handle HTML entities', () => {
    const html = '<p>&amp; &lt; &gt; &copy; &quot;</p>';
    const contentState = htmlToDraftJs(html);
    const blocks = contentState.getBlocksAsArray();
    expect(blocks).toHaveLength(1);
    expect(blocks[0].getText()).toBe('& < > © "');
    expect(blocks[0].getType()).toBe('unstyled');
  });

  it('should handle complex nested formatting', () => {
    const html = '<p>This is <strong>bold and <em>bold-italic</em></strong> and just <em>italic</em></p>';
    const contentState = htmlToDraftJs(html);
    const blocks = contentState.getBlocksAsArray();
    expect(blocks).toHaveLength(1);
    expect(blocks[0].getText()).toBe('This is bold and bold-italic and just italic');

    const inlineStyles = blocks[0].getCharacterList().toArray();
    const boldItalicIndices = [];
    const boldOnlyIndices = [];
    const italicOnlyIndices = [];
    
    inlineStyles.forEach((char, index) => {
      const hasBold = char.getStyle().has('BOLD');
      const hasItalic = char.getStyle().has('ITALIC');
      if (hasBold && hasItalic) {
        boldItalicIndices.push(index);
      } else if (hasBold) {
        boldOnlyIndices.push(index);
      } else if (hasItalic) {
        italicOnlyIndices.push(index);
      }
    });

    expect(boldItalicIndices.length).toBe(11); // Length of "bold-italic" text
    expect(boldOnlyIndices.length).toBe(9); // Length of "bold and " text
    expect(italicOnlyIndices.length).toBe(6); // Length of "italic" text
  });

  it('should handle whitespace correctly', () => {
    const html = '<p>Multiple    spaces</p><p>\n\tTabs and newlines\n</p>';
    const contentState = htmlToDraftJs(html);
    const blocks = contentState.getBlocksAsArray();
    expect(blocks).toHaveLength(2);
    expect(blocks[0].getText()).toBe('Multiple spaces');
    expect(blocks[1].getText()).toBe('Tabs and newlines');
  });

  it('should handle ordered lists', () => {
    const html = '<ol><li>First</li><li>Second</li></ol>';
    const contentState = htmlToDraftJs(html);
    const blocks = contentState.getBlocksAsArray();
    expect(blocks).toHaveLength(2);
    expect(blocks[0].getText()).toBe('First');
    expect(blocks[0].getType()).toBe('ordered-list-item');
    expect(blocks[1].getText()).toBe('Second');
    expect(blocks[1].getType()).toBe('ordered-list-item');
  });

  it('should handle nested lists', () => {
    const html = `
      <ul>
        <li>Item 1</li>
        <li>Item 2
          <ul>
            <li>Sub Item 1</li>
            <li>Sub Item 2</li>
          </ul>
        </li>
      </ul>`;
    const contentState = htmlToDraftJs(html);
    const blocks = contentState.getBlocksAsArray();
    expect(blocks).toHaveLength(4);
    expect(blocks[0].getText()).toBe('Item 1');
    expect(blocks[0].getType()).toBe('unordered-list-item');
    expect(blocks[0].getDepth()).toBe(0);
    expect(blocks[1].getText()).toBe('Item 2');
    expect(blocks[1].getType()).toBe('unordered-list-item');
    expect(blocks[1].getDepth()).toBe(0);
    expect(blocks[2].getText()).toBe('Sub Item 1');
    expect(blocks[2].getType()).toBe('unordered-list-item');
    expect(blocks[2].getDepth()).toBe(1);
    expect(blocks[3].getText()).toBe('Sub Item 2');
    expect(blocks[3].getType()).toBe('unordered-list-item');
    expect(blocks[3].getDepth()).toBe(1);
  });

  it('should handle mixed content types', () => {
    const html = `
      <div>
        <h1>Title</h1>
        <p>Normal paragraph</p>
        <blockquote>A quote</blockquote>
        <pre><code>Code block</code></pre>
      </div>`;
    const contentState = htmlToDraftJs(html);
    const blocks = contentState.getBlocksAsArray();
    expect(blocks).toHaveLength(4);
    expect(blocks[0].getType()).toBe('header-one');
    expect(blocks[1].getType()).toBe('unstyled');
    expect(blocks[2].getType()).toBe('blockquote');
    expect(blocks[3].getType()).toBe('code-block');
  });
});

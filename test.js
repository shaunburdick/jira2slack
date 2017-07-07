'use strict';

const test = require('tape');
const J2S = require('./index.js');

test('JIRA to Slack: Check Individual Formatting', (assert) => {
  assert.equal(
    J2S.toSlack('h1. Heading'),
    '\n *Heading*\n',
    'Headings'
  );

  assert.equal(
    J2S.toSlack('* Bulleted List\n** Indented more\n* Indented less\n\n'),
    '• Bulleted List\n  • Indented more\n• Indented less\n\n',
    'Unordered List'
  );

  assert.equal(
    J2S.toSlack('- Bulleted Dash List\n- Bulleted Dash List\n- Bulleted Dash List\n\n'),
    '• Bulleted Dash List\n• Bulleted Dash List\n• Bulleted Dash List\n\n',
    'Unordered Dash List'
  );

  assert.equal(
    J2S.toSlack(
      '# Numbered List\n' +
      '## Indented more\n' +
      '## Indented more\n' +
      '### Indented morer\n' +
      '### Indented morer\n' +
      '### Indented morer\n' +
      '## Indented more\n' +
      '# Indented less\n\n'
    ),
    '1. Numbered List\n' +
    '  1. Indented more\n' +
    '  2. Indented more\n' +
    '    1. Indented morer\n' +
    '    2. Indented morer\n' +
    '    3. Indented morer\n' +
    '  3. Indented more\n' +
    '2. Indented less\n\n',
    'Ordered List'
  );

  assert.equal(
    J2S.toSlack('||heading 1||heading 2||\n|col A1|col B1|\n|col A2|col B2|\n\n'),
    '\n|heading 1|heading 2|\n| --- | --- |\n|col A1|col B1|\n|col A2|col B2|\n\n',
    'Table'
  );

  assert.equal(
    J2S.toSlack('Bold: *boldy*\n'),
    'Bold: *boldy*\n',
    'Bold'
  );

  assert.equal(
    J2S.toSlack('Bold (spaced): * boldy is spaced *\n'),
    'Bold (spaced):  *boldy is spaced* \n',
    'Bold (spaced)'
  );

  assert.equal(
    J2S.toSlack('Italic: _italicy_\n'),
    'Italic: _italicy_\n',
    'Italic'
  );

  assert.equal(
    J2S.toSlack('Italic (spaced): _italicy is poorly spaced _\n'),
    'Italic (spaced): _italicy is poorly spaced_ \n',
    'Italic (spaced)'
  );

  assert.equal(
    J2S.toSlack('Monospace: {{$code}}\n'),
    'Monospace: `$code`\n',
    'Monospace'
  );

  assert.equal(
    J2S.toSlack('Citations: ??citation??\n'),
    'Citations: _-- citation_\n',
    'Citations'
  );

  const bigCitation = 'wwwwwwwwwwwwwww\n'.repeat(100);
  assert.equal(
    J2S.toSlack(`Citations: ??${bigCitation}??\n`),
    `Citations: _-- ${bigCitation}_\n`,
    'Huge Citations'
  );

  assert.equal(
    J2S.toSlack('Subscript: ~subscript~\n'),
    'Subscript: _subscript\n',
    'Subscript'
  );

  assert.equal(
    J2S.toSlack('Superscript: ^superscript^\n'),
    'Superscript: ^superscript\n',
    'Superscript'
  );

  assert.equal(
    J2S.toSlack('Strikethrough: -strikethrough-\n'),
    'Strikethrough: ~strikethrough~\n',
    'Strikethrough'
  );

  assert.equal(
    J2S.toSlack('Not Strikethrough: i-use-dashes\n'),
    'Not Strikethrough: i-use-dashes\n',
    'No strikethrough for dashed words'
  );

  assert.equal(
    J2S.toSlack('Strikethrough (spaced): - strikethrough is poorly spaced-\n'),
    'Strikethrough (spaced):  ~strikethrough is poorly spaced~\n',
    'Strikethrough (spaced)'
  );

  assert.equal(
    J2S.toSlack('Code: {code}some code{code}\n'),
    'Code: ```some code```\n',
    'Code'
  );

  assert.equal(
    J2S.toSlack('Quote: {quote}quoted text{quote}\n'),
    'Quote: ```quoted text```\n',
    'Quote'
  );

  assert.equal(
    J2S.toSlack('No Format: {noformat}pre text{noformat}\n'),
    'No Format: ```pre text```\n',
    'Pre-formatted Text'
  );

  assert.equal(
    J2S.toSlack('Unnamed Link: [http://someurl.com]\n'),
    'Unnamed Link: <http://someurl.com>\n',
    'Unnamed Link'
  );

  assert.equal(
    J2S.toSlack('Named Link: [Someurl|http://someurl.com]\n'),
    'Named Link: <http://someurl.com|Someurl>\n',
    'Named Link'
  );

  assert.equal(
    J2S.toSlack('Multiple Links: [Someurl1|http://someurl1.com] links to [Someurl2|http://someurl2.com]\n'),
    'Multiple Links: <http://someurl1.com|Someurl1> links to <http://someurl2.com|Someurl2>\n',
    'Multiple Links'
  );

  assert.equal(
    J2S.toSlack('Blockquote: \nbq. This is quoted\n'),
    'Blockquote: \n> This is quoted\n',
    'Blockquote'
  );

  assert.equal(
    J2S.toSlack('Color: {color:white}This is white text{color}\n'),
    'Color: This is white text\n',
    'Color'
  );

  assert.equal(
    J2S.toSlack('Panel: {panel:title=foo}Panel Contents{panel}\n'),
    'Panel: \n| foo |\n| --- |\n| Panel Contents |\n',
    'Panel'
  );

  assert.end();
});

test('JIRA to Slack: Check All Formatting', (assert) => {
  const jiraFormat = 'h1. Heading\nFoo foo _foo_ foo foo foo\n' +
    '* Bulleted List\n** Indented more\n* Indented less\n\n' +
    '- Bulleted Dash List\n- Bulleted Dash List\n- Bulleted Dash List\n\n' +
    '# Numbered List\n' +
    '## Indented more\n' +
    '## Indented more\n' +
    '### Indented morer\n' +
    '### Indented morer\n' +
    '### Indented morer\n' +
    '## Indented more\n' +
    '# Indented less\n\n' +
    '||heading 1||heading 2||\n' +
    '|col A1|col B1|\n|col A2|col B2|\n\n' +
    'Bold: *boldy*\n' +
    'Bold (spaced): * boldy is spaced *\n' +
    'Italic: _italicy_\n' +
    'Italic (spaced): _italicy is poorly spaced _\n' +
    'Monospace: {{$code}}\n' +
    'Citations: ??citation??\n' +
    'Subscript: ~subscript~\n' +
    'Superscript: ^superscript^\n' +
    'Strikethrough: -strikethrough-\n' +
    'Not Strikethrough: i-use-dashes\n' +
    'Strikethrough (spaced): - strikethrough is poorly spaced-\n' +
    'Code: {code}some code{code}\n' +
    'Quote: {quote}quoted text{quote}\n' +
    'No Format: {noformat}pre text{noformat}\n' +
    'Unnamed Link: [http://someurl.com]\n' +
    'Named Link: [Someurl|http://someurl.com]\n' +
    'Multiple Links: [Someurl1|http://someurl1.com] links to [Someurl2|http://someurl2.com]\n' +
    'Blockquote: \nbq. This is quoted\n' +
    'Color: {color:white}This is white text{color}\n' +
    'Panel: {panel:title=foo}Panel Contents{panel}\n';

  const expectedText = '\n *Heading*\n\nFoo foo _foo_ foo foo foo\n' +
    '• Bulleted List\n  • Indented more\n• Indented less\n\n' +
    '• Bulleted Dash List\n• Bulleted Dash List\n• Bulleted Dash List\n\n' +
    '1. Numbered List\n' +
    '  1. Indented more\n' +
    '  2. Indented more\n' +
    '    1. Indented morer\n' +
    '    2. Indented morer\n' +
    '    3. Indented morer\n' +
    '  3. Indented more\n' +
    '2. Indented less\n\n' +
    '\n|heading 1|heading 2|\n' +
    '| --- | --- |\n|col A1|col B1|\n|col A2|col B2|\n\n' +
    'Bold: *boldy*\n' +
    'Bold (spaced):  *boldy is spaced* \n' +
    'Italic: _italicy_\n' +
    'Italic (spaced): _italicy is poorly spaced_ \n' +
    'Monospace: `$code`\n' +
    'Citations: _-- citation_\n' +
    'Subscript: _subscript\n' +
    'Superscript: ^superscript\n' +
    'Strikethrough: ~strikethrough~\n' +
    'Not Strikethrough: i-use-dashes\n' +
    'Strikethrough (spaced):  ~strikethrough is poorly spaced~\n' +
    'Code: ```some code```\n' +
    'Quote: ```quoted text```\n' +
    'No Format: ```pre text```\n' +
    'Unnamed Link: <http://someurl.com>\n' +
    'Named Link: <http://someurl.com|Someurl>\n' +
    'Multiple Links: <http://someurl1.com|Someurl1> links to <http://someurl2.com|Someurl2>\n' +
    'Blockquote: \n> This is quoted\n' +
    'Color: This is white text\n' +
    'Panel: \n| foo |\n| --- |\n| Panel Contents |\n';

  const response = J2S.toSlack(jiraFormat);

  assert.equal(response, expectedText, 'JIRA Markup should be converted to Slack Markup');
  assert.end();
});

test('Slack to JIRA: Check Individual Formatting', (assert) => {
  assert.equal(
    J2S.toJira('\n *Heading*\n'),
    'h1. Heading',
    'Headings'
  );

  assert.equal(
    J2S.toJira('• Bulleted List\n  • Indented more\n• Indented less\n\n'),
    '* Bulleted List\n** Indented more\n* Indented less\n\n',
    'Unordered List'
  );

  assert.equal(
    J2S.toJira(
      '1. Numbered List\n' +
      '  1. Indented more\n' +
      '  2. Indented more\n' +
      '    1. Indented morer\n' +
      '    2. Indented morer\n' +
      '    3. Indented morer\n' +
      '  3. Indented more\n' +
      '2. Indented less\n\n'
    ),
    '# Numbered List\n' +
    '## Indented more\n' +
    '## Indented more\n' +
    '### Indented morer\n' +
    '### Indented morer\n' +
    '### Indented morer\n' +
    '## Indented more\n' +
    '# Indented less\n\n',
    'Ordered List'
  );

  assert.equal(
    J2S.toJira('||heading 1||heading 2||\n|col A1|col B1|\n|col A2|col B2|\n\n'),
    '\n|heading 1|heading 2|\n| --- | --- |\n|col A1|col B1|\n|col A2|col B2|\n\n',
    'Table'
  );

  assert.equal(
    J2S.toJira('Bold: *boldy*\n'),
    'Bold: *boldy*\n',
    'Bold'
  );

  assert.equal(
    J2S.toJira('Italic: _italicy_\n'),
    'Italic: _italicy_\n',
    'Italic'
  );

  assert.equal(
    J2S.toJira('Monospace: `$code`\n'),
    'Monospace: {{$code}}\n',
    'Monospace'
  );

  assert.equal(
    J2S.toJira('Citations: _-- citation_\n'),
    'Citations: ??citation??\n',
    'Citations'
  );

  assert.equal(
    J2S.toJira('Strikethrough: ~strikethrough~\n'),
    'Strikethrough: -strikethrough-\n',
    'Strikethrough'
  );

  assert.equal(
    J2S.toJira('Not Strikethrough: i-use-dashes\n'),
    'Not Strikethrough: i-use-dashes\n',
    'No strikethrough for dashed words'
  );

  assert.equal(
    J2S.toJira('Unnamed Link: <http://someurl.com>\n'),
    'Unnamed Link: [http://someurl.com]\n',
    'Unnamed Link'
  );

  assert.equal(
    J2S.toJira('Named Link: <http://someurl.com|Someurl>\n'),
    'Named Link: [Someurl|http://someurl.com]\n',
    'Named Link'
  );

  assert.equal(
    J2S.toJira('Blockquote: \n> This is quoted\n'),
    'Blockquote: \nbq. This is quoted\n',
    'Blockquote'
  );

  assert.end();
});

test('Slack to JIRA: Check All Formatting', (assert) => {
  const expectedText = 'h1. Heading\nFoo foo _foo_ foo foo foo\n' +
    '* Bulleted List\n** Indented more\n* Indented less\n\n' +
    '# Numbered List\n' +
    '## Indented more\n' +
    '## Indented more\n' +
    '### Indented morer\n' +
    '### Indented morer\n' +
    '### Indented morer\n' +
    '## Indented more\n' +
    '# Indented less\n\n' +
    'Bold: *boldy*\n' +
    'Italic: _italicy_\n' +
    'Monospace: {{$code}}\n' +
    'Citations: ??citation??\n' +
    'Strikethrough: -strikethrough-\n' +
    'Not Strikethrough: i-use-dashes\n' +
    'Code: {code}some code{code}\n' +
    'Unnamed Link: [http://someurl.com]\n' +
    'Named Link: [Someurl|http://someurl.com]\n' +
    'Blockquote: \nbq. This is quoted\n';

  const stashFormat = '\n *Heading*\n\nFoo foo _foo_ foo foo foo\n' +
    '• Bulleted List\n  • Indented more\n• Indented less\n\n' +
    '1. Numbered List\n' +
    '  1. Indented more\n' +
    '  2. Indented more\n' +
    '    1. Indented morer\n' +
    '    2. Indented morer\n' +
    '    3. Indented morer\n' +
    '  3. Indented more\n' +
    '2. Indented less\n\n' +
    'Bold: *boldy*\n' +
    'Italic: _italicy_\n' +
    'Monospace: `$code`\n' +
    'Citations: _-- citation_\n' +
    'Strikethrough: ~strikethrough~\n' +
    'Not Strikethrough: i-use-dashes\n' +
    'Code: ```some code```\n' +
    'Unnamed Link: <http://someurl.com>\n' +
    'Named Link: <http://someurl.com|Someurl>\n' +
    'Blockquote: \n> This is quoted\n';

  const response = J2S.toJira(stashFormat);

  assert.equal(response, expectedText, 'JIRA Markup should be converted to Slack Markup');
  assert.end();
});

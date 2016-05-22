# JIRA 2 Slack
[![npm version](https://badge.fury.io/js/jira2slack.svg)](https://badge.fury.io/js/jira2slack) [![Build Status](https://travis-ci.org/shaunburdick/jira2slack.svg?branch=master)](https://travis-ci.org/shaunburdick/jira2slack) [![Coverage Status](https://coveralls.io/repos/github/shaunburdick/jira2slack/badge.svg?branch=master)](https://coveralls.io/github/shaunburdick/jira2slack?branch=master)  [![js-semistandard-style](https://img.shields.io/badge/code%20style-semistandard-brightgreen.svg)](https://github.com/Flet/semistandard)

Library to convert between JIRA markup and Slack markup

## Example
```
const J2S = require('jira2slack');

const slackMD = J2S.toSlack('*This* _is_ -some- ^over^ ~formatted~ {{text}}');
// *This* _is_ ~some~ ^over -formatted- `text`
```

## Conversions
Below are the conversions that are made:

### Jira -> Slack
| Format | JIRA | Slack | Destructive | Notes |
| ------ | ---- | ----- | ----------- | ----- |
| Headers | `h1. Heading` | `\n *Heading*\n` | Yes | Slack doesn't support headers so library converts headers to bolded text on it's own line |
| Bold   | `*bold*` | `*bold*` | Sometimes | [[1]](notes) |
| Italic | `_italic_` | `_italic_` | Sometimes | [[1]](notes) |
| Unordered List | <br>`* Bulleted List`<br>`** Indented more`<br>`* Indented less` | <br>`• Bulleted List`<br>`..• Indented more`<br>`• Indented less` | No |[[2]](notes) |
| Unordered Dash List | `- Bulleted Dash List`<br>`- Bulleted Dash List`<br>`- Bulleted Dash List` | `• Bulleted Dash List`<br>`• Bulleted Dash List`<br>`• Bulleted Dash List` | Yes | Ambigious result from Bulleted list so reversal results in use of astericks |
|Ordered List | `# Numbered List`<br>`## Indented more`<br>`## Indented more`<br>`### Indented morer`<br>`### Indented morer`<br>`### Indented morer`<br>`## Indented more`<br>`# Indented less` | `1. Numbered List`<br>`..1. Indented more`<br>`..2. Indented more`<br>`....1. Indented morer`<br>`....2. Indented morer`<br>`....3. Indented morer`<br>`..3. Indented more`<br>`2. Indented less` | No | [[1]](notes) |
| Monospaced | `{{code}}` | `` `code` `` | No | |
| Citations | `??citation??` | `-- citation_` | Yes | Slack doesn't have citations, but I can replicate resulting format |
| Subscript | `~subscript~` | `_subscript` | Yes | Slack doesn't have subscript, but I denote it with a single underscore |
| Superscript | `^superscript^` | `^superscript` | Yes | Slack doesn't have superscript, but I denote it with a single carret |
| Strikethrough | `-strikethrough-` | `~strikethrough~` | Sometimes | [[1]](notes) |
| Code | `{code}some code{code}` | `` ```some code``` `` | Yes | Slack doesn't support specify the language, so that is removed during conversion |
| Quotes | `{quote}quoted text{quote}` | `` ```quoted text``` `` | Yes | Slack does't support quoted text so the library uses preformmated `` ``` `` instead. This makes it impossible to convert back. |
| Pre-formatted Text | `{noformat}pre text{noformat}` | `` ```pre text``` `` | Yes | Slack does't support no format text so the library uses preformmated `` ``` `` instead. This makes it impossible to convert back. |
| Unnamed Link | `[http://someurl.com]` | `<http://someurl.com>` | No | |
| Named Link | `Someurl|http://someurl.com]` | `<http://someurl.com|Someurl>` | No | |
| Blockquote | `bq. This is quoted` | `> This is quoted` | Sometimes | Slack doesn't support multi-line blockquotes (>>>) so thos are ignored |
| Color | `{color:white}This is white text{color}` | `This is white text` | Yes | Slack doesn't support colored text so it is removed. |
| Panel | `{panel:title=foo}Panel Contents{panel}` | Panel: <br>&#124; foo &#124;<br>&#124; --- &#124;<br>&#124; Panel Contents &#124; | Yes | Slack doesn't support panels, so the library attempts to replicate the format. This makes it impossible to convert back. |
| Table | &#124;&#124;heading 1&#124;&#124;heading 2&#124;&#124;<br>&#124;col A1&#124;col B1&#124;<br>&#124;col A2&#124;col B2&#124; | &#124;heading 1&#124;heading 2&#124;<br>&#124; --- &#124; --- &#124;<br>&#124;col A1&#124;col B1&#124;<br>&#124;col A2&#124;col B2&#124; | No | |


### Notes
1. JIRA supports spaces at the beginning and end of a markdown section (ex `_ foo _`) where Slack does not. To match the formatting, the library moves those spaces outside the formatter (ex `_ foo _` becomes ` _foo_ `). While the result works in both JIRA and Slack, it is technically destructive.
2. `.` indicate whitespace (` `), not a literal .

## Acknowledgments
Special thanks to Kyle Farris for his [JIRA to Markdown library](https://github.com/kylefarris/J2M)

## Contributing
1. Create a new branch, please don't work in master directly.
2. Add failing tests for the change you want to make (if appliciable). Run `npm test` to see the tests fail.
3. Fix stuff.
4. Run `npm test` to see if the tests pass. Repeat steps 2-4 until done.
5. Update the documentation to reflect any changes.
6. Push to your fork and submit a pull request.

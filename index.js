'use strict';

/**
 * Convert JIRA markdown to Slack markdown
 *
 * @param {string} jiraMD The JIRA markdown
 * @return {string} The Slack markdown
 */
function toSlack (jiraMD) {
  let depths = [];
  let lastDepth = 0;

  return jiraMD
    // Quotes
    .replace(/\{quote\}/g, '```')

    // Stolen from: https://github.com/kylefarris/J2M
    // Un-ordered Lists
    .replace(/^[ \t]*(\*+)\s+/gm, (match, stars) => `${Array(stars.length).join('  ')}• `)
    .replace(/^-\s+/gm, () => '• ')

    // Ordered lists
    .replace(/^[ \t]*(#+)\s+/gm, (match, nums) => {
      const curDepth = nums.length - 1;
      if (curDepth === lastDepth) {
        depths[curDepth] = depths[curDepth] !== undefined ? depths[curDepth] + 1 : 1;
      } else if (curDepth > lastDepth) {
        depths[curDepth] = 1;
      } else {
        depths = depths.slice(0, curDepth + 1);
        depths[curDepth]++;
      }

      lastDepth = curDepth;
      return `${Array(curDepth + 1).join('  ')}${depths[curDepth]}. `;
    })

    // Headers 1-6
    .replace(/^h([0-6])\.(\s*)(.*)$/gm,
      (match, level, spacing, content) => `\n${spacing}*${content}*\n`)

    // Bold
    .replace(/\*(\s*)(\S.*?\S)(\s*)\*/g, '$1*$2*$3')

    // Italic
    .replace(/_(\s*)(\S.*?\S)(\s*)_/g, '$1_$2_$3')

    // Monospaced text
    .replace(/\{\{(.+?)\}\}/g, '`$1`')

    // Citations
    .replace(/\?\?([^??]+)\?\?/g, '_-- $1_')

    // Superscript
    .replace(/\^([^^]*)\^/g, '^$1')

    // Subscript
    .replace(/~([^~]*)~/g, '_$1')

    // Smart Links
    .replace(/\[([^[\]|]+?)\|([^[\]|]+?)\|(smart-link)\]/g, '<$1>')

    // Strikethrough
    .replace(/((\W)-|(^)-)( *)(\S.*?\S)( *)(-(\W)|-($))/gm, '$2$3$4~$5~$6$8')

    // Code Block
    .replace(/\{code(:([a-z]+))?\}([^]*)\{code\}/gm, '```$2$3```')

    // Pre-formatted text
    .replace(/{noformat}/g, '```')

    // Un-named Links
    .replace(/\[([^|{}\\^~[\]\s"`]+\.[^|{}\\^~[\]\s"`]+)\]/g, '<$1>')

    // Named Links
    .replace(/\[([^[\]|]+?)\|([^[\]|]+?)\]/g, '<$2|$1>')

    // Single Paragraph Blockquote
    .replace(/^bq\.\s+/gm, '> ')

    // Remove color: unsupported in md
    .replace(/\{color:[^}]+\}([^]*?)\{color\}/gm, '$1')

    // panel into table
    .replace(/\{panel:title=([^}]*)\}\n?([^]*?)\n?\{panel\}/gm, '\n| $1 |\n| --- |\n| $2 |')

    // table header
    .replace(/^[ \t]*((?:\|\|.*?)+\|\|)[ \t]*$/gm, (match, headers) => {
      const singleBarred = headers.replace(/\|\|/g, '|');
      return `\n${singleBarred}\n${singleBarred.replace(/\|[^|]+/g, '| --- ')}`;
    })

    // remove leading-space of table headers and rows
    .replace(/^[ \t]*\|/gm, '|');
}

/**
 * Convert JIRA markdown to Slack markdown
 *
 * @param {string} slackMD The Slack markdown
 * @return {string} The JIRA markdown
 */
function toJira (slackMD) {
  return slackMD
    // Quotes
    .replace(/```/g, '{code}')

    // Stolen from: https://github.com/kylefarris/J2M
    // Un-ordered Lists
    .replace(/^( *)• /gm, (match, spaces) => `*${Array((spaces.length / 2) + 1).join('*')} `)

    // Ordered lists
    .replace(/^( *)\d\.\s+/gm, (match, depth) => `#${Array((depth.length / 2) + 1).join('#')} `)

    // Headers 1-6
    .replace(/^\n?( *)\*([^*]+)\*\n/g,
      (match, level, content) => `h${level.length}. ${content}`)

    // Monospaced text
    .replace(/`([^`]+)`/g, '{{$1}}')

    // Citations
    .replace(/_-- ([^(_)]+)_/g, '??$1??')

    // Strikethrough
    .replace(/((\W)~|(^)~)(\S.*?\S)(~(\W)|~($))/gm, '$2-$4-$6')

    // Un-named Links
    .replace(/<([^|]+)>/g, '[$1]')

    // Named Links
    .replace(/<(.+)\|(.+?)>/g, '[$2|$1]')

    // Single Paragraph Blockquote
    .replace(/^> /gm, 'bq. ')

    // panel into table
    .replace(/\{panel:title=([^}]*)\}\n?([^]*?)\n?\{panel\}/gm, '\n| $1 |\n| --- |\n| $2 |')

    // table header
    .replace(/^[ \t]*((?:\|\|.*?)+\|\|)[ \t]*$/gm, (match, headers) => {
      const singleBarred = headers.replace(/\|\|/g, '|');
      return `\n${singleBarred}\n${singleBarred.replace(/\|[^|]+/g, '| --- ')}`;
    })

    // remove leading-space of table headers and rows
    .replace(/^[ \t]*\|/gm, '|');
}

module.exports = {
  toSlack,
  toJira
};

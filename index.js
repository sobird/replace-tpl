/**
 * @see https://github.com/webpack/webpack/blob/master/lib/TemplatedPathPlugin.js
 * sobird<i@sobird.me> at 2020/08/05 14:50:47 created.
 */

const REGEXP_HASH = /\[hash(?::(\d+))?\]/gi;
const REGEXP_CHUNKHASH = /\[chunkhash(?::(\d+))?\]/gi;
const REGEXP_MODULEHASH = /\[modulehash(?::(\d+))?\]/gi;
const REGEXP_CONTENTHASH = /\[contenthash(?::(\d+))?\]/gi;
const REGEXP_NAME = /\[name\]/gi;
const REGEXP_ID = /\[id\]/gi;
const REGEXP_MODULEID = /\[moduleid\]/gi;
const REGEXP_FILENAME = /\[filename\]/gi;
const REGEXP_BASENAME = /\[basename\]/gi;
const REGEXP_EXT = /\[ext\]/gi;
const REGEXP_QUERY = /\[query\]/gi;
const REGEXP_URL = /\[url\]/gi;
const REGEXP_AT = /\@/gi;

const withHashLength = (replacer, handlerFn, assetInfo) => {
  const fn = (match, hashLength, ...args) => {
    if (assetInfo) assetInfo.immutable = true;
    const length = hashLength && parseInt(hashLength, 10);
    if (length && handlerFn) {
      return handlerFn(length);
    }
    const hash = replacer(match, hashLength, ...args);
    return length ? hash.slice(0, length) : hash;
  };
  return fn;
};

const getReplacer = (value, allowEmpty) => {
  const fn = (match, ...args) => {
    // last argument in replacer is the entire input string
    const input = args[args.length - 1];
    if (value === null || value === undefined) {
      if (!allowEmpty) {
        throw new Error(
          `Path variable ${match} not implemented in this context: ${input}`
        );
      }
      return "";
    } else {
      return `${escapePathVariables(value)}`;
    }
  };
  return fn;
};

const escapePathVariables = value => {
  return typeof value === "string"
    ? value.replace(/\[(\\*[\w:]+\\*)\]/gi, "[\\$1\\]")
    : value;
};

module.exports = (path, data = {}, assetInfo) => {
  const name = data.name;
  const hash = data.hash
  const chunkName = data.chunkName;
  const chunkHash = data.chunkHash;
  const contentHash = data.contentHash;
  const moduleHash = data.moduleHash;
  const chunkId = data.chunkId;
  const moduleId = data.moduleId;
  const extname = data.extname;
  const basename = data.basename;
  const filename = data.filename;
  const at = data.at;

  if (typeof path === "function") {
    path = path(data);
  }

  return (
    path
      .replace(
        REGEXP_HASH,
        withHashLength(getReplacer(hash))
      )
      .replace(
        REGEXP_CHUNKHASH,
        withHashLength(getReplacer(chunkHash), null, assetInfo)
      )
      .replace(
        REGEXP_CONTENTHASH,
        withHashLength(
          getReplacer(contentHash),
          null,
          assetInfo
        )
      )
      .replace(
        REGEXP_MODULEHASH,
        withHashLength(getReplacer(moduleHash), null, assetInfo)
      )
      .replace(REGEXP_ID, getReplacer(chunkId))
      .replace(REGEXP_MODULEID, getReplacer(moduleId))
      .replace(REGEXP_NAME, getReplacer(name))
      .replace(REGEXP_FILENAME, getReplacer(filename))
      .replace(REGEXP_BASENAME, getReplacer(basename))
      .replace(REGEXP_EXT, getReplacer(extname))
      // query is optional, it's OK if it's in a path but there's nothing to replace it with
      .replace(REGEXP_QUERY, getReplacer(data.query, true))
      // only available in sourceMappingURLComment
      .replace(REGEXP_AT, getReplacer(at))
      .replace(/\[\\(\\*[\w:]+\\*)\\\]/gi, "[$1]")
  );
};

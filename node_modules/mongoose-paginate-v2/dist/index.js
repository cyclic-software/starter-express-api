"use strict";

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * @param {Object}              [query={}]
 * @param {Object}              [options={}]
 * @param {Object|String}       [options.select='']
 * @param {Object|String}       [options.projection={}]
 * @param {Object}              [options.options={}]
 * @param {Object|String}       [options.sort]
 * @param {Object|String}       [options.customLabels]
 * @param {Object}              [options.collation]
 * @param {Array|Object|String} [options.populate]
 * @param {Boolean}             [options.lean=false]
 * @param {Boolean}             [options.leanWithId=true]
 * @param {Number}              [options.offset=0] - Use offset or page to set skip position
 * @param {Number}              [options.page=1]
 * @param {Number}              [options.limit=10]
 * @param {Boolean}             [options.useEstimatedCount=true] - Enable estimatedDocumentCount for larger datasets. As the name says, the count may not abe accurate.
 * @param {Function}            [options.useCustomCountFn=false] - use custom function for count datasets.
 * @param {Object}              [options.read={}] - Determines the MongoDB nodes from which to read.
 * @param {Function}            [callback]
 *
 * @returns {Promise}
 */
var PaginationParametersHelper = require('./pagination-parameters');

var paginateSubDocsHelper = require('./pagination-subdocs');

var defaultOptions = {
  customLabels: {
    totalDocs: 'totalDocs',
    limit: 'limit',
    page: 'page',
    totalPages: 'totalPages',
    docs: 'docs',
    nextPage: 'nextPage',
    prevPage: 'prevPage',
    pagingCounter: 'pagingCounter',
    hasPrevPage: 'hasPrevPage',
    hasNextPage: 'hasNextPage',
    meta: null
  },
  collation: {},
  lean: false,
  leanWithId: true,
  limit: 10,
  projection: {},
  select: '',
  options: {},
  pagination: true,
  useEstimatedCount: false,
  useCustomCountFn: false,
  forceCountFn: false,
  allowDiskUse: false,
  customFind: 'find'
};

function paginate(query, options, callback) {
  options = _objectSpread(_objectSpread(_objectSpread({}, defaultOptions), paginate.options), options);
  query = query || {};
  var _options = options,
      collation = _options.collation,
      lean = _options.lean,
      leanWithId = _options.leanWithId,
      populate = _options.populate,
      projection = _options.projection,
      read = _options.read,
      select = _options.select,
      sort = _options.sort,
      pagination = _options.pagination,
      useEstimatedCount = _options.useEstimatedCount,
      useCustomCountFn = _options.useCustomCountFn,
      forceCountFn = _options.forceCountFn,
      allowDiskUse = _options.allowDiskUse,
      customFind = _options.customFind;

  var customLabels = _objectSpread(_objectSpread({}, defaultOptions.customLabels), options.customLabels);

  var limit = defaultOptions.limit;

  if (pagination) {
    limit = parseInt(options.limit, 10) > 0 ? parseInt(options.limit, 10) : 0;
  }

  var isCallbackSpecified = typeof callback === 'function';
  var findOptions = options.options;
  var offset;
  var page;
  var skip;
  var docsPromise = []; // Labels

  var labelDocs = customLabels.docs;
  var labelLimit = customLabels.limit;
  var labelNextPage = customLabels.nextPage;
  var labelPage = customLabels.page;
  var labelPagingCounter = customLabels.pagingCounter;
  var labelPrevPage = customLabels.prevPage;
  var labelTotal = customLabels.totalDocs;
  var labelTotalPages = customLabels.totalPages;
  var labelHasPrevPage = customLabels.hasPrevPage;
  var labelHasNextPage = customLabels.hasNextPage;
  var labelMeta = customLabels.meta;

  if (Object.prototype.hasOwnProperty.call(options, 'offset')) {
    offset = parseInt(options.offset, 10);
    skip = offset;
  } else if (Object.prototype.hasOwnProperty.call(options, 'page')) {
    page = parseInt(options.page, 10) < 1 ? 1 : parseInt(options.page, 10);
    skip = (page - 1) * limit;
  } else {
    offset = 0;
    page = 1;
    skip = offset;
  }

  if (!pagination) {
    page = 1;
  }

  var countPromise;

  if (forceCountFn === true) {
    // Deprecated since starting from MongoDB Node.JS driver v3.1
    // Hack for mongo < v3.4
    if (Object.keys(collation).length > 0) {
      countPromise = this.count(query).collation(collation).exec();
    } else {
      countPromise = this.count(query).exec();
    }
  } else {
    if (useEstimatedCount === true) {
      countPromise = this.estimatedDocumentCount().exec();
    } else if (typeof useCustomCountFn === 'function') {
      countPromise = useCustomCountFn();
    } else {
      // Hack for mongo < v3.4
      if (Object.keys(collation).length > 0) {
        countPromise = this.countDocuments(query).collation(collation).exec();
      } else {
        countPromise = this.countDocuments(query).exec();
      }
    }
  }

  if (limit) {
    var mQuery = this[customFind](query, projection, findOptions);

    if (populate) {
      mQuery.populate(populate);
    }

    mQuery.select(select);
    mQuery.sort(sort);
    mQuery.lean(lean);

    if (read && read.pref) {
      /**
       * Determines the MongoDB nodes from which to read.
       * @param read.pref one of the listed preference options or aliases
       * @param read.tags optional tags for this query
       */
      mQuery.read(read.pref, read.tags);
    } // Hack for mongo < v3.4


    if (Object.keys(collation).length > 0) {
      mQuery.collation(collation);
    }

    if (pagination) {
      mQuery.skip(skip);
      mQuery.limit(limit);
    }

    try {
      if (allowDiskUse === true) {
        mQuery.allowDiskUse();
      }
    } catch (ex) {
      console.error('Your MongoDB version does not support `allowDiskUse`.');
    }

    docsPromise = mQuery.exec();

    if (lean && leanWithId) {
      docsPromise = docsPromise.then(function (docs) {
        docs.forEach(function (doc) {
          if (doc._id) {
            doc.id = String(doc._id);
          }
        });
        return docs;
      });
    }
  }

  return Promise.all([countPromise, docsPromise]).then(function (values) {
    var _values = _slicedToArray(values, 2),
        count = _values[0],
        docs = _values[1];

    var meta = {
      [labelTotal]: count
    };
    var result = {};

    if (typeof offset !== 'undefined') {
      meta.offset = offset;
      page = Math.ceil((offset + 1) / limit);
    }

    var pages = limit > 0 ? Math.ceil(count / limit) || 1 : null; // Setting default values

    meta[labelLimit] = count;
    meta[labelTotalPages] = 1;
    meta[labelPage] = page;
    meta[labelPagingCounter] = (page - 1) * limit + 1;
    meta[labelHasPrevPage] = false;
    meta[labelHasNextPage] = false;
    meta[labelPrevPage] = null;
    meta[labelNextPage] = null;

    if (pagination) {
      meta[labelLimit] = limit;
      meta[labelTotalPages] = pages; // Set prev page

      if (page > 1) {
        meta[labelHasPrevPage] = true;
        meta[labelPrevPage] = page - 1;
      } else if (page == 1 && typeof offset !== 'undefined' && offset !== 0) {
        meta[labelHasPrevPage] = true;
        meta[labelPrevPage] = 1;
      } // Set next page


      if (page < pages) {
        meta[labelHasNextPage] = true;
        meta[labelNextPage] = page + 1;
      }
    } // Remove customLabels set to false


    delete meta['false'];

    if (limit == 0) {
      meta[labelLimit] = 0;
      meta[labelTotalPages] = 1;
      meta[labelPage] = 1;
      meta[labelPagingCounter] = 1;
      meta[labelPrevPage] = null;
      meta[labelNextPage] = null;
      meta[labelHasPrevPage] = false;
      meta[labelHasNextPage] = false;
    }

    if (labelMeta) {
      result = {
        [labelDocs]: docs,
        [labelMeta]: meta
      };
    } else {
      result = _objectSpread({
        [labelDocs]: docs
      }, meta);
    }

    return isCallbackSpecified ? callback(null, result) : Promise.resolve(result);
  }).catch(function (error) {
    return isCallbackSpecified ? callback(error) : Promise.reject(error);
  });
}
/**
 * @param {Schema} schema
 */


module.exports = function (schema) {
  schema.statics.paginate = paginate;
  schema.statics.paginateSubDocs = paginateSubDocsHelper;
};

module.exports.PaginationParameters = PaginationParametersHelper;
module.exports.paginateSubDocs = paginateSubDocsHelper;
module.exports.paginate = paginate;
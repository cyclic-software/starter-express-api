"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * Pagination process for sub-documents
 * internally, it would call `query.findOne`, return only one document
 *
 * @param {Object} query
 * @param {Object} options
 * @param {Function} callback
 */
function paginateSubDocs(query, options, callback) {
  /**
   * Populate sub documents with pagination fields
   *
   * @param {Object} query
   * @param {Object} populate origin populate option
   * @param {Object} option
   */
  function getSubDocsPopulate(option) {
    // options properties for sub-documents pagination
    var populate = option.populate,
        _option$page = option.page,
        page = _option$page === void 0 ? 1 : _option$page,
        _option$limit = option.limit,
        limit = _option$limit === void 0 ? 10 : _option$limit;

    if (!populate) {
      throw new Error('populate is required');
    }

    var offset = (page - 1) * limit;
    option.offset = offset;
    var pagination = {
      skip: offset,
      limit: limit
    };

    if (typeof populate === 'string') {
      populate = _objectSpread({
        path: populate
      }, pagination);
    } else if (typeof populate === 'object' && !Array.isArray(populate)) {
      populate = Object.assign(populate, pagination);
    }

    option.populate = populate;
    return populate;
  }

  function populateResult(result, populate, callback) {
    return result.populate(populate, callback);
  }
  /**
   * Convert result of sub-docs list to pagination like docs
   *
   * @param {Object} result query result
   * @param {Object} option pagination option
   */


  function constructDocs(paginatedResult, option) {
    var populate = option.populate,
        _option$offset = option.offset,
        offset = _option$offset === void 0 ? 0 : _option$offset,
        _option$page2 = option.page,
        page = _option$page2 === void 0 ? 1 : _option$page2,
        _option$limit2 = option.limit,
        limit = _option$limit2 === void 0 ? 10 : _option$limit2;
    var path = populate.path;
    var count = option.count;
    var paginatedDocs = paginatedResult[path];

    if (!paginatedDocs) {
      throw new Error(`Parse error! Cannot find key on result with path ${path}`);
    }

    page = Math.ceil((offset + 1) / limit); // set default meta

    var meta = {
      docs: paginatedDocs,
      totalDocs: count || 1,
      limit: limit,
      page: page,
      prevPage: null,
      nextPage: null,
      hasPrevPage: false,
      hasNextPage: false
    };
    var totalPages = limit > 0 ? Math.ceil(count / limit) || 1 : null;
    meta.totalPages = totalPages;
    meta.pagingCounter = (page - 1) * limit + 1; // Set prev page

    if (page > 1) {
      meta.hasPrevPage = true;
      meta.prevPage = page - 1;
    } else if (page == 1 && offset !== 0) {
      meta.hasPrevPage = true;
      meta.prevPage = 1;
    } // Set next page


    if (page < totalPages) {
      meta.hasNextPage = true;
      meta.nextPage = page + 1;
    }

    if (limit == 0) {
      meta.limit = 0;
      meta.totalPages = 1;
      meta.page = 1;
      meta.pagingCounter = 1;
    }

    Object.defineProperty(paginatedResult, path, {
      value: meta,
      writable: false
    });
  } // options properties for main document query


  var populate = options.populate,
      _options$read = options.read,
      read = _options$read === void 0 ? {} : _options$read,
      _options$select = options.select,
      select = _options$select === void 0 ? '' : _options$select,
      _options$pagination = options.pagination,
      pagination = _options$pagination === void 0 ? true : _options$pagination,
      pagingOptions = options.pagingOptions,
      projection = options.projection;
  var mQuery = this.findOne(query, projection);

  if (read && read.pref) {
    /**
     * Determines the MongoDB nodes from which to read.
     * @param read.pref one of the listed preference options or aliases
     * @param read.tags optional tags for this query
     */
    mQuery.read(read.pref, read.tags);
  }

  if (select) {
    mQuery.select(select);
  }

  return new Promise(function (resolve, reject) {
    mQuery.exec().then(function (result) {
      var newPopulate = [];

      if (populate) {
        newPopulate.push(newPopulate);
      }

      if (pagination && pagingOptions) {
        if (Array.isArray(pagingOptions)) {
          pagingOptions.forEach(function (option) {
            var populate = getSubDocsPopulate(option);
            option.count = result[populate.path].length;
            newPopulate.push(populate);
          });
        } else {
          var _populate = getSubDocsPopulate(pagingOptions);

          pagingOptions.count = result[_populate.path].length;
          newPopulate.push(_populate);
        }
      }

      populateResult(result, newPopulate, function (err, paginatedResult) {
        if (err) {
          callback(err, null);
          reject(err);
          return;
        } // convert paginatedResult to pagination docs


        if (pagination && pagingOptions) {
          if (Array.isArray(pagingOptions)) {
            pagingOptions.forEach(function (option) {
              constructDocs(paginatedResult, option);
            });
          } else {
            constructDocs(paginatedResult, pagingOptions);
          }
        }

        callback && callback(null, paginatedResult);
        resolve(paginatedResult);
      });
    }).catch(function (err) {
      console.error(err.message);
      callback && callback(err, null);
    });
  });
}

module.exports = paginateSubDocs;
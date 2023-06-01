"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var PaginationParametersHelper = /*#__PURE__*/function () {
  function PaginationParametersHelper(request) {
    _classCallCheck(this, PaginationParametersHelper);

    this.query = request.query;
  }
  /**
   * Handle boolean options
   * If the 'option'-Parameter is a string, check if it equals 'true'
   * If not, it should be a boolean, and can be returned as it is.
   *
   * @param {string|boolean} option
   * @return {boolean}
   * */


  _createClass(PaginationParametersHelper, [{
    key: "booleanOpt",
    value: function booleanOpt(option) {
      return typeof option === 'string' ? option === 'true' : option;
    }
    /**
     * Handle options that are strings or objects (including arrays)
     *
     * @param {object|string} option
     * @return {object|string}
     * */

  }, {
    key: "optObjectOrString",
    value: function optObjectOrString(option) {
      // Since the JSON in the query object will be strings,
      // we need to be able to detect this, in order to differentiate between JSON-objects and pure strings.
      // a pure string, e.g. 'field -test', might not be parsed as wished by JSON.parse
      var openingBrackets = ['{', '['];
      var closingBrackets = ['}', ']'];
      var firstCharIsBracket = option[0] && openingBrackets.includes(option[0]);
      var lastCharIsBracket = option[option.length - 1] && closingBrackets.includes(option[option.length - 1]);
      var optionIsObject = firstCharIsBracket && lastCharIsBracket;

      try {
        return optionIsObject ? JSON.parse(option) : option;
      } catch (err) {
        // Fallback for parsing errors of objects
        return {};
      }
    }
    /**
     * Yields the "query" parameter for Model.paginate()
     * given any attributes of the Express req.query-Object,
     * */

  }, {
    key: "getQuery",
    value: function getQuery() {
      var _this$query;

      var filtersQueryParameter = (_this$query = this.query) === null || _this$query === void 0 ? void 0 : _this$query.query;
      if (!filtersQueryParameter) return {};

      try {
        return JSON.parse(filtersQueryParameter);
      } catch (err) {
        return {};
      }
    }
    /**
     * Yields the "options" parameter for Model.paginate(),
     * given any attributes of the Express req.query-Object
     * */

  }, {
    key: "getOptions",
    value: function getOptions() {
      if (!this.query) return {};
      var options = {}; // Instantiate variables with all the possible options for Model.paginate()

      var select = this.query.select,
          collation = this.query.collation,
          sort = this.query.sort,
          populate = this.query.populate,
          projection = this.query.projection,
          lean = this.query.lean,
          leanWithId = this.query.leanWithId,
          offset = this.query.offset,
          page = this.query.page,
          limit = this.query.limit,
          customLabels = this.query.customLabels,
          pagination = this.query.pagination,
          useEstimatedCount = this.query.useEstimatedCount,
          useCustomCountFn = this.query.useCustomCountFn,
          forceCountFn = this.query.forceCountFn,
          allowDiskUse = this.query.allowDiskUse,
          read = this.query.read,
          mongooseOptions = this.query.options; // For every option that is set, add it to the 'options' object-literal

      if (select) options['select'] = this.optObjectOrString(select);
      if (collation) options['collation'] = this.optObjectOrString(collation);
      if (sort) options['sort'] = this.optObjectOrString(sort);
      if (populate) options['populate'] = this.optObjectOrString(populate);
      if (projection !== undefined) options['projection'] = this.optObjectOrString(projection);
      if (lean !== undefined) options['lean'] = this.booleanOpt(lean);
      if (leanWithId !== undefined) options['leanWithId'] = this.booleanOpt(leanWithId);
      if (offset) options['offset'] = Number(offset);
      if (page) options['page'] = Number(page);
      if (limit) options['limit'] = Number(limit);
      if (customLabels) options['customLabels'] = this.optObjectOrString(customLabels);
      if (pagination !== undefined) options['pagination'] = this.booleanOpt(pagination);
      if (useEstimatedCount !== undefined) options['useEstimatedCount'] = this.booleanOpt(useEstimatedCount);
      if (useCustomCountFn !== undefined) options['useCustomCountFn'] = this.booleanOpt(useCustomCountFn);
      if (forceCountFn !== undefined) options['forceCountFn'] = this.booleanOpt(forceCountFn);
      if (allowDiskUse) options['allowDiskUse'] = this.booleanOpt(allowDiskUse);
      if (read) options['read'] = this.optObjectOrString(read);
      if (mongooseOptions) options['options'] = this.getOptions(mongooseOptions);
      return options;
    }
    /**
     * Yields an array with positions:
     * [0] "query" parameter, for Model.paginate()
     * [1] "options" parameter, for Model.paginate()
     * */

  }, {
    key: "get",
    value: function get() {
      return [_objectSpread({}, this.getQuery()), _objectSpread({}, this.getOptions())];
    }
  }]);

  return PaginationParametersHelper;
}();

module.exports = PaginationParametersHelper;
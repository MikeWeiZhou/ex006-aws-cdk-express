/**
 * Constants.
 *
 * DO NOT CHANGE THESE UNLESS DROPPING DATABASE AND RE-CREATING SCHMEA FROM SCRATCH.
 */
export const constants = {
  /**
   * Maximum length of constraint identifiers in MySQL 5.7.
   * https://dev.mysql.com/doc/refman/5.7/en/identifier-length.html
   */
  MAX_MYSQL_CONTSTRAINT_ID_LENGTH: 64,

  /**
   * Maximum length of index identifiers in MySQL 5.7.
   * https://dev.mysql.com/doc/refman/5.7/en/identifier-length.html
   */
  MAX_MYSQL_INDEX_ID_LENGTH: 64,

  /**
   * Maximum unsigned integer value in MySQL 5.7.
   * https://dev.mysql.com/doc/refman/5.7/en/integer-types.html
   */
  MAX_MYSQL_UNSIGNED_INT_VALUE: 4294967295,
};

/**
 * Constants.
 *
 * DO NOT CHANGE THESE UNLESS DROPPING DATABASE AND RE-CREATING SCHMEA FROM SCRATCH.
 */
export const constants = {
  // ----------------------------------------
  // Resource Identifier Length
  // ----------------------------------------
  /** Length of resource ID prefix. */
  RESOURCE_ID_PREFIX_LENGTH: 4,
  /** Length of generated portion of resource ID. */
  RESOURCE_ID_GENERATED_LENGTH: 21,
  /**
   * Total length of resource ID.
   * RESOURCE_ID_PREFIX_LENGTH + RESOURCE_ID_GENERATED_LENGTH
   */
  RESOURCE_ID_TOTAL_LENGTH: 25,

  // ----------------------------------------
  // MySQL Identifier Length
  // ----------------------------------------
  /**
   * Maximum length of constraint identifiers in MySQL.
   * https://dev.mysql.com/doc/refman/5.7/en/identifier-length.html
   */
  MAX_MYSQL_CONTSTRAINT_ID_LENGTH: 64,
  /**
   * Maximum length of index identifiers in MySQL.
   * https://dev.mysql.com/doc/refman/5.7/en/identifier-length.html
   */
  MAX_MYSQL_INDEX_ID_LENGTH: 64,
};

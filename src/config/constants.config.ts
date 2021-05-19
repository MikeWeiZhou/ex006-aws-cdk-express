/**
 * Constants.
 *
 * DO NOT CHANGE THESE UNLESS DROPPING DATABASE AND RE-CREATING SCHMEA FROM SCRATCH.
 */
export default {
  /**
   * Length of resource ID prefix.
   */
  RESOURCE_ID_PREFIX_LENGTH: 4,
  /**
   * Length of generated portion of resource ID.
   */
  RESOURCE_ID_GENERATED_LENGTH: 21,
  /**
   * Total length of resource ID.
   * RESOURCE_ID_PREFIX_LENGTH + RESOURCE_ID_GENERATED_LENGTH
   */
  RESOURCE_ID_TOTAL_LENGTH: 25,
};

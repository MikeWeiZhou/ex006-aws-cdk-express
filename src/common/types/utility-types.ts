// ----------------------------------------
// GENERAL TYPES
// ----------------------------------------

/**
 * Construct type that makes all keys optional, except for selected keys.
 */
export type PartialExcept<Type, Keys extends keyof Type> =
  // take all keys of Type except selected Keys
  // then, make them all partial
  Partial<Omit<Type, Keys>> &
  // take Keys that were omitted in previous step
  Pick<Type, Keys>;

// ----------------------------------------
// TYPES FOR SERVICES
// ----------------------------------------

/**
 * Construct type merging properties of a model and update DTO.
 *
 * This allows updating of properties not specified in update DTO.
 */
export type ServiceUpdateType<Model, UpdateDto> =
  // take all keys of ModelDto except: keys that also exist in Y, 'createdAt', 'deletedAt'
  // then, make them all partial
  Partial<Omit<Model, keyof UpdateDto | 'createdAt' | 'deletedAt'>> &
  // take all keys of UpdateDto
  UpdateDto;

/**
 * Construct type that removes 'id', 'createdAt', and 'updatedAt',
 * then makes remaining keys optional.
 *
 * Used as criteria selection in services.
 */
export type ServiceCriteraType<Model> =
  // contains resource ID
  { id: string; } &
  // and a mixture of criteria
  { [P in keyof Omit<Model, 'id' | 'createdAt' | 'updatedAt'>]?: Model[P]; };

/**
 * Constructs a type merging properties of a model and update DTO.
 *
 * This allows updating of properties not specified in update DTO.
 */
export type ServiceUpdateOverwrite<Model, UpdateDto> =
  // take all keys of ModelDto except: keys that also exist in Y, 'createdAt', 'deletedAt'
  // then, make them all partial
  Partial<Omit<Model, keyof UpdateDto | 'createdAt' | 'deletedAt'>> &
  // all keys of UpdateDto
  UpdateDto;

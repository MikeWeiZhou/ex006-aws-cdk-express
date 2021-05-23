/**
 * Constructs a type merging properties of a model DTO and update DTO.
 *
 * This allows updating of properties not specified in update DTO.
 */
export type ServiceUpdateOverwrite<ModelDto, UpdateDto> =
  // take all keys of ModelDto except: keys that also exist in Y, 'createdAt', 'deletedAt'
  // then, make them all partial
  Partial<Omit<ModelDto, keyof UpdateDto | 'createdAt' | 'deletedAt'>> &
  // all keys of UpdateDto
  UpdateDto;

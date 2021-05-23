#!/usr/bin/env -S npx ts-node -r tsconfig-paths/register
/* eslint-disable no-console */

const [,, target] = process.argv;

/**
 * Print generated create DTO JSON for specified model.
 *
 * Dependent entites will not be created.
 * For example, if creating a Customer, a Company will not be created.
 * Therefore, the Customer.companyId will be a generated ID that does not exist.
 *
 * @param targetModel generate create DTO for this model, all lowercase (e.g. company)
 */
async function printCreateDto(targetModel: string): Promise<void> {
  const modelFaker = (await import(`../tests/core/faker/${targetModel}.faker`))[targetModel];
  const createDto = await modelFaker.dto(undefined, true);
  const prettyJson = JSON.stringify(createDto, null, 2);
  console.log(prettyJson);
}

console.log(`\nGenerating create model DTO for: ${target}\n`);
printCreateDto(target);

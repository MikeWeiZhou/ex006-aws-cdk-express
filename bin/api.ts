#!/usr/bin/env -S npx ts-node -r tsconfig-paths/register
/* eslint-disable no-multi-spaces */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-console */
import minimist from 'minimist';

// extract arguments from command line
const argv = minimist(process.argv.slice(2));
const {
  env,        // env = 'dev' | 'test'
  _,          // _ = arguments without options (e.g. ['create', 'company'])
  pipe,       // pipe = pipe data from command line (e.g. --pipe=1)
  ...apiArgs  // apiArgs = other options sent to API (e.g. --companyId=com_5PMpQ9EMOHh2iRBPxM4T_)
} = argv;
// arguments without options
const [targetModel, methodName] = _;

/**
 * Valid methods for a faker library.
 */
type ValidMethods = 'dto' | 'create';

// Override environment variables for different environments
if (env === 'test') {
  console.log('TEST ENVIRONMENT');
} else {
  console.log('DEV ENVIRONMENT');
  process.env.EAR_TEST_API_PORT = process.env.EAR_API_PORT;
}

/**
 * Reads input from stdin. Used for piping data from command line.
 * @returns input string
 */
async function readInput(): Promise<string> {
  return new Promise((resolve, reject) => {
    const { stdin } = process;
    stdin.setEncoding('utf-8');

    let data: string = '';
    stdin.on('data', (chunk: string) => {
      data += chunk;
    });

    stdin.on('end', () => resolve(data));
    stdin.on('error', reject);
  });
}

/**
 * Use model faker libraries from Jest test suite to create fake entries in database or just
 * print a generated DTO JSON for specified model.
 *
 * @param method method name of faker library to invoke
 * @param model generate create DTO for this model, all lowercase (e.g. company)
 * @param args read argument function or arguments object
 */
async function invoke(method: ValidMethods, model: string, args?: any): Promise<void> {
  const input = (typeof args === 'function')
    ? JSON.parse(await args())
    : args;
  const modelCamelCase = model.replace(
    /[-][a-z]/ig,
    ($1) => $1.toUpperCase().replace('-', ''),
  );
  const modelFaker = (await import(`../tests/core/faker/${model}.faker`))[modelCamelCase];
  const response = await modelFaker[method](input, true);
  const prettyJson = JSON.stringify(response, null, 2);
  console.log(prettyJson);
}

console.log(`\nInvoking '${methodName}' for model: '${targetModel}'\n`);
invoke(
  methodName as ValidMethods,
  targetModel,
  (pipe) ? readInput : apiArgs,
);

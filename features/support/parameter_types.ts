import { defineParameterType } from '@cucumber/cucumber';

// Registers a custom parameter type '{rand}' for Gherkin steps.
// Matches amounts like 300.00, R300.00 or "300.00" (with or without quotes).
defineParameterType({
  name: 'rand',
  regexp: /"?R?\d+(?:\.\d{2})?"?/,
  // Strips the quotes and the R before the value reaches the step code
  transformer: (val: string) => val.replace(/["R]/g, '').trim()
});

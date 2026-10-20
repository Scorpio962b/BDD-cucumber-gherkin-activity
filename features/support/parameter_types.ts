import { defineParameterType } from '@cucumber/cucumber';

// Registers a custom parameter type '{rand}' for Gherkin steps
defineParameterType({
  name: 'rand',
  // Regexp matches optional 'R' prefix followed by digits and optional cents (.00)
  regexp: /R?\d+(?:\.\d{2})?/,
  // Transformer automatically cleans the value before passing it to step code
  transformer: (val: string) => val.replace('R', '').trim()
});

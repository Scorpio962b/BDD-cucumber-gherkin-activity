import { defineParameterType } from '@cucumber/cucumber';

defineParameterType({
  name: 'rand',
  regexp: /R?\d+(?:\.\d{2})?/,
  transformer: (val: string) => val.replace('R', '').trim()
});
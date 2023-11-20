# 🇿🇦 south-african-id-validator 🇿🇦

Dead simple validator for South African ID numbers. Takes eligibility age into account (16 years).

This validator returns the following if the ID Number is valid

- Gender
- Date of birth
- Citizenship

## Usage

Install using NPM / Yarn

```bash
npm i south-african-id-validator
```

```bash
yarn add south-african-id-validator
```

```js
import { parseDOB, parseCitizenship, parseGender, validateIdNumber } from "south-african-id-validator";

// all functions take ID number string as input eg:
validateIdNumber(
  ID_NUMBER_TO_VALIDATE // string
);

// examples
console.log(parseDOB('7311190013080'));
// Date -> Mon Nov 19 1973 00:00:00 GMT+0200 (South Africa Standard Time)
console.log(parseCitizenship('7311190013080'));
// true
console.log(parseGender('7311190013080'));
// "female"
console.log(validateIdNumber('7311190013080'));
// { DOB: Mon Nov 19 1973 00:00:00 GMT+0200 (South Africa Standard Time), gender: "female", isCitizen: true, valid: true }
```

### Demo

[https://codesandbox.io/s/compassionate-northcutt-ft0o8](https://codesandbox.io/s/compassionate-northcutt-ft0o8)

import Ajv, { Schema } from "ajv";

const ajv = new Ajv();

export const ValidateRequest = <T>(requestBody: unknown, schema: Schema) => {
  const validatedData = ajv.compile(schema);

  if (!validatedData(requestBody)) {
    return false;
  }

  const errors = validatedData.errors?.map((error) => error.message);

  return errors && errors[0];
};

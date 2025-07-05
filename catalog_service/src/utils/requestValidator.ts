import { ClassConstructor, plainToClass } from "class-transformer";
import { validate } from "class-validator";

const validationError = async (input: any) => {
  const errors = await validate(input, { validationError: { target: true } });

  if (errors.length) {
    return errors;
  }

  return false;
};

export const RequestValidator = async <T>(
  type: ClassConstructor<T>,
  body: any
) => {
  const input = plainToClass(type, body);
  const errors = await validationError(input);

  if (errors) {
    const errorMessages = errors.map((error) => error.constraints);
    return { errors: errorMessages, input };
  }

  return { errors: false, input };
};

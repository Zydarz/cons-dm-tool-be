import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { ClassConstructor } from 'class-transformer';

export const CheckAcZeroOrTcZero =
  <T>(type: ClassConstructor<T>, property: (o: T) => any, validationOptions?: ValidationOptions) =>
  (object: any, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [property],
      validator: CheckAcZeroOrTcZeroConstraint,
    });
  };

@ValidatorConstraint({ name: 'CheckAcZeroOrTcZero' })
export class CheckAcZeroOrTcZeroConstraint implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    const [fn] = args.constraints;
    return fn(args.object) !== 0 || value !== 0;
  }

  defaultMessage(args: ValidationArguments) {
    return `Ac and tc are not simultaneously zero `;
  }
}

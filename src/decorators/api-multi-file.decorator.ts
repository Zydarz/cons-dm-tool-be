import { ApiBody } from '@nestjs/swagger';

export const ApiMultipleFile =
  (fileName = 'files'): MethodDecorator =>
  (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    ApiBody({
      schema: {
        type: 'array',
        items: {
          type: 'string',
          format: 'binary',
        },
      },
    })(target, propertyKey, descriptor);
  };

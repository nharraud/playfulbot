import { describe, expect, test } from 'vitest';
import * as yup from 'yup';
import { ValidationError } from '~playfulbot/core/use-cases/Errors';
import { validateSchema } from '~playfulbot/infrastructure/validateSchema';


describe('infrastructure/validateSchema', () => {
  test('should return no error if the data is valid', async () => {
    const schema = yup.object().shape({
      name: yup.string().max(15).min(3).required(),
    });
    const error = await validateSchema(schema, { name: 'aaa' }, 'invalid data');
    expect(error).to.be.null;
  });

  test('should return an error if the data does not validate the schema', async () => {
    const schema = yup.object().shape({
      name: yup.string().max(15).min(3).required(),
    });
    const error = await validateSchema(schema, { name: 'a' }, 'invalid data');
    expect(error).toMatchObject(new ValidationError('invalid data', { name: ['foo']}));
  });

  test('should return nested errors', async () => {
    const schema = yup.object().shape({
      nested1: yup.object().shape({
        name: yup.string().max(15).min(3).required()
      }),
      nested2: yup.object().shape({
        deeper: yup.object().shape({
          myarray: yup.array().of(
            yup.object().shape({
              deepName: yup.string().max(15).min(4).required()
            })
          ).length(1).required()
        }).required(),
      }).required(),
    });
    const error = await validateSchema(schema, { nested2: { deeper: { myarray: [{ deepName: 42 }] }}}, 'invalid data');
    expect(error).toEqual(new ValidationError('invalid data'));
    expect(error.validationErrors).toEqual({
      'nested1.name': [
        'nested1.name is a required field',
      ],
      'nested2.deeper.myarray[0].deepName': [
        'nested2.deeper.myarray[0].deepName must be at least 4 characters',
      ],
    });
  });
});
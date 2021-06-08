import { DateTime } from "luxon";
import { MixedSchema } from "yup";
import Ref from "yup/lib/Reference";
import isAbsent from "yup/lib/util/isAbsent";
import { Message } from "yup/lib/types";

export interface DateTimeLocale {
  min?: Message<{ min: DateTime | string }>;
  max?: Message<{ max: DateTime | string }>;
  required?: Message<{ max: DateTime | string }>;
}

/* eslint-disable no-template-curly-in-string */
export let dateTime: Required<DateTimeLocale> = {
  min: '${path} field must be later than ${min}',
  max: '${path} field must be at earlier than ${max}',
  required: '${path} is a required field',
};
/* eslint-enable no-template-curly-in-string */

const invalidDate = DateTime.fromISO('');

export class DateTimeSchema extends MixedSchema<DateTime, Record<never, never>> {
  static create (): DateTimeSchema {
    return new DateTimeSchema();
  }

  constructor() {
    super({ type: 'DateTime' });

    this.withMutation(() => {
      this.transform(function (value) {
        if (this.isType(value)) return value;

        if (typeof value === 'string') {
          return DateTime.fromISO(value);
        }

        if (typeof value === 'number') {
          return DateTime.fromMillis(value);
        }

        // 0 is a valid timestamp equivalent to 1970-01-01T00:00:00Z(unix epoch) or before.
        return !isNaN(value) ? new Date(value) : invalidDate;
      });
    });
  }


  _typeCheck (_value: unknown): _value is DateTime {
    return DateTime.isDateTime(_value) && _value.isValid;
  }

  private prepareParam(
    ref: unknown | Ref<DateTime>,
    name: string,
  ): DateTime | Ref<DateTime> {
    let param: DateTime | Ref<DateTime>;

    if (!Ref.isRef(ref)) {
      let cast = this.cast(ref);
      if (!this._typeCheck(cast))
        throw new TypeError(
          `\`${name}\` must be a DateTime or a value that can be \`cast()\` to a DateTime`,
        );
      param = cast;
    } else {
      param = ref as Ref<DateTime>;
    }
    return param;
  }

  min(min: DateTime | Ref<DateTime>, message = dateTime.min) {
    let limit = this.prepareParam(min, 'min');

    return this.test({
      message,
      name: 'min',
      exclusive: true,
      params: { min },
      test(value) {
        return isAbsent(value) || value >= this.resolve(limit);
      },
    });
  }

  max(max: DateTime | Ref<DateTime>, message = dateTime.max) {
    var limit = this.prepareParam(max, 'max');

    return this.test({
      message,
      name: 'max',
      exclusive: true,
      params: { max },
      test(value) {
        return isAbsent(value) || value <= this.resolve(limit);
      },
    });
  }
}
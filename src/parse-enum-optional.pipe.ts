import {
  ArgumentMetadata,
  HttpStatus,
  Injectable,
  Optional,
} from "@nestjs/common/index";
import { PipeTransform } from "@nestjs/common/interfaces/features/pipe-transform.interface";
import {
  ErrorHttpStatusCode,
  HttpErrorByCode,
} from "@nestjs/common/utils/http-error-by-code.util";

export interface ParseEnumOptionalPipeOptions {
  errorHttpStatusCode?: ErrorHttpStatusCode;
  exceptionFactory?: (error: string) => any;
}

/**
 * Defines the ParseEnum Optional Pipe
 *
 * same as the Built-in Pipe by the NestJS team, but also validates null values.
 *
 * @see [Built-in Pipes](https://docs.nestjs.com/pipes#built-in-pipes)
 *
 * @publicApi
 */
@Injectable()
export class ParseEnumOptionalPipe<T = any> implements PipeTransform<T> {
  protected exceptionFactory: (error: string) => any;

  constructor(
    protected readonly enumType: T,
    @Optional() options?: ParseEnumOptionalPipeOptions
  ) {
    if (!enumType) {
      throw new Error(
        `"ParseEnumPipe" requires "enumType" argument specified (to validate input values).`
      );
    }
    options = options || {};
    const { exceptionFactory, errorHttpStatusCode = HttpStatus.BAD_REQUEST } =
      options;

    this.exceptionFactory =
      exceptionFactory ||
      ((error) => new HttpErrorByCode[errorHttpStatusCode](error));
  }

  /**
   * Method that accesses and performs optional transformation on argument for
   * in-flight requests.
   *
   * @param value currently processed route argument
   * @param metadata contains metadata about the currently processed route argument
   */
  async transform(value: T, metadata: ArgumentMetadata): Promise<T> {
    if (value == undefined) return undefined;
    if (!this.isEnum(value)) {
      throw this.exceptionFactory(
        "Validation failed (enum string is expected)"
      );
    }
    return value;
  }

  protected isEnum(value: T): boolean {
    const enumValues = Object.keys(this.enumType).map(
      (item) => this.enumType[item]
    );
    return enumValues.includes(value);
  }
}

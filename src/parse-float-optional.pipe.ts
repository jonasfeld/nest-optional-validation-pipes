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

export interface ParseFloatOptionalPipeOptions {
  errorHttpStatusCode?: ErrorHttpStatusCode;
  exceptionFactory?: (error: string) => any;
}

/**
 * Defines the ParseFloat Optional Pipe
 *
 * same as the Built-in Pipe by the NestJS team, but also validates null values.
 *
 * @see [Built-in Pipes](https://docs.nestjs.com/pipes#built-in-pipes)
 *
 * @publicApi
 */
@Injectable()
export class ParseFloatOptionalPipe implements PipeTransform<string> {
  protected exceptionFactory: (error: string) => any;

  constructor(@Optional() options?: ParseFloatOptionalPipeOptions) {
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
  async transform(value: string, metadata: ArgumentMetadata): Promise<number> {
    const isNumeric =
      ["string", "number"].includes(typeof value) &&
      !isNaN(parseFloat(value)) &&
      isFinite(value as any);

    if (value == undefined) return undefined;

    if (!isNumeric) {
      throw this.exceptionFactory(
        "Validation failed (numeric string is expected)"
      );
    }
    return parseFloat(value);
  }
}

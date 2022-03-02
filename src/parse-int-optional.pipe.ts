import { Injectable } from "@nestjs/common/decorators/core/injectable.decorator";
import { Optional } from "@nestjs/common/decorators/core/optional.decorator";
import { HttpStatus } from "@nestjs/common/enums/http-status.enum";
import {
  ArgumentMetadata,
  PipeTransform,
} from "@nestjs/common/interfaces/features/pipe-transform.interface";
import {
  ErrorHttpStatusCode,
  HttpErrorByCode,
} from "@nestjs/common/utils/http-error-by-code.util";

export interface ParseIntOptionalPipeOptions {
  errorHttpStatusCode?: ErrorHttpStatusCode;
  exceptionFactory?: (error: string) => any;
}

/**
 * Defines the ParseInt Optional Pipe
 *
 * same as the Built-in Pipe by the NestJS team, but also validates null values.
 *
 * @see [Built-in Pipes](https://docs.nestjs.com/pipes#built-in-pipes)
 *
 * @publicApi
 */
@Injectable()
export class ParseIntOptionalPipe implements PipeTransform<string> {
  protected exceptionFactory: (error: string) => any;

  constructor(@Optional() options?: ParseIntOptionalPipeOptions) {
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
    if (value == undefined) return undefined;

    const isNumeric =
      ["string", "number"].includes(typeof value) &&
      /^-?\d+$/.test(value) &&
      isFinite(value as any);
    if (!isNumeric) {
      throw this.exceptionFactory(
        "Validation failed (numeric string is expected)"
      );
    }
    return parseInt(value, 10);
  }
}

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

export interface ParseBoolOptionalPipeOptions {
  errorHttpStatusCode?: ErrorHttpStatusCode;
  exceptionFactory?: (error: string) => any;
}

/**
 * Defines the ParseBool Optional Pipe
 *
 * same as the Built-in Pipe by the NestJS team, but also validates null values.
 *
 * @see [Built-in Pipes](https://docs.nestjs.com/pipes#built-in-pipes)
 *
 * @publicApi
 */
@Injectable()
export class ParseBoolOptionalPipe
  implements PipeTransform<string | boolean, Promise<boolean>>
{
  protected exceptionFactory: (error: string) => any;

  constructor(@Optional() options?: ParseBoolOptionalPipeOptions) {
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
  async transform(
    value: string | boolean,
    metadata: ArgumentMetadata
  ): Promise<boolean> {
    if (value == undefined) return undefined;
    if (value === true || value === "true") {
      return true;
    }
    if (value === false || value === "false") {
      return false;
    }
    throw this.exceptionFactory(
      "Validation failed (boolean string is expected)"
    );
  }
}

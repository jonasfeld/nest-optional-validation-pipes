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
import { isUUID } from "@nestjs/common/utils/is-uuid";

export interface ParseUUIDOptionalPipeOptions {
  version?: "3" | "4" | "5";
  errorHttpStatusCode?: ErrorHttpStatusCode;
  exceptionFactory?: (errors: string) => any;
}

/**
 * Defines the ParseUUID Optional Pipe
 *
 * same as the Built-in Pipe by the NestJS team, but also validates null values.
 *
 * @see [Built-in Pipes](https://docs.nestjs.com/pipes#built-in-pipes)
 *
 * @publicApi
 */
@Injectable()
export class ParseUUIDOptionalPipe implements PipeTransform<string> {
  private readonly version: "3" | "4" | "5";
  protected exceptionFactory: (errors: string) => any;

  constructor(@Optional() options?: ParseUUIDOptionalPipeOptions) {
    options = options || {};
    const {
      exceptionFactory,
      errorHttpStatusCode = HttpStatus.BAD_REQUEST,
      version,
    } = options;

    this.version = version;
    this.exceptionFactory =
      exceptionFactory ||
      ((error) => new HttpErrorByCode[errorHttpStatusCode](error));
  }
  async transform(value: string, metadata: ArgumentMetadata): Promise<string> {
    if (value == undefined) return undefined;

    if (!isUUID(value, this.version)) {
      throw this.exceptionFactory(
        `Validation failed (uuid ${
          this.version ? "v" + this.version : ""
        } is expected)`
      );
    }
    return value;
  }
}

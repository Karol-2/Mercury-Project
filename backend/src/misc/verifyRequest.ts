import { Errors } from "../models/Response.js";
import { RegisterUser } from "../users.js";

export interface PageQuery {
  page: string;
  maxUsers: string;
}

export interface Page {
  page: number;
  maxUsers: number;
}

export interface SearchQuery extends PageQuery {
  q: string;
  country: string;
}

export interface SearchVerified extends Page {
  q: string;
  country: string;
}

export type VerifyResult<T> = ValidResult<T> | InvalidResult;

export type ValidResult<T> = {
  valid: true;
  verified: T;
};

export type InvalidResult = {
  valid: false;
  errors: Errors;
};

class Verifier<T> {
  errors: Errors = {};
  verified: Record<keyof T & string, any> = {} as any;
  obj: T;

  constructor(obj: T) {
    this.obj = obj;
  }

  private fail(key: keyof T & string, message: string) {
    this.errors[key] = message;
    return null;
  }

  private pass<V>(key: keyof T & string, value: V): V {
    this.verified[key] = value;
    return value;
  }

  getErrors(): Errors | null {
    for (const _ in this.errors) {
      return this.errors;
    }

    return null;
  }

  verifyAscii<K extends keyof T>(
    key: K & string,
    allowEmpty: boolean = false,
  ): string | null {
    const value = this.obj[key];

    if (!allowEmpty) {
      if (!value) {
        return this.fail(key, "not provided");
      }
    } else if (value === undefined) {
      return this.pass(key, "");
    }

    if (typeof value !== "string") {
      return this.fail(key, "incorrect");
    }

    if (!/^[a-zA-Z ]*$/.test(value)) {
      return this.fail(key, "not a valid string");
    }

    return this.pass(key, value);
  }

  verifyString<K extends keyof T>(
    key: K & string,
    allowEmpty: boolean = false,
  ): string | null {
    const value = this.obj[key];

    if (!allowEmpty) {
      if (!value) {
        return this.fail(key, "not provided");
      }
    } else if (value === undefined) {
      return this.pass(key, "");
    }

    if (typeof value !== "string") {
      return this.fail(key, "incorrect");
    }

    return this.pass(key, value);
  }

  verifyMail<K extends keyof T>(key: K & string): string | null {
    const value = this.obj[key]

    if (typeof value !== "string") {
      return this.fail(key, "incorrect");
    }

    const mailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!(mailRegex.test(value))) {
      return this.fail(key, "incorrect")
    }
    
    return this.pass(key, value)
  }

  verifyInteger<K extends keyof T>(key: K & string): number | null {
    const value = this.obj[key];

    if (!value) {
      return this.fail(key, "not provided");
    }

    if (typeof value !== "string") {
      return this.fail(key, "incorrect");
    }

    if (!/^[0-9]+$/.test(value)) {
      return this.fail(key, "not a number");
    }

    return this.pass(key, Number(value));
  }

  verifyLength<K extends keyof T>(
    key: K & string,
    start: number | null,
    end: number | null
  ): string | null {
    const value = this.obj[key];

    if (typeof value !== "string") {
      return this.fail(key, "incorrect")
    }

    if (start !== null && value.length < start) {
      return this.fail(key, "too short")
    }

    if (end !== null && value.length > end) {
      return this.fail(key, "too long")
    }

    return this.pass(key, value);
  }
}

export function verifyPageQuery<T extends PageQuery>(
  query: T,
): VerifyResult<Page> {
  const verifier = new Verifier(query);
  verifier.verifyInteger("page");
  verifier.verifyInteger("maxUsers");

  const errors = verifier.getErrors();

  if (errors) {
    return { valid: false, errors };
  }

  return { valid: true, verified: verifier.verified };
}

export function verifySearchQuery<T extends SearchQuery>(
  query: T,
): VerifyResult<SearchVerified> {
  const verifier = new Verifier(query);
  verifier.verifyInteger("page");
  verifier.verifyInteger("maxUsers");
  verifier.verifyString("q", true);
  verifier.verifyString("country", true);

  const errors = verifier.getErrors();

  if (errors) {
    return { valid: false, errors };
  }

  return { valid: true, verified: verifier.verified };
}

export function verifyRegisterUser<T extends RegisterUser>(
  user: T
): VerifyResult<RegisterUser> {
  // TODO: improve field validation
  const verifier = new Verifier(user);
  verifier.verifyLength("first_name", 2, null);
  verifier.verifyLength("last_name", 2, null);
  verifier.verifyMail("mail");
  verifier.verifyLength("password", 8, null);

  const errors = verifier.getErrors();

  if (errors) {
    return {valid: false, errors}
  }

  return {valid: true, verified: verifier.verified}
}

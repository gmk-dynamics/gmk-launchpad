declare global {
  namespace Express {
    interface Request {
      validatedbody?: unknown;
      validatedparams?: unknown;
      validatedquery?: unknown;
    }
  }
}

export {};

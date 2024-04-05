export type typePayload = {
  perPage?: number;
  lastKnown?: string;
  sortOrder?: string;
};

export type typeResultData = {
  Items: {
    configurationId: string | undefined;
    requestLimits:
      | {
          windowMs: number;
          max: number;
        }
      | undefined;
    concurrency:
      | {
          max: number;
        }
      | undefined;
    createdAtMs: string | undefined;
    updatedAtMs: string | undefined;
  }[];
  lastKnown: string;
  perPage: number;
};

export type typeResultError = {
  code: string;
  message: string;
};

export type typeResult = {
  data: null | typeResultData;
  error: null | typeResultError;
};

export type typePayload = {
  requestLimits: {
    windowMs: number;
    max: number;
  };
  concurrency: {
    max: number;
  };
};
export type typeResultData = {
  configurationId: string;
  requestLimits: {
    windowMs: number;
    max: number;
  };
  concurrency: {
    max: number;
  };
  createdAtMs: string;
  updatedAtMs: string;
};

export type typeResultError = {
  code: string;
  message: string;
};

export type typeResult = {
  data: null | typeResultData;
  error: null | typeResultError;
};

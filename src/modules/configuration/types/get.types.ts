export type typePayload = {
  configurationId: string;
  isPrimary?: boolean;
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
  isPrimary: boolean;
  createdAtMs: number;
  updatedAtMs: number;
};

export type typeResultError = {
  code: string;
  message: string;
};

export type typeResult = {
  data: null | typeResultData;
  error: null | typeResultError;
};

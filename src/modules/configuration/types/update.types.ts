export type typePayload = {
  configurationId: string;
  isPrimary?: boolean;
  requestLimits?: {
    windowMs?: number;
    max?: number;
  };
  concurrency?: {
    max?: number;
  };
};

export type typeResultData = {
  code: string;
  message: string;
};

export type typeResultError = {
  code: string;
  message: string;
};

export type typeResult = {
  data: null | typeResultData;
  error: null | typeResultError;
};

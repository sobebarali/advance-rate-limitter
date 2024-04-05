export type typePayload = {
  configurationId: string;
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

export const CheckExisting = (data: any, CustomError, message?: string) => {
  if (!data) throw new CustomError(message);
  else return data;
};

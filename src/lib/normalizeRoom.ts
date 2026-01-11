export const normalizeRoom = (input: any) => {
  if (!input) return null;

  if (input.room) return input.room;
  if (input.data?.room) return input.data.room;
  if (input.data) return input.data;

  return input;
};

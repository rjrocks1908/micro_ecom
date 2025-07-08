type Create = (input: any) => Promise<any>;
type Get = (input: any) => Promise<any>;
type Update = (input: any) => Promise<any>;
type Delete = (input: any) => Promise<any>;

export type CartRepositoryType = {
  create: Create;
  get: Get;
  update: Update;
  delete: Delete;
}

export type FullFilePath = string;
export type LinkData = {
  title: string;
  /**Just the name of the file itself and not its path*/
  filename: string;
  filepath: FullFilePath;
  redirect_to: string;
  section: string;
  shouldBeCreated: boolean;
  shouldBeIndexed: boolean;
};
export type LinkDataWithUrl = LinkData & {
  url: string;
};

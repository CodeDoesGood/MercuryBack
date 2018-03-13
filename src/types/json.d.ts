declare module '*.json' {
  export interface IDirectories {
    doc: string;
    test: string;
    build: string;
  }

  const name: string;
  const version: string;
  const description: string;
  const author: string;
  const license: string;
  const directories: IDirectories;
}

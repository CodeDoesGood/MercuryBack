import * as crypto from 'crypto';
import * as fs from 'fs';
import * as _ from 'lodash';

import { defaultConfig, IConfig } from './configuration.default';

export class Configuration {
  public folder: string;
  public file: string;
  public homeDirectory: string;
  public folderDir: string;
  public path: string;
  public default: IConfig;
  public configuration: IConfig;

  constructor(folder: string, name: string) {
    if (_.isNil(folder)) {
      throw new Error('Foolder cannot be null or undefined');
    } else if (!_.isString(folder)) {
      throw new Error('Folder must be a string');
    }

    if (_.isNil(name)) {
      throw new Error('name cannot be null or undefined');
    } else if (!_.isString(name)) {
      throw new Error('name must be of type string');
    }

    // the folder
    this.folder = folder;

    // the file name
    this.file = name;

    // Home directory that will be used for storing the file
    this.homeDirectory = null;

    // Setting the home directory
    this.getUserHome();

    // The directory to the folder path that will used
    this.folderDir = `${this.homeDirectory}${this.folder}`;

    // The current full configuration path
    this.path = `${this.homeDirectory}${this.folder}/${this.file}`;

    // The current default configuration
    this.default = defaultConfig;

    // The configuration that will be loaded into memory
    this.configuration = this.load();
  }

  /**
   * Updates the current configuration file with the provided content.
   * @param {object} content The configuration that will be set
   */
  public update(content: IConfig) {
    if (this.exists().file) {
      this.bind(content);
      fs.writeFileSync(this.path, JSON.stringify(content, null, '\t'));
    }
  }

  /**
   * Return a value from the configuration based on the key
   * @param key string
   */
  public getKey(key: string) {
    return this.configuration[key];
  }

  /**
   * Returns the default configuration from the default file
   */
  public getDefault(): IConfig {
    return this.default;
  }

  /**
   * Returns the whole configuration content
   */
  public getConfiguration(): IConfig {
    return this.configuration;
  }

  /**
   * Loads the configuration file and store it in memory and
   * if no configuration exists, create it.
   */
  private load(): IConfig {
    let configuration: IConfig = this.getDefault();
    const exists = this.exists();

    if (exists.folder && exists.file) {
      configuration = JSON.parse(fs.readFileSync(this.path, 'utf8'));
      return configuration;
    }

    this.create();
    return configuration;
  }

  /**
   * returns true for both the folder and the file
   */
  private exists(): { folder: boolean; file: boolean; } {
    return {
      file: fs.existsSync(this.path),
      folder: fs.existsSync(this.folderDir),
    };
  }

  /**
   * Creates the configuration file and folder with the class details.
   */
  private create(): void {
    const exists: { folder: boolean; file: boolean; } = this.exists();
    if (!exists.folder) {
      fs.mkdirSync(this.folderDir);
    }

    if (!exists.file) {
      this.default.secret = crypto.randomBytes(128).toString('base64');
      fs.writeFileSync(this.path, JSON.stringify(this.default, null, '\t'));
    }
  }

  /**
   * Sets the current configuration to be used.
   * @param {object} content The content that will be set
   */
  private bind(content: IConfig) {
    this.configuration = content;
  }

  /**
   * Returns the home directory of the active user
   */
  private getUserHome() {
    this.homeDirectory = process.env[(process.platform === 'win32') ? 'USERPROFILE' : 'HOME'].replace(/\\/g, '/');
    if (this.homeDirectory.indexOf('/', this.homeDirectory.length - '/'.length) === -1) {
      this.homeDirectory = `${this.homeDirectory}/`;
    }
  }
}

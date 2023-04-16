export default class Genially {
  private static readonly NAME_LENGTH = {
    MIN: 3,
    MAX: 20
  };
  private static readonly DESCRIPTION_MAX_LENGTH = 125;

  private _id: string;
  private _name: string;
  private _description: string;
  private _createdAt: Date;
  private _modifiedAt: Date;
  private _deletedAt: Date;

  constructor(id: string, name: string, description?: string) {
    this._id = id;
    this._name = name;
    this._description = description;
    this._createdAt = new Date();
  }

  static get geniallyValidations() {
    return {
      NAME_LENGTH: Genially.NAME_LENGTH,
      DESCRIPTION_MAX_LENGTH: Genially.DESCRIPTION_MAX_LENGTH
    };
  }

  get id(): string {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  get description(): string {
    return this._description;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get modifiedAt(): Date {
    return this._modifiedAt;
  }

  get deletedAt(): Date {
    return this._deletedAt;
  }

  /***
   * These methods export an instance of genially adding fields not initialized in constructor
   * @param obj
   */
  fromObject(obj: any): Genially {
    if(obj.hasOwnProperty("_id")) this._id = obj._id;
    if(obj.hasOwnProperty("_name")) this._name = obj._name;
    if(obj.hasOwnProperty("_description")) this._description = obj._description;
    if(obj.hasOwnProperty("_createdAt")) this._createdAt = obj._createdAt;
    if(obj.hasOwnProperty("_modifiedAt")) this._modifiedAt = obj._modifiedAt;
    if(obj.hasOwnProperty("_deletedAt")) this._deletedAt = obj._deletedAt;

    return this;
  }

  rename(name: string): Genially {
    this._name = name;
    this._modifiedAt = new Date();
    return this;
  }

  delete(): void {
    this._deletedAt = new Date();
  }
}

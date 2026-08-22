export interface ImageStorage {
  save(file: File): Promise<string>;
  remove(url: string): Promise<void>;
}

/** Member 1 accepts hosted image URLs; a managed provider can implement this interface later. */
export class ExternalImageStorage implements ImageStorage {
  async save(_file: File): Promise<string> {
    void _file;
    throw new Error("Direct file uploads are not configured. Provide a hosted image URL.");
  }

  async remove() {
    return;
  }
}

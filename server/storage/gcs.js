const {Storage} = require('@google-cloud/storage');

function getStorageClient(projectId) {
    const storage = new Storage({
        projectId: projectId,
      });
      return storage;
}

class GCSStorage {
  constructor(config, log) {
    this.bucket = config.bucket;
    this.log = log;
    this.client = getStorageClient(config.gcpProjectId)
  }

  async length(id) {
    const result = await this.client.bucket(this.bucket).file(id).get();
    return result.length;
  }

  getStream(id) {
    return this.client.bucket(this.bucket).file(id).createReadStream();
  }

  async set(id, file) {
    let hitLimit = false;
    const upload = await this.client.bucket(this.bucket).upload(file, {
        destination: id,
        gzip: true,
        metadata: {
            cacheControl: 'no-cache',
        },
    });
  }

  del(id) {
    return this.client.bucket(this.bucket).file(id).delete();
  }

  ping() {
    return this.client.bucket(this.bucket).exists();
  }
}

module.exports = GCSStorage;

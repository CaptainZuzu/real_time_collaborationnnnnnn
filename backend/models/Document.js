const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    default: ''
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  collaborators: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  lastModified: {
    type: Date,
    default: Date.now
  },
  isPublic: {
    type: Boolean,
    default: false
  },
  versions: [{
    content: String,
    version: Number,
    createdAt: {
      type: Date,
      default: Date.now
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }]
}, {
  timestamps: true
});

// Pre-save hook to update lastModified and create version
documentSchema.pre('save', async function(next) {
  this.lastModified = new Date();
  
  // Only create a new version if content has changed
  if (this.isModified('content')) {
    const lastVersion = this.versions[this.versions.length - 1];
    const newVersion = {
      content: this.content,
      version: lastVersion ? lastVersion.version + 1 : 1,
      createdAt: new Date(),
      createdBy: this.owner
    };
    this.versions.push(newVersion);
  }
  
  next();
});

// Method to get version history
documentSchema.methods.getVersionHistory = function() {
  return this.versions.map(version => ({
    version: version.version,
    createdAt: version.createdAt,
    createdBy: version.createdBy
  }));
};

// Method to restore a specific version
documentSchema.methods.restoreVersion = async function(versionNumber) {
  const version = this.versions.find(v => v.version === versionNumber);
  if (version) {
    this.content = version.content;
    await this.save();
    return true;
  }
  return false;
};

const Document = mongoose.model('Document', documentSchema);

module.exports = Document; 
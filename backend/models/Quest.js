const { Schema, model } = require('mongoose');

const QuestSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },

    title: {
      type: String,
      required: true,
    },

    targetDaysPerWeek: {
        type: Number, 
        required: true,
        min: 1,
        max: 7
    },
    reward: {
    type: String,
    required: true
    },

    xpPerCompletion: {
    type: Number,
    default: 10
    },

    completedDates: {
      type: [Date],
      default: [],   
    },
  },
  {
    timestamps: true, //  handles createdAt & updatedAt automatically
  }
);

module.exports = model('Quest', QuestSchema);
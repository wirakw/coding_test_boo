const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema(
  {
    profileId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Profile",
      required: true
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    // comment text
    title: {
      type: String,
      required: true
    },

    content: {
      type: String,
      required: true
    },

    // personality votes
    personality: {
      mbti: {
        type: String,
        enum: [
          "INTJ","INTP","ENTJ","ENTP",
          "INFJ","INFP","ENFJ","ENFP",
          "ISTJ","ISFJ","ESTJ","ESFJ",
          "ISTP","ISFP","ESTP","ESFP"
        ],
        default: null
      },
      zodiac: {
        type: String,
        enum: [
          "Aries","Taurus","Gemini","Cancer","Leo","Virgo",
          "Libra","Scorpio","Sagittarius","Capricorn","Aquarius","Pisces"
        ],
        default: null
      },
      enneagram: {
        type: String,
        enum: [
          "1w2","1w9",
          "2w1","2w3",
          "3w2","3w4",
          "4w3","4w5",
          "5w4","5w6",
          "6w5","6w7",
          "7w6","7w8",
          "8w7","8w9",
          "9w8","9w1"
        ],
        default: null
      }
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Comment", CommentSchema);

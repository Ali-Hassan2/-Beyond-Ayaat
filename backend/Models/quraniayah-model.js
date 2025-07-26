const mongoose = require("mongoose");

const quranayahSchema = new mongoose.model(
  "quranayah",
  mongoose.Schema(
    {
      surah_number: {
        type: number,
        required: true,
        min: 1,
        max: 2,
      },
      ayah_number: {
        type: number,
        require: true,
        min: 1,
        max: 144,
      },
      text_arabic: {
        type: String,
        required: true,
      },
      text_translation: {
        type: String,
        required: true,
      },
      tafseer_notes: {
        type: String,
        default: "",
      },
    },
    { timestamps: true }
  )
);
module.exports = quranayahSchema;

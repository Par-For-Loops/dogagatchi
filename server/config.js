require('dotenv').config();
const { ATLAS_URI } = process.env;

const { GOOGLE_CLIENT_ID } = process.env

const { GOOGLE_CLIENT_SECRET } = process.env

const { OPENAI_KEY } = process.env

module.exports = {
  ATLAS_URI,
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  OPENAI_KEY
};

'use strict';

const MBTI_TYPES = [
  'ISTJ', 'ISFJ', 'INFJ', 'INTJ',
  'ISTP', 'ISFP', 'INFP', 'INTP',
  'ESTP', 'ESFP', 'ENFP', 'ENTP',
  'ESTJ', 'ESFJ', 'ENFJ', 'ENTJ'
];

const ZODIAC_SIGNS = [
  'Aries', 'Taurus', 'Gemini', 'Cancer',
  'Leo', 'Virgo', 'Libra', 'Scorpio',
  'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
];

const ENNEAGRAM_TYPES = [
  '1w2', '1w9', '2w1', '2w3', '3w2', '3w4',
  '4w3', '4w5', '5w4', '5w6', '6w5', '6w7',
  '7w6', '7w8', '8w7', '8w9', '9w8', '9w1'
];

const MBTI_PATTERN = new RegExp(`^(${MBTI_TYPES.join('|')})$`);
const ZODIAC_PATTERN = new RegExp(`^(${ZODIAC_SIGNS.join('|')})$`);
const ENNEAGRAM_PATTERN = new RegExp(`^(${ENNEAGRAM_TYPES.join('|')})$`);

const isValidMBTI = (value) => MBTI_PATTERN.test(value);
const isValidZodiac = (value) => ZODIAC_PATTERN.test(value);
const isValidEnneagram = (value) => ENNEAGRAM_PATTERN.test(value);

module.exports = {
  MBTI_TYPES,
  ZODIAC_SIGNS,
  ENNEAGRAM_TYPES,
  MBTI_PATTERN,
  ZODIAC_PATTERN,
  ENNEAGRAM_PATTERN,
  isValidMBTI,
  isValidZodiac,
  isValidEnneagram
};

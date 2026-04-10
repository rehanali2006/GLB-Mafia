const Joi = require("joi");

const resourceSchema = Joi.object({
  title: Joi.string()
    .valid("Unit 1", "Unit 2", "Unit 3", "Unit 4", "Unit 5")
    .required(),

  image: Joi.string().uri().allow("").optional(),

  year: Joi.string().valid("First", "Second", "Third", "Fourth").required(),

  section: Joi.string()
    .pattern(/^[A-Z]$/)
    .allow("", null)
    .optional(),

  branch: Joi.string()
    .valid("CSE", "CSAIML", "ECE", "CSEAI", "IT", "ME", "CSDS", "AIDS", "CSH", "EEE")
    .allow("", null)
    .optional(),

  subject: Joi.string().required(),

  type: Joi.string().valid("Assignment", "Notes", "Paper").required(),
})
.custom((value, helpers) => {
  if (value.year === "First") {
    if (!value.section) {
      return helpers.error("any.custom", { message: "Section is required for First year" });
    }
  } else {
    if (!value.branch) {
      return helpers.error("any.custom", { message: "Branch is required for non-first years" });
    }
  }
  return value;
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

const signupSchema = Joi.object({
  username: Joi.string().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  confirmPassword: Joi.any().valid(Joi.ref("password")).required().messages({
    "any.only": "Passwords do not match",
  }),
});

module.exports = { resourceSchema, loginSchema, signupSchema };
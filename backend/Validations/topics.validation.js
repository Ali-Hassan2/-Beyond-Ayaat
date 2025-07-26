const z = require("z");

const topicvalidation = z.object({
  title: z.string().min(3, {
    message: "Topic shouldd be 3 chars",
  }),
  description: z.string().min(15, {
    message: "Description should be atleast 15 chars long",
  }),
  icon: z.string().min(1, {
    message: "Icon is required",
  }),
});

module.exports = topicvalidation;

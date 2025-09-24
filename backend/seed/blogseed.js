const dotenv = require("dotenv")
const mongoose = require("mongoose")
const colors = require("colors")
const blogsSchema = require("../Models/blogs-model")
dotenv.config()

const connect_db = async () => {
  try {
    const uri = process.env.MONGODB_URI
    if (!uri) {
      throw new Error(colors.bgRed("There is an error uri not defined"))
      process.exit(1)
    }
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    console.log(colors.green("MONGODB CONNECTED SUCCESSFULLY."))
  } catch (error) {
    console.log(colors.bgRed("There is an error", error))
    process.exit(1)
  }
}

const seed_blogs = async () => {
  try {
    const dummyBlogs = Array.from({ length: 15 }).map((_, i) => ({
      user_id: new mongoose.Types.ObjectId("68972f36de230b0c70343b23"),
      title: `Sample Blog ${i + 1}`,
      content: `This is the content of blog ${i + 1}. Random text for testing.`,
      topic_id: new mongoose.Types.ObjectId("68acad6ea2a84c8b3d4d37f0"),
      subtopic_id: new mongoose.Types.ObjectId("6888d9e14bc0c2d458625995"),
      status: "published",
      image: {
        public_id: `nnqw8sa6gohu3hbjiic1`,
        url: `http://res.cloudinary.com/drjwh3aaf/image/upload/v1758721548/nnqw8sa6gohu3hbjiic1.png}`,
      },
      comments: [
        {
          user_id: new mongoose.Types.ObjectId("68972f36de230b0c70343b23"),
          content: "Nice Blog!",
          createdAt: new Date(),
        },
      ],
    }))

    await blogsSchema.insertMany(dummyBlogs)

    console.log(colors.green("Dummy Blogs inserted successfully!"))
    process.exit(0)
  } catch (error) {
    console.log(colors.bgRed("Error seeding blogs:", error))
    process.exit(1)
  }
}

connect_db().then(seed_blogs)
